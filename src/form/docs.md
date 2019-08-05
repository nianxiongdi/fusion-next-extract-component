




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

## labelAlign - 标签的位置

手动传递了 wrapCol labelCol 会使用 Grid 辅助布局; labelAlign='top' 会强制禁用 Grid
