




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

`当我top时` 

```js
const Tag = 'div';
 
// 当为inset的时候，需要显示在组件内
const label = labelAlign === 'inset'? null: this.getItemLabel(); 

// 选择div情况下，默认就是上下布局

```

`当为left时`

```js
使用Grid布局，为左右的形式，所以不用做处理
```

`当为inset时`

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

`当值为left时`
```js
// 在Item组件那种设置
const cls = classNames({
    [`${prefix}form-item-label`]: true,
    [`${prefix}left`]: labelTextAlign === 'left' //这里
})

// labelAlign为inset和left的包裹
if((wrapperCol || labelCol)&& labelAlign !== 'top') {
    return (<Col {...labelCol} className={cls}>
        {ele}
    </Col>);
}
```

对应的`css样式`
```css
// 包裹label的css样式的设置
&-item-label {
    display: inline-block; // 可设宽高，不自动换行
    vertical-align: top;
    color: $form-label-color; // #666666
    text-align: right;
    padding-right: $form-label-padding-r; // 12px;
    
    // 设置属性 labelTextAlign =="left"的样式
    &.#{$css-prefix}left { 
        text-align: left;
    }

}
```


`当值为right时`

默认就是右对齐,因为在`next-form-item-label`设置`text-align: right;`




## field 
* 经 new Field(this) 初始化后，直接传给 Form 即可 用到表单校验则不可忽略此项	

```js
 // 当用户传递props属性时
if(props.field) {
    this._formField = props.field;
    const onChange = this._formField.onChange;
    //Field内部的onchange方法 和 onChange 进行绑定在一起
    options.onChange = func.makeChain(onChange, this.onChange);
    //设置参数
    this._formField.setOptions && this._formField.setOptions(options);
} else {
    if('value' in props) {
        // 传递表单的数值
        options.values = props.value;
    }
    this._formField = new Field(this, options);
}

```


## saveField
* 保存 Form 自动生成的 field 对象

```js
props.saveField(this._formField);

// 用户使用saveFile方法的时候,会返回给用户封装后的field

```


## labelCol
* 控制第一级 Item 的 labelCol	
* 意思就是列占用的宽度,对应Grid的


## wrapperCol
* 控制第一级 Item 的 wrapperCol	
* 控制当前组件占用的宽度



## onSubmit
* 若用户不传此方法,则默认会阻止默认事件

```js
//阻止默认事件
function preventDefault(e) {
    e.preventDefault();

static defaultProps = {
    prefix: 'next-',
    component: 'form',
    onSubmit: preventDefault,
};

class Form{
    render() {
        const { 
            ...
            onSubmit,
        } = this.props;
        
     
        ...
        return (
            <Tag
                className={formClassName}
                onSubmit={onSubmit}
                >
                ....
            </Tag>
        )

    }
}
```

## children 
* 就是代表子元素


## value

* 我理解的是通过Field对表单元素初始化

## onChange

* 这个方法厉害了,这个方法由Field统一管理,就是所有组件的change都会到达这里[setValue不会触发该函数],666

```js
    constructor() {
        const options = {
            ...props.fieldOptions,
            // 通过onchange去管理数据
            onChange: this.onChange,
        };
        this._formField = new Field(this, options);
    }

    onChange = (name, value) => {
        // console.log(123);
        this.props.onChange(this._formField.getValues(), {
            name,
            value,
            field: this._formField,
        });
    };

在Item.jsx中

 /**
 * Item的包裹
 */
// React.Children.map 去把方法传递给子组件 666
// 当数值改变时,会调用组件中的onChange方法,然后通过this.props.onChange去回调到Field的方法,然后是用户自定义的onChange方法
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
    // console.log('---');
    // console.log(typeof children);
    // 获取变量的数据
    if (typeof children === 'function' && this.context._formField) {
        childrenNode = this.context._formField.getValues();
    }

    const ele = React.Children.map(childrenNode, child=> {

        if(child && typeof child.type === 'function' &&
            child.type._formField !== 'form_item') {
            let extraProps = childrenProps;
            if( this.context._formField && 'name' in child.props ) {
                // extraProps = this.context._formField.init(this.props.name, {

                // });
                console.log( child.props );
                extraProps = this.context._formField.init(child.props.name,{
                    props: child.props //child.props 代表子组件对象
                }, childrenProps);// childrenProps 需要修饰的对象
            }else {
                extraProps = Object.assign({}, child.props, extraProps);
            }
            return React.cloneElement(child, extraProps); // 统一当做props传递给子组件
        }
        
          return child;
    })
  
```
## component

* 设置标签的类型默认为form