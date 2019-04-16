



将依照fusion官网,https://fusion.design/component/basic/input
分析input组件,如下:

分析源码:  
  Base.jsx  //封一下方法和属性
  Input.jsx //渲染input
  Group.jsx //对input进一步的封装

看官网的api,一步一步的实现所有的方法和属性

## Input组件:

### value属性 
* 当前值	String/Number


```js
// <Input size="large" placeholder="Large"   aria-label="Large" value="this is input" />

constructor(props) {
    super(props);

    let value;
    // 判断用户是否传值,若是传,则进行保存到state中
    if('value' in props) {
        value = props.value;
    }else {
        value = props.defaultProps;
    }

    this.state = {
        value: typeof value === 'undefined' ? '' : value
        // value:   !!value  ? '' : value 个人认为这样写更好
    }
}
```

### size	尺寸

* 可选值: 'small'(小) |'medium'(中) | 'large'(大)	Enum(类型)	'medium'(默认值)


















scss分析：

#{$input-prefix}  --  .next-input  // 这个变量变量在哪定义的找了半天 也没有找到






