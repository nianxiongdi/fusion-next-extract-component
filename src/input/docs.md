



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


```js
    const cls = classNames(this.getClass(), {
        [`${prefix}${size}`]: true,
        
    });
```

### defaultValue 初始化


```js
constructor(props) {
    super(props);
    let value;
    // 当用户传value时，为当前值，
    if('value' in props) {
        value = props.value;
    }else { // 若无传value,则选择是defaultValue值
        value = props.defaultValue;
    }

    this.state = {
        value: typeof value === 'undefined' ? '' : value
    }

}
```


### onChange 发生改变的时候触发的回调

```js
签名 Function(value: String, e: Event) => void
参数:
    value: {String} 数据
    _e_: {Event} DOM事件对象
```

* 这里是个回调思想请[参考](https://blog.csdn.net/qq_30638831/article/details/89155823)


```js
Base.jsx
getProps() {

    const props = {
        value: this.state.value,
        onChange: this.onChange.bind(this) // 绑定this
    }


    return props;
}


input.jsx


const inputEl = (
    <input 
        value={value} //这里实现 显示value
        {...props}
    />
);


// 用户使用
function handleChange(v, e) {
    console.log(v)
}

<Input size="medium" placeholder="Large"   
    aria-label="Large" 
    defaultValue="init value"
    onChange={handleChange}
/>


```

### onKeyDown 键盘按下的时候触发的回调
* Function(e: Event, opts: Object) => void











scss分析：

#{$input-prefix}  --  .next-input  // 这个变量变量在哪定义的找了半天 也没有找到


class="next-input"  显示主要的样式
```css
.next-input.next-large {
    height: 40px;
    border-radius: 3px;
}

.next-input {
    box-sizing: border-box;
    vertical-align: middle;
    display: inline-table;
    border-collapse: separate;
    font-size: 0;
    width: 200px;
    border-spacing: 0;
    transition: all .3s ease-out;
    border: 1px solid #C4C6CF;
    background-color: #FFFFFF
}

```





