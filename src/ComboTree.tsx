import { eContentType, eLoadingState, FlowComponent, FlowField, FlowObjectData, FlowObjectDataProperty } from "flow-component-model";
import React, { CSSProperties } from "react";
import "./ComboTree.css";
import { ComboTreeItem, ComboTreeItems } from "./ComboTreeItem";
// declare const manywho: IManywho;
declare const manywho: any;

export default class ComboTree extends FlowComponent {

    retries: number = 0;
    loaded: boolean = false;
    idPropertyName: string;
    labelPropertyName: string;
    parentPropertyName: string;
    childrenPropertyName: string;
    stateValueTypeName: string;
    stateValueName: string;
    treeItems: ComboTreeItems;

    constructor(props: any) {
        super(props);
        this.flowMoved = this.flowMoved.bind(this);
        this.buildTree = this.buildTree.bind(this);
        this.toggleShow = this.toggleShow.bind(this);
        this.treeSelectionChanged = this.treeSelectionChanged.bind(this);
        this.state = {expanded: false};
    }

    async componentDidMount() {
        // will get this from a component attribute
        this.loaded=false;
        await super.componentDidMount();
        (manywho as any).eventManager.addDoneListener(this.flowMoved, this.componentId);
        this.loaded = true;
        await this.buildTree();
    }

    async componentWillUnmount() {
        await super.componentWillUnmount();
        (manywho as any).eventManager.removeDoneListener(this.componentId);
    }

    async flowMoved(xhr: any, request: any) {
        const me: any = this;
        if (xhr.invokeType === 'FORWARD') {
            if (this.loadingState !== eLoadingState.ready && this.retries < 20) {
                this.loaded=false;
                this.retries ++;
                console.log("retry " + this.retries + " after flow move");
                window.setTimeout(function() {me.flowMoved(xhr, request); }, 500);
            } else {
                this.retries = 0;
                this.loaded = true;
                await this.buildTree();
            }
        }

    }

    async buildTree() {
        //get the info on the attribute names
        this.idPropertyName = this.getAttribute("idPropertyName");
        this.labelPropertyName = this.getAttribute("labelPropertyName");
        this.parentPropertyName = this.getAttribute("parentPropertyName");
        this.childrenPropertyName = this.getAttribute("childrenPropertyName");
        this.stateValueTypeName = this.getAttribute("stateValueType");
        this.stateValueName = this.getAttribute("stateValueName");
        let stateField: FlowField = await this.loadValue(this.stateValueName);
        let state: FlowObjectData = stateField.value as FlowObjectData;
        this.treeItems = ComboTreeItems.parse(this.model.dataSource, this.idPropertyName, this.labelPropertyName, this.parentPropertyName, this.childrenPropertyName, this.treeSelectionChanged, state?.properties[this.idPropertyName]?.value as string);
        this.forceUpdate();
    }

    async treeSelectionChanged() {
        this.toggleShow(false);
        let stateField: FlowField = await this.loadValue(this.stateValueName);
        let state: FlowObjectData = stateField.value as FlowObjectData;
        let selectedItem: ComboTreeItem = this.treeItems.selectedItem;
        if(selectedItem) {
            if(!state){
                state=FlowObjectData.newInstance(this.stateValueTypeName);
            }
            state.addProperty(FlowObjectDataProperty.newInstance(this.idPropertyName,eContentType.ContentString,selectedItem.id));
            state.addProperty(FlowObjectDataProperty.newInstance(this.labelPropertyName,eContentType.ContentString,selectedItem.label));
            state.addProperty(FlowObjectDataProperty.newInstance(this.parentPropertyName,eContentType.ContentString,selectedItem.parent?.id));
        }
        else {
            state = null;
        }
        stateField.value=state;
        await this.updateValues(stateField);
    }

    toggleShow(show: boolean) {
        this.setState({expanded: show});
    }

    render() {
        let className: string = "comtree " + this.getAttribute('classes', '');
        const style: CSSProperties = {};
        if (this.model.visible === false) {
            style.display = 'none';
        }
        if (this.model.width) {
            style.width = this.model.width + 'vw';
        }
        if (this.model.height > 0) {
            style.height = this.model.height + 'vh';
        } 
    
        let label: any;
        if(this.model.label?.length > 0){
            label = (
                <div
                    className="comtree-label mw-bs"
                >
                    {this.model.label}
                </div>
            );
        }

        let help: any;
        if(this.model.helpInfo?.length > 0){
            label = (
                <div
                    className="comtree-help"
                >
                    {this.model.helpInfo}
                </div>
            );
        }

        let tree: any;
        if(this.state.expanded) {
            tree=(
                <div
                    className="comtree-tree"
                >
                    {this.treeItems?.makeComboContent()}
                </div>
            );
        }

        let value: any =(
            <span
                className="comtree-value"
            >
                {this.treeItems?.makeLabel()}
            </span>
        );

        return(
            <div
                className={className}
                style={style}
            >
                {label}
                <div
                    className="comtree-combo"
                    onClick={(e: any) => {this.toggleShow(true)}}
                >
                    {value}
                </div>
                {tree}
            </div>
        );
    }
}

manywho.component.register('ComboTree', ComboTree);