

## 方法的分析

请先导读[官网的Field](https://fusion.design/component/basic/field#demo-api),讲的很明白了,不懂的可以问题.

## 预备知识

1. `forceUpdate` - React的方法, 当`props和state不改变时`,可以使用forceUpdate去`强制重新渲染页面`, 例子请[参考](https://codesandbox.io/s/reactzhongdeforceupdatefangfa-umtjn)

2. 了解utils中的方法


## constructor
[https://codepen.io/nianxiongdi/pen/rNBLrKB?editors=0010]

* 构造方法就是用来初始化变量的
* `需用户传递组件的this`- `new Filed(this)`
* 还应该注意一点, 当在`和Form组件一起使用时`,分两种情况
    * `情况1` - 当`用户在Form组件中不创建Filed时`,在Form组件内部会`自动创建Field组件`.
    * `情况2` - 当`用户在Form组件中创建Filed时`,在Form组件内部会`就不会自动创建Field组件`,使用`用户创建的Field对象`.

* 参数: `constructor(com, options = {}) {}`
    * 参数1: 组件的this,一般是`new Field(this)`
    * 参数2: 请参考(这里)[https://fusion.design/component/basic/field#demo-api]

```js
    constructor(com, options = {}) {
        if (!com) {
            log.warning('`this` is missing in `Field`, you should use like `new Field(this)`');
        }

        this.com = com; // 代表组件对象,必须传 .例如:     field = new Field(this);    // 实例创建
        this.fieldsMeta = {};
        this.cachedBind = {};　 //　缓存变量的
        this.instance = {};　// 实例

        this.values = options.values || {};

        this.options = Object.assign({
            parseName: false, //  当为true时,把 init('obj.b') 的数据转换成 obj={obj:{b:'value'}}；,当为false时,  obj={"obj.b": "value"},
            forceUpdate: false, //仅建议PureComponent的组件打开此强制刷新功 https://juejin.im/post/5b614d9bf265da0fa759e84b
            scrollToFirstError: true,// ? field.validate的时候滚动到第一个出错的组件, 如果是整数会进行偏移
            first: false,//
            onChange: func.noop, // 所有组件的change都会到达这里[setValue不会触发该函数]
            autoUnmount: true,// 是否修改数据的时候就自动触发校验, 设为 false 后只能通过 validate() 来触发校验
        }, options);
        console.log(this);
        ['init',
        'getValue', //获取单个控件的值
        'getValues',// 获取控件的值, 不传的话获取所以控件的值
        'setValue', // 设置单个控件的值
        'setValues',// 设置一组输入控件的值
        'getError',//  获取单个输入控件的 Error
        'setError',// 设置单个输入控件的 Error
        'setErrors',// 设置一组输入控件的 Error
        'validate',// 校验并获取一组输入域的值与 Error
        'getState', // 判断校验状态
        'reset', //重置一组输入控件的值、清空校验
        'resetToDefault', // 重置一组输入控件的值为默认值
        'remove' // 删除某一个或者一组控件的数据，删除后与之相关的validate/value都会被清空
        ].forEach((m) => {//进行绑定
            this[m] = this[m].bind(this);
        });

        // 若用户设置values初始化,对变量进行初始化
        if (options.values) {
            this.setValues(options.values, false);
        }
    }

    // 每一个变量初始化
    setValue(name, value, reRender = true) {
        // 对field变量初始化
        if (name in this.fieldsMeta) {
            this.fieldsMeta[name].value = value;
        }
        // 对this.values初始化
        if (this.options.parseName) {
            this.values = setIn(this.values, name, value);
        } else {
            this.values[name] = value;
        }
        reRender && this._reRender();
    } 

    // 初始化代码
    setValues(fieldsValue = {}, reRender = true) {
        if (!this.options.parseName) { // 正常变量的表达式
            Object.keys(fieldsValue).forEach(name => {
                this.setValue(name, fieldsValue[name], false);
            });
        } else { // 可能含有obj.a这样的变量
            // NOTE: this is a shallow merge
            // Ex. we have two values a.b.c=1 ; a.b.d=2, and use setValues({a:{b:{c:3}}}) , then because of shallow merge a.b.d will be lost, we will get only {a:{b:{c:3}}}
            this.values = Object.assign({}, this.values, fieldsValue); 
            const fields = this.getNames();// // 获取FileMeta的变量名
            fields.forEach(name => { // 遍历所以的field的变量
                const value = getIn(this.values, name);
                if (value !== undefined) {
                    // copy over values that are in this.values
                    this.fieldsMeta[name].value = value;
                } else {
                    // if no value then copy values from fieldsMeta to keep initialized component data
                    this.values = setIn(
                        this.values,
                        name,
                        this.fieldsMeta[name].value
                    );
                }
            });
        }
        reRender && this._reRender();
    }


    //trigger rerender
    // 是否重新渲染
    _reRender() {
        if (this.com) {
            if (!this.options.forceUpdate && this.com.setState) {
                this.com.setState({});
            } else if (this.com.forceUpdate) {
                this.com.forceUpdate(); //forceUpdate 对性能有较大的影响，成指数上升
            }
        }
    }


```

## init 

* `初始化每一个组件`
* 参数
    * `参数1` - 每个组件的唯一标示
    * `参数2` - 请参考本文的constructor或[官网](https://fusion.design/component/basic/field#demo-api)
    * `参数3` - 组件自定义的事件可以写在这里(Object形势)

```js

    /**
     * Controlled Component
     * @param {String} name
     * @param {Object} fieldOption
     * @returns {Object} {value, onChange}
     */
    init(name, fieldOption = {}, rprops) {
        const {
            initValue, // 初始值
            valueName = 'value',// 组件值的属性名称，如 Checkbox 的是 checked，Input是 value	
            trigger = 'onChange',// // 触发数据变化的事件名称
            rules = [], // 校验规则
            props = {},//  // 组件自定义的事件可以写在这里
            getValueFromEvent = null, //自定义从onChange事件中获取value的方式，一般不需要设置. 详细用法查看demo 自定义数据获取
            autoValidate = true, // 是否修改数据的时候自动触发校验单个组件的校验, 设为 false 后只能通过 validate() 来触发校验	
        } = fieldOption;

        // add code 
        // parseName为true时,把 init('obj.b') 的数据转换成 obj={obj:{b:'value'}}；
        const { parseName } = this.options;


        // 把自定义event和组件props放在一起
        const originalProps = Object.assign({}, props, rprops);

        // 设置默认值
        const defaultValueName = `default${valueName[0].toUpperCase()}${valueName.slice(
            1
        )}`;//defaultValueName = 'defaultValue';
        
        // field初始化
        const field = this._getInitMeta(name);
        console.log(field);
        // 默认值初始值的设置
        let defaultValue;

        // 默认值判断的改变
        // if (typeof initValue !== 'undefined') { // 初始值不是undefined时,进行初始化
        //     defaultValue = initValue;
        // } else if (originalProps[defaultValueName]) { //当用户传递defaultValue属性时 defaultValue  <Input defaultValue="this is default value" />
        //     defaultValue = originalProps[defaultValueName];
        // } else {
        //     defaultValue = getIn(this.initValues, name);
        // }
        if(typeof initValue !== 'undefined') {// 若options传递initValue,则设置为默认值
            defaultValue = initValue;
        }else if(typeof originalProps[defaultValueName]) {
            defaultValue = originalProps[defaultValueName];
        }

        

        // file变量的定义
        Object.assign(field, {
            valueName, // 组件值的属性名称，如 Checkbox 的是 checked，Input是 value	
            initValue: defaultValue, // 每一个控件的初始化值
            disabled: // 是否被禁用
                'disabled' in originalProps ? originalProps.disabled : false,
            getValueFromEvent, // 是否有自定义event
            rules: Array.isArray(rules) ? rules : [rules], // 规则的定义 , 转换为数组
            ref: originalProps.ref, // 保存ref
        });
 
        // Controlled Component, should alwasy equal props.value
        if (valueName in originalProps) {
            field.value = originalProps[valueName]; // 把当前组件的属性名,复制给value Input是value, checkbox为checked ,把当前组件的值,复制给value
            // value 就可以保存 当前组件的值了. Input保存originalProps['value'], checkbox保存值为Input保存originalProps['checked']
             
            if (parseName) {
                // 把 init('obj.b') 的数据转换成 obj={obj:{b:'value'}}；
                //  并把Field中options定义的values放在一起
                this.values = setIn(this.values, name, field.value);
            }else { // 若为false直接挂在到Field对象上的values上
                this.values[name] = field.value;
            }

        }
        
        // 若用户没有传参数, 设置默认值
        if (!('value' in field)) {
            if(parseName) {
                // 查找this.values是否存在name属性
                const cachedValue = getIn(this.values, name);
                field.value = 
                    typeof cachedValue !== 'undefined'
                        ? cachedValue 
                        : defaultValue;
            } else {// 当传的值不是obj.c的形式时
                const cachedValue = this.values[name];
                field.value = typeof cachedValue !== 'undefined'
                    ? cachedValue 
                    : defaultValue;
            }
            // 之前的方式, 问题 会出现当obc.a形式的时候,会出现问题
            // field.value = defaultValue;
        }

        // 当parse为true时, 初始值没有含有对应的值
        if(parseName && !getIn(this.values, name)) {
            this.values = setIn(this.values, name, field.value);
        } else if(!parseName && !this.values[name]) {
            this.values[name] = field.value;
        }
  
        // console.log(this);
        // Component props
        const inputProps = {
            'data-meta': 'Field', // 标识
            id: name, // name
            ref: this._getCacheBind(name, `${name}__ref`, this._saveRef), // 绑定控件,存在到cache
            [valueName]: field.value, // 存在对应组件的值
        };

        let rulesMap = {};

        // 验证
        if (this.options.autoValidate && autoValidate !== false) {
            // trigger map
            rulesMap = mapValidateRules(field.rules, trigger);

            // validate hook
            for (const action in rulesMap) {
                if (action === trigger) {
                    continue;
                }

                const actionRule = rulesMap[action];
                inputProps[action] = (...args) => {
                    this._validate(name, actionRule, action);
                    this._callPropsEvent(action, originalProps, ...args);
                    this._reRender();
                };
            }
        }

        // onChange hack
        inputProps[trigger] = (...args) => {
            this._callOnChange(name, rulesMap[trigger], trigger, ...args);
            this._callPropsEvent(trigger, originalProps, ...args);
            this.options.onChange(name, field.value);
            this._reRender();
        };

        delete originalProps[defaultValueName];

        return Object.assign({}, originalProps, inputProps);
    }


```

## getValues
* 获取定义的属性的值
* 使用方式
    * this.field.values();
    * this.field.values(['变量名']);

```js
    //获取单个属性值
    getValue(name) {
        
        if (this.options.parseName) {
            return getIn(this.values, name);
        }
        
        return this.values[name];
    }

    /**
     * 1. get values by names.
     * 2. If no names passed, return shallow copy of `field.values`
     * @param {Array} names
     */
    getValues(names) {
        const allValues = {};

        if (names && names.length) {
           
            names.forEach(name => {
                allValues[name] = this.getValue(name);
            });     
        } else {
            Object.assign(allValues, this.values);
        }

        return allValues;
    }

```