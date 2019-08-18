import ReactDOM from 'react-dom';
import { log, func } from '../util';
import Validate from '../validate';

import {
    getValueFromEvent,
    getErrorStrs,
    getParams,
    setIn,
    getIn,
    mapValidateRules,
} from './utils';

const initMeta = {
    state: '',
    valueName: 'value',
    trigger: 'onChange',
};

class Field {
     
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

    setOptions(options) {
        Object.assign(this.options, options);
    }

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

        /**
     * event on props
     * props.onChange props.onBlur
     */
    _callPropsEvent(action, props, ...args) {
        action in props &&
            typeof props[action] === 'function' &&
            props[action](...args);
    }

    _getInitMeta(name) {
        if (!(name in this.fieldsMeta)) {
            this.fieldsMeta[name] = Object.assign({}, initMeta);
        }

        return this.fieldsMeta[name];
    }

    /**
     * update field.value and validate
     */
    _callOnChange(name, rule, trigger, ...others) {
        const e = others[0];
        const field = this._get(name);

        if (!field) {
            return;
        }

        field.value = field.getValueFromEvent
            ? field.getValueFromEvent.apply(this, others)
            : getValueFromEvent(e);

        if (this.options.parseName) {
            this.values = setIn(this.values, name, field.value);
        } else {
            this.values[name] = field.value;
        }

        this._resetError(name);

        // validate while onChange
        rule && this._validate(name, rule, trigger);
    }

    /**
     * ref must always be the same function, or if not it will be triggerd every time.
     * @param {String} name name of component
     * @param {String} action key to find ref
     * @param {Function} fn saveRef
     */
    _getCacheBind(name, action, fn) {
        const cache = (this.cachedBind[name] = this.cachedBind[name] || {});
        if (!cache[action]) {
            cache[action] = fn.bind(this, name);
        }
        return cache[action];
    }

    _setCache(name, action, hander) {
        const cache = (this.cachedBind[name] = this.cachedBind[name] || {});
        cache[action] = hander;
    }

    _getCache(name, action) {
        const cache = this.cachedBind[name] || {};
        return cache[action];
    }

    /**
     * NOTE: saveRef is async function. it will be called after render
     * @param {String} name name of component
     * @param {Function} component ref
     */
    _saveRef(name, component) {
        const key = `${name}_field`;
        const autoUnmount = this.options.autoUnmount;

        if (!component && autoUnmount) {
            // component with same name (eg: type ? <A name="n"/>:<B name="n"/>)
            // while type changed, B will render before A unmount. so we should cached value for B
            // step: render -> B mount -> 1. _saveRef(A, null) -> 2. _saveRef(B, ref) -> render
            // 1. _saveRef(A, null)
            const cache = this.fieldsMeta[name];
            this._setCache(name, key, cache);
            // after destroy, delete data
            delete this.instance[name];
            this.remove(name);
            return;
        }

        // 2. _saveRef(B, ref) (eg: same name but different compoent may be here)
        if (autoUnmount && !this.fieldsMeta[name]) {
            this.fieldsMeta[name] = this._getCache(name, key);
            this.setValue(
                name,
                this.fieldsMeta[name] && this.fieldsMeta[name].value,
                false
            );
        }

        // only one time here
        const field = this._get(name);
        if (field) {
            const ref = field.ref;
            if (ref) {
                if (typeof ref === 'string') {
                    throw new Error(`can not set string ref for ${name}`);
                }
                ref(component);
            }

            this.instance[name] = component;
        }
    }

    /**
     * validate one Component
     * @param {String} name name of Component
     * @param {Array} rule
     * @param {String} trigger onChange/onBlur/onItemClick/...
     */
    _validate(name, rule, trigger) {
        const field = this._get(name);
        const value = field.value;

        field.state = 'loading';

        let validate = this._getCache(name, trigger);
        validate && validate.abort();

        validate = new Validate({
            [name]: rule,
        });
        this._setCache(name, trigger, validate);

        validate.validate(
            {
                [name]: value,
            },
            errors => {
                if (errors && errors.length) {
                    field.errors = getErrorStrs(errors);
                    field.state = 'error';
                } else {
                    field.errors = [];
                    field.state = 'success';
                }

                this._reRender();
            }
        );
    }

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

    setError(name, errors) {
        const err = Array.isArray(errors) ? errors : errors ? [errors] : [];
        if (name in this.fieldsMeta) {
            this.fieldsMeta[name].errors = err;
        } else {
            this.fieldsMeta[name] = {
                errors: err,
            };
        }

        if (
            this.fieldsMeta[name].errors &&
            this.fieldsMeta[name].errors.length > 0
        ) {
            this.fieldsMeta[name].state = 'error';
        } else {
            this.fieldsMeta[name].state = '';
        }

        this._reRender();
    }

    setErrors(fieldsErrors = {}) {
        Object.keys(fieldsErrors).forEach(name => {
            this.setError(name, fieldsErrors[name]);
        });
    }

    getError(name) {
        const field = this._get(name);
        if (field && field.errors && field.errors.length) {
            return field.errors;
        }

        return null;
    }

    getErrors(names) {
        const fields = names || this.getNames();
        const allErrors = {};
        fields.forEach(f => {
            allErrors[f] = this.getError(f);
        });
        return allErrors;
    }

    getState(name) {
        const field = this._get(name);

        if (field && field.state) {
            return field.state;
        }

        return '';
    }

    /**
     * Get errors using `getErrors` and format to match the structure of errors returned in field.validate
     * @param {Array} fieldNames
     * @return {Object || null} map of inputs and their errors
     */
    formatGetErrors(fieldNames) {
        const errors = this.getErrors(fieldNames);
        let formattedErrors = null;
        for (const field in errors) {
            if (errors.hasOwnProperty(field) && errors[field]) {
                const errorsObj = errors[field];
                if (!formattedErrors) {
                    formattedErrors = {};
                }
                formattedErrors[field] = { errors: errorsObj };
            }
        }
        return formattedErrors;
    }

    /**
     * validate by trigger
     * @param {Array} ns names
     * @param {Function} cb callback after validate
     */
    validate(ns, cb) {
        const { names, callback } = getParams(ns, cb);
        const fieldNames = names || this.getNames();

        const descriptor = {};
        const values = {};

        let hasRule = false;
        for (let i = 0; i < fieldNames.length; i++) {
            const name = fieldNames[i];
            const field = this._get(name);

            if (!field) {
                continue;
            }

            if (field.rules && field.rules.length) {
                descriptor[name] = field.rules;
                values[name] = this.getValue(name);
                hasRule = true;

                // clear error
                field.errors = [];
                field.state = '';
            }
        }

        if (!hasRule) {
            const errors = this.formatGetErrors(fieldNames);
            callback &&
                callback(errors, this.getValues(names ? fieldNames : []));
            return;
        }

        const validate = new Validate(descriptor, {
            first: this.options.first,
        });

        validate.validate(values, errors => {
            let errorsGroup = null;
            if (errors && errors.length) {
                errorsGroup = {};
                errors.forEach(e => {
                    const fieldName = e.field;
                    if (!errorsGroup[fieldName]) {
                        errorsGroup[fieldName] = {
                            errors: [],
                        };
                    }
                    const fieldErrors = errorsGroup[fieldName].errors;
                    fieldErrors.push(e.message);
                });
            }
            if (errorsGroup) {
                // update error in every Field
                Object.keys(errorsGroup).forEach(i => {
                    const field = this._get(i);
                    field.errors = getErrorStrs(errorsGroup[i].errors);
                    field.state = 'error';
                });
            }

            const formattedGetErrors = this.formatGetErrors(fieldNames);

            if (formattedGetErrors) {
                errorsGroup = Object.assign(
                    {},
                    formattedGetErrors,
                    errorsGroup
                );
            }

            // update to success which has no error
            for (let i = 0; i < fieldNames.length; i++) {
                const name = fieldNames[i];
                const field = this._get(name);
                if (field.rules && !(errorsGroup && name in errorsGroup)) {
                    field.state = 'success';
                }
            }

            // eslint-disable-next-line callback-return
            callback &&
                callback(errorsGroup, this.getValues(names ? fieldNames : []));
            this._reRender();

            if (errorsGroup && this.options.scrollToFirstError) {
                let firstNode;
                let firstTop;
                for (const i in errorsGroup) {
                    if (errorsGroup.hasOwnProperty(i)) {
                        const instance = this.instance[i];
                        const node = ReactDOM.findDOMNode(instance);
                        if (!node) {
                            return;
                        }
                        const top = node.offsetTop;
                        if (firstTop === undefined || firstTop > top) {
                            firstTop = top;
                            firstNode = node;
                        }
                    }
                }

                if (firstNode) {
                    if (
                        typeof this.options.scrollToFirstError === 'number' &&
                        window &&
                        typeof window.scrollTo === 'function'
                    ) {
                        const offsetLeft =
                            document &&
                            document.body &&
                            document.body.offsetLeft
                                ? document.body.offsetLeft
                                : 0;
                        window.scrollTo(
                            offsetLeft,
                            firstTop + this.options.scrollToFirstError
                        );
                    } else if (firstNode.scrollIntoViewIfNeeded) {
                        firstNode.scrollIntoViewIfNeeded(true);
                    }
                }
            }
        });
    }

    _reset(ns, backToDefault) {
        if (typeof ns === 'string') {
            ns = [ns];
        }
        let changed = false;

        const names = ns || Object.keys(this.fieldsMeta);

        if (!ns) {
            this.values = {};
        }
        names.forEach(name => {
            const field = this._get(name);
            if (field) {
                changed = true;

                field.value = backToDefault ? field.initValue : undefined;
                field.state = '';

                delete field.errors;
                delete field.rules;
                delete field.rulesMap;

                if (this.options.parseName) {
                    this.values = setIn(this.values, name, field.value);
                } else {
                    this.values[name] = field.value;
                }
            }
        });

        if (changed) {
            this._reRender();
        }
    }

    reset(ns, backToDefault = false) {
        if (ns === true) {
            log.deprecated('reset(true)', 'resetToDefault()', 'Field');
            this.resetToDefault();
        } else if (backToDefault === true) {
            log.deprecated('reset(ns,true)', 'resetToDefault(ns)', 'Field');
            this.resetToDefault(ns);
        } else {
            this._reset(ns, false);
        }
    }

    resetToDefault(ns) {
        this._reset(ns, true);
    }

    // deprecated. TODO: remove in 2.0 version
    isValidating(name) {
        log.deprecated('isValidating', 'getState', 'Field');
        return this.getState(name) === 'loading';
    }

    getNames() {
        const fieldsMeta = this.fieldsMeta;
        return fieldsMeta
            ? Object.keys(fieldsMeta).filter(() => {
                  return true;
              })
            : [];
    }

    remove(ns) {
        if (typeof ns === 'string') {
            ns = [ns];
        }
        if (!ns) {
            this.values = {};
        }

        const names = ns || Object.keys(this.fieldsMeta);
        names.forEach(name => {
            if (name in this.fieldsMeta) {
                delete this.fieldsMeta[name];
            }
            if (this.options.parseName) {
                // this.values = deleteIn(this.values, name);
            } else {
                delete this.values[name];
            }
        });
    }

    /**
     * splice in a Array
     * @param {String} keyMatch like name.{index}
     * @param {Number} startIndex index
     */
    spliceArray(keyMatch, startIndex) {
        if (keyMatch.indexOf('{index}') === -1) {
            log.warning('{index} not find in key');
            return;
        }

        // regex to match field names in the same target array
        const reg = keyMatch.replace('{index}', '(\\d+)');
        const keyReg = new RegExp(`^${reg}$`);

        let list = [];
        const names = this.getNames();
        names.forEach(n => {
            // is name in the target array?
            const ret = keyReg.exec(n);
            if (ret) {
                const index = parseInt(ret[1]);
                if (index > startIndex) {
                    list.push({
                        index,
                        name: n,
                    });
                }
            }
        });

        list = list.sort((a, b) => a.index < b.index);

        // should be continuous array
        if (list.length > 0 && list[0].index === startIndex + 1) {
            list.forEach(l => {
                const n = keyMatch.replace('{index}', l.index - 1);
                const v = this.getValue(l.name);
                this.setValue(n, v, false);
            });
            this.remove(list[list.length - 1].name);

            let parentName = keyMatch.replace('.{index}', '');
            parentName = parentName.replace('[{index}]', '');
            const parent = this.getValue(parentName);

            if (parent) {
                // if parseName=true then parent is an Array object but does not know an element was removed
                // this manually decrements the array length
                parent.length--;
            }
        }
    }

    _resetError(name) {
        const field = this._get(name);
        delete field.errors; //清空错误
        field.state = '';
    }

    //trigger rerender
    _reRender() {
        if (this.com) {
            if (!this.options.forceUpdate && this.com.setState) {
                this.com.setState({});
            } else if (this.com.forceUpdate) {
                this.com.forceUpdate(); //forceUpdate 对性能有较大的影响，成指数上升
            }
        }
    }

    _get(name) {
        return name in this.fieldsMeta ? this.fieldsMeta[name] : null;
    }
}

export default Field;
