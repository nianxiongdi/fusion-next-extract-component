




## inline - 内联表单	

```js
 const formClassName = classNames({
    [`${prefix}form`]: true,
    [`${prefix}inline`]: inline
});
return (
    <Tag
        className={formClassName}>
        123
    </Tag>
```

## size - 组件的大小
通过context或props传递给子组件
```js
//组件的样式设置   

 // 获取父组件传递过来的size大小
getSize() {
    return this.props.size || this.context._formSize;
}


/**
 * Item的包裹
 */
getItemWrapper() {
    const {
        prefix,
        children
    } = this.props;

    const childrenProps = {size: this.getSize() };
    let childrenNode = children;
    const ele = React.Children.map(childrenNode, child=> {
        return React.cloneElement(child, {...childrenProps}); // 属性进行传递，例如Input组件会把props映射到自己的属性上，实现大小的变化
    })

    return (
        <div className={`${prefix}form-item-control`}>
            { ele }
        </div>
    );

}
```



label和组件样式设置；

```js

const itemClassName = classNames({
    [`${prefix}form-item`]: true,
    [`${prefix}${size}`]: !!size,
    [`${prefix}${labelAlign}`]: labelAlign,
});

// console.log( `${prefix}${labelAlign}` );


// 垂直模式并且左对齐才用到
const Tag = 'div';
const label = this.getItemLabel();
return (
    <Tag
        {...obj.pickOthers(Item.propTypes, this.props)}
        className={itemClassName}
    >
        { label }
        {this.getItemWrapper()}
    </Tag>
```
这面代码的css样式解读

```js
 &.#{$css-prefix}large { // next-form.next-large
    margin-bottom: $form-item-l-margin-b; //20px; 
    #{$form-prefix}-item-label { //设置行高
        line-height:$form-element-large-height; //$s-10
    }

    #{$form-prefix}-item-label { // 设置字体的大小
        font-size: $form-element-large-font-size;
    }
}

// 对于size="small"的字体的设置
&.#{$css-prefix}small {
    margin-bottom: $form-item-s-margin-b; // 
    #{$form-prefix}-item-label { //设置行高
        line-height:$form-element-small-height; // 
    }

    #{$form-prefix}-item-label { // 设置字体的大小
        font-size: $form-element-small-font-size;
    }
    }
```


## labelAlign - 标签的位置

手动传递了 wrapCol labelCol 会使用 Grid 辅助布局; labelAlign='top' 会强制禁用 Grid,而使用div布局

当我top时
```js
const Tag = 'div';
 
// 当为inset的时候，需要显示在组件内
const label = labelAlign === 'inset'? null: this.getItemLabel(); 

// 选择div情况下，默认就是上下布局

```

当为left时
```js
使用Grid布局，为左右的形式，所以不用做处理
```

当为inset时
```js
// 这个主要是使用，组件自己特性，进行内嵌
 getItemLabel() {
        const {
            id,
            label,
            prefix,
            labelAlign,
            wrapperCol,
            labelCol
        } = this.props;

        

        // labelAlign为inset和left的包裹
        if((wrapperCol || labelCol)&& labelAlign !== 'top') {
            return (<Col {...labelCol} className={cls}>
                {ele}
            </Col>);
        }
 
    }

    /**
     * 状态的判断
     */
    getState() {

    }

    /**
     * Item的包裹
     */
    getItemWrapper() {
        const {
            prefix,
            children,
            labelAlign,
            labelCol,
            wrapperCol,
        } = this.props;

        const childrenProps = {size: this.getSize() };
        let childrenNode = children;
       
        if( labelAlign === 'inset' ) {
            childrenProps.label = this.getItemLabel();
        }

        const ele = React.Children.map(childrenNode, child=> { //这里进行注入到组件的内部
            return React.cloneElement(child, {...childrenProps});
        })

        //当labelAlign为inset和left的样式
        if((wrapperCol || labelCol) && labelCol !== 'top') {
            return (
                <Col 
                    {...wrapperCol}
                    className={`${prefix}form-item-control`}
                    key="item"
                >
                    {ele}
                </Col>
            );
        }
    }
```
 

## labelTextAlign	标签的左右对齐方式

