
The latest version can be included in your player from this location: -

```
https://files-manywho-com.s3.amazonaws.com/e1dbcceb-070c-4ce6-95b0-ba282aaf4f48/tile.js
```

A running demo can be seen here: -

Coming Soon


A sharing token of that example flow is: -

Coming Soon


NOTE: Visibility based on page conditions is respected.



# ComboTree


## Functionality

Provides a combo box who's dropdown contains a hierarchical tree of options.
The user can select any item from the tree.
The tree expects a consistent hierarchical data model with each level having the same attribute names for the properties and the child elements.

## DataSource

Set the datasource to a list objects of any type, each type must have an id column, a label column, a children column and a parent column.

## State

Not used, specified as an attribute !!!

## Settings

### Label

The Label of the component is used as the title

### Width & Height

If specified then these are applied as vh & vw values.

## Component Attributes

### classes

Like all components, adding a "classes" attribute will cause that string to be added to the base component's class value

### idPropertyName

The name of the property of the model object containing the primary id.

### labelPropertyName

The name of the property of the model object containing the objects label as displayed in the tree. 

### parentPropertyName

The name of the property of the model object containing the id of the objects parent.  Not used for display but set when saving the state.

### childrenPropertyName

The name of the property of the model object containing the object's children. 

### stateValueType

The name of the type of the state value.  Allows the component to create a state of the correct type. 

### stateValueName

The name of the FLow value to receive the state value.  This will be set whenever a selection is made. 


## Styling

All elements of the tree can be styled by adding the specific style names to your player.


## Page Conditions

The component respects the show / hide rules applied by the containing page.


