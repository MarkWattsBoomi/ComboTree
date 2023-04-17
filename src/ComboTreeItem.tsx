import { FlowObjectData, FlowObjectDataArray } from "flow-component-model";
import React, { CSSProperties } from "react";

export class ComboTreeItems {
    items: Map<string, ComboTreeItem>;
    selectedItem: ComboTreeItem;
    eventHandler: any;

    constructor() {
        this.items = new Map();
        this.selectItem = this.selectItem.bind(this);
    }

    public static parse(src: FlowObjectDataArray, idProperty: string, labelProperty: string, parentProperty: string, childrenProperty: string, eventHandler: any, selectedItem: FlowObjectData) : ComboTreeItems {
        let items: ComboTreeItems = new ComboTreeItems();
        items.eventHandler = eventHandler;
        src.items.forEach((item: FlowObjectData) => {
            let cti: ComboTreeItem = ComboTreeItem.parse(items, null, item, idProperty, labelProperty, parentProperty,childrenProperty, selectedItem);
            items.items.set(cti.id, cti);
        });
        return items;
    }

    makeLabel() : string {
        let label: string;
        if(this.selectedItem) {
            label = this.selectedItem.makeLabel();
        }
        else {
            label = "Please select ...";
        }
        return label;
    }

    makeComboContent() : any[] {
        let content: any[] = [];
        content.push(
            <div>
                <span
                    className="comtree-tree-item"
                    onClick={(e: any) => {this.selectItem(null)}}
                >
                    {"Please select ..."}
                </span>
            </div>
        );
        if(this.items && this.items.size > 0) {
            this.items.forEach((item: ComboTreeItem) =>{
                content.push(item.makeComboContent(0));
            });
        }
        return content;
    }

    selectItem(item: ComboTreeItem) {
        this.selectedItem = item;
        if(this.eventHandler) {
            this.eventHandler();
        }
    }
}

export class ComboTreeItem {
    id: string;
    label: string;
    root: ComboTreeItems;
    parent: ComboTreeItem;
    parentId: string;
    items: Map<string, ComboTreeItem>;
    internalId: string;
    element: any;
    

    constructor() {
        this.items = new Map();
        this.selectItem = this.selectItem.bind(this);
    }

    public static parse(root: ComboTreeItems, parent: ComboTreeItem, src: FlowObjectData, idProperty: string, labelProperty: string, parentProperty: string, childrenProperty: string, selectedItem: FlowObjectData) : ComboTreeItem {
        let cti: ComboTreeItem = new ComboTreeItem();
        cti.id = src.properties[idProperty].value as string;
        cti.label = src.properties[labelProperty].value as string;
        cti.parent = parent;
        cti.parentId = src.properties[parentProperty]?.value as string || src.properties[idProperty].value as string;
        cti.root = root;
        cti.internalId = src.internalId;
        let children: FlowObjectDataArray = src.properties[childrenProperty]?.value as FlowObjectDataArray;
        if(children && children.items.length > 0) {
            children.items.forEach((child: FlowObjectData) => {
                let ccti: ComboTreeItem = ComboTreeItem.parse(root, cti, child, idProperty, labelProperty, parentProperty,childrenProperty, selectedItem);
                cti.items.set(ccti.id, ccti);
            });
        }
        let selectedId: string = selectedItem.properties[idProperty].value as string;
        if(cti.id === selectedId) {
            root.selectItem(cti);
        }
        return cti;
    }

    makeLabel() : string {
        let label: string;
        label = this.parent? this.parent.makeLabel() + " - " : "";
        label = label + this.label;
        return label;
    }

    makeComboContent(level: number) : any {
        let content: any;
        const style: CSSProperties = {};
        style.paddingLeft = level + "rem";

        let children: any[] = [];
        if(this.items && this.items.size > 0) {
            this.items.forEach((item: ComboTreeItem) =>{
                children.push(item.makeComboContent(level + 1));
            });
        }
        content=(
            <div
                style={style}
                ref={(e: any) => {this.element = e}}
            >
                <span
                    className="comtree-tree-item"
                    onClick={this.selectItem}
                >
                    {this.label}
                </span>
                
                <div>
                    {children}
                </div>
            </div>
        );
        //if(this.selectedItem) {
        return content;
    }

    selectItem(e: any){
        e.stopPropagation();
        this.root.selectItem(this);
    }

}