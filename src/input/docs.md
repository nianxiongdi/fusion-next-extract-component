



将依照fusion官网,https://fusion.design/component/basic/input
分析input组件,如下:

分析源码:  
  Base.jsx  //封装一下方法和属性
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



```js

    Input.js 代码

     /**
     * 获取字符串的长度， 也可以自定义
     **/
    getValueLength(value) {
        const nv = `${value}`;
        
        //这里判断是否是用户 自定义的方法获取长度，若没有定义  返回的是undefined
        let strLen = this.props.getValueLength(nv);
    
        // 若用户没有自定义 则获取的是字符串长度  思想666
        if (typeof strLen !== 'number') {
            strLen = nv.length;
        }

        return strLen;
    }



    Base.js 代码
    /**
     * 当用户按下之后的操作
     **/
    onKeyDown(e) {

        const value = e.target.value;
        const { maxLength } = this.props;
        const len = maxLength > 0 && value ? this.getValueLength(value) : 0;  // 获取当前的最大长度
        const opts = { };

        // 去除空格 this.props.trim用户传的 默认为false
        if (this.props.trim && e.keyCode === 32) {
            opts.beTrimed = true;
        }

        // has defined maxLength and has over max length and has not input backspace and delete
        // 当超出了也为true
        if (maxLength > 0 && (len > maxLength + 1 ||
            ((len === maxLength || len === maxLength + 1) && e.keyCode !== 8 && e.keyCode !== 46)
        )) {
            opts.overMaxLength = true;
        }
 
        this.props.onKeyDown(e, opts)
    }
```
 

### disabled 按钮是否处于禁用状态

在base.jsx:
```js
// 设置 样式
getClass() {
    const { disabled, state, prefix } = this.props;

    return classNames({
        [`${prefix}input`]: true,
        [`${prefix}disabled`]: !!disabled,
        [`${prefix}error`]: state === 'error',
        [`${prefix}focus`]: this.state.focus,
    });
}

// 传递给子类
getProps() {
    // 这个调用 this.props
    const { disabled } = this.props;
}
```

在input.jsx中：
```js
const cls = classNames(this.getClass(), {
    [`${prefix}${size}`]: true,
    
});

//调用Base组件的 getProps方法
const props = this.getProps();

//渲染
const inputEl = (
    <input 
        value={value} //这里实现 显示value
        onKeyDown={this.handleKeyDown}
        {...props}
    />
);
```
 

### maxLength 输入的最大长度

* maxlength也是原声的input属性

* 这里input原生的有 `<input type="text" maxLength="5" name="usrname">` maxLength属性，因此操作如下：

```js
//在Base.jsx中操作：
   getProps() {

        // 这个调用 this.props
        const { 
            。。。
            maxLength
        } = this.props;
   }

//传递给input.jsx即可
```

### hasLimitHint 是否展现最大长度样式

在base.jsx中：
```js
 //渲染最大的长度
renderLength() {
    const { maxLength, prefix, hasLimitHint } = this.props;
    const len = maxLength > 0 && this.state.value ? this.getValueLength(this.state.value) : 0;

    const classesLenWrap = classNames({
        [`${prefix}input-len`]: true,   //长度的样式
        [`${prefix}error`]: len > maxLength // 当超出时，变红
    });

    const content =  `${len}/${maxLength}`;

    return maxLength && hasLimitHint ? <span className={classesLenWrap}>{content}</span> : null;
}
```

在input.jsx中:
```js
//进渲染的函数
renderControl() {
    const { prefix } = this.props;

    const lenWrap = this.renderLength();

    return <span className={`${prefix}input-control`}>
        {lenWrap} 
    </span> ;
}

...


const inputWrap = (<span >
    ...
    {this.renderControl()}
</span>);

```

### cutString 当设置了maxLength时，是否截断超出字符串	


在Base.jsx中设置
```js
getProps(){
    ...

     // 这个调用 this.props
    const { 
        ...
        maxLength,
        cutString, // 当设置了maxLength时，是否截断超出字符串 
        
    } = this.props;
    

    const props = {
        ...
        maxLength: cutString ? maxLength : undefined, // 进行修改
    }

    ...
}
```

### readOnly只读

```js
//在Base.jsx中设置
 getProps() {
    const { 
        ...
        readOnly, // 是否为只读
    } = this.props;

    const props = {
        ...
        readOnly,
    }


    return props;
}
```


### trim 

* onChange返回会自动去除头尾空字符	

```js
// input.jsx
onChange(event) {
    let value = event.target.value;
    
    if(this.props.trim) {
        value = value.trim();
    }
    ...
}
```


### placeholder

* 输入提示	


```js
//在Base.jsx中设置
 getProps() {
    const { 
        ...
        placeholder, // placeholder
    } = this.props;

    const props = {
        ...
        placeholder,
    }


    return props;
}
```

### onFocus

* 获取焦点时候触发的回调 ,Function() => void	

```js

//base.jsx
// 聚焦的状态值
onFocus(e) {
    this.setState({
        focus: true
    });
    // 这里调用的是用户自定义的方法
    this.props.onFocus(e);
}

// 绑定
getProps() {
    ...

    const props = {
        onFocus: this.onFocus.bind(this)
    }
}

```


### onBlur

* 获取焦点时候触发的回调  Function() => void	
* 同上

### getValueLength

* 自定义字符串计算长度方式 - 用户自己去定义长度,只需要返回结果就行

```js

 /**
 * 获取字符串的长度， 也可以自定义
 **/
getValueLength(value) {
    const nv = `${value}`;
    
    //这里判断是否是用户 自定义的方法获取长度，若没有定义  返回的是undefined
    let strLen = this.props.getValueLength(nv);

    // 若用户没有自定义 则获取的是字符串长度  思想666
    if (typeof strLen !== 'number') {
        strLen = nv.length;
    }

    return strLen;
}


```

### htmlType

* 原生type	

```js
const {
        ...
        htmlType, // 原生的type类型判断

    } = this.props;
    
    const cls = classNames(this.getClass(), {
        ...
        [`${prefix}hidden`]: this.props.htmlType === 'hidden',

    });


    ...
    
    const inputEl = (
        <input 
            ...
            type={htmlType}
            ...
        />
    );
```


### name

```js
const dataProps = obj.pickAttrsWith(this.props, 'data-');
// Custom props are transparently transmitted to the core input node by default
// 自定义属性默认透传到核心node节点：input
const others = obj.pickOthers(Object.assign({}, dataProps, Input.propTypes), this.props);

const inputEl = (
    <input 
        {...others} 
        ...
    />
```


### state

* 'error'(错误) | 'loading'(校验中) 'success'(成功)	



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





