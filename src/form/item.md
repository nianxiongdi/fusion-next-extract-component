
 



## label

* label标签的文本  可以是ReactNode

```js

/**
 * 对label进行包裹
 **/
getItemLabel() {
    const {
        ...
        label,
        ...
    } = this.props;

    // 若不存在label， 直接的返回
    if(!label) {
        return null;
    }
    // 对label进行包裹
    const ele = (
    <label
        htmlFor={id || this.getNames()[0]}
        required={true}
        key="label"
    >
        { label }
    </label>);
}
```

## size

* 单个 Item 的 size 自定义，优先级高于 Form 的 size, 并且当组件与 Item 一起使用时，组件自身设置 size 属性无效。
* ` Item 一起使用时，组件自身设置 size 属性无效。` - 原因是子组件属性值被覆盖
```js
const ele = React.Children.map(childrenNode, child=> {

    if(child && typeof child.type === 'function' &&
        child.type._formField !== 'form_item') {
        let extraProps = childrenProps;
        if( this.context._formField && 'name' in child.props ) {
  
            extraProps = this.context._formField.init(child.props.name,{
                props: child.props
            }, childrenProps); // 这里把副组件属性传递给子组件，子组件的值将会被覆盖，通过this.props就是父组件的属性，前提是父组件需要传此属性，才会覆盖子组件的值
    
        }else {
            extraProps = Object.assign({}, child.props, extraProps);
        }

        return React.cloneElement(child, extraProps);

    }

    return child;
})
```


## labelCol

* label 标签布局，通 <Col> 组件，设置 span offset 值，如 {span: 8, offset: 16}，该项仅在垂直表单有效	
* 在labelAlign是left,inset才有效

```cs
//labelAlign为top时 设置label margin-botto为2px
&.#{$css-prefix}top > #{$form-prefix}-item-label {
    margin-bottom: $form-top-label-margin-b; // 2px
}
//labelAlign为inset时 需要把padding的左右设置为0px;并继承父元素的行高
&.#{$css-prefix}inset #{$form-prefix}-item-label {
    padding-right: 0;
    padding-left: 0;
    line-height: inherit;
}
```

## wrapperCol 
* 需要为输入控件设置布局样式时，使用该属性，用法同 labelCol	
 
## help
* 自定义提示信息，如不设置，则会根据校验规则自动生成.	