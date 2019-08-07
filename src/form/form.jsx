import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { obj, func } from '../util';
import Field from '../field';
import './main.scss'
 
/**
 * 不存在的对象进行消除
 * @param {对象} obj 
 */
function pickerDefined(obj) {
    const newObj = {};
    Object.keys(obj).forEach(key => {
        if( typeof obj[key] !== 'undefined' ) {
            newObj[key] = obj[key];
        }
    })
    return newObj;
}

//阻止默认事件
function preventDefault(e) {
    e.preventDefault();
}



/** Form */
export default class Form extends React.Component {
    static propTypes = {
        /**
         * 样式前缀
         */
        prefix: PropTypes.string,
        /**
         * 内联表单
         */
        inline: PropTypes.bool,
        /**
         * 单个 Item 的 size 自定义，优先级高于 Form 的 size, 并且当组件与 Item 一起使用时，组件自身设置 size 属性无效。
         * @enumdesc 大, 中, 小
         */
        size: PropTypes.oneOf(['large', 'medium', 'small']),
        /**
         * 标签的位置
         * @enumdesc 上, 左, 内
         */
        labelAlign: PropTypes.oneOf(['top', 'left', 'inset']),
        /**
         * 标签的左右对齐方式
         * @enumdesc 左, 右
         */
        labelTextAlign: PropTypes.oneOf(['left', 'right']),
        /**
         * 经 `new Field(this)` 初始化后，直接传给 Form 即可 用到表单校验则不可忽略此项
         */
        field: PropTypes.any,
        /**
         * 保存 Form 自动生成的 field 对象
         */
        saveField: PropTypes.func,
        /**
         * 控制第一级 Item 的 labelCol
         */
        labelCol: PropTypes.object,
        /**
         * 控制第一级 Item 的 wrapperCol
         */
        wrapperCol: PropTypes.object,
        /**
         * form内有 `htmlType="submit"` 的元素的时候会触发
         */
        onSubmit: PropTypes.func,
        /**
         * 子元素
         */
        children: PropTypes.any,
        /**
         * 扩展class
         */
        className: PropTypes.string,
        /**
         * 自定义内联样式
         */
        style: PropTypes.object,
        /**
         * 表单数值
         */
        value: PropTypes.object,
        /**
         * 表单变化回调
         * @param {Object} values 表单数据
         * @param {Object} item 详细
         * @param {String} item.name 变化的组件名
         * @param {String} item.value 变化的数据
         * @param {Object} item.field field 实例
         */
        onChange: PropTypes.func,
        /**
         * 设置标签类型
         */
        component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        fieldOptions: PropTypes.object,
        rtl: PropTypes.bool,
    };

    static defaultProps = {
        prefix: 'next-',
        component: 'form',
        onSubmit: preventDefault,
        saveField: func.noop,// 默认方法为 ()=>{}
        onChange: func.noop,
    };

    static childContextTypes = {
        _formField: PropTypes.object,
        _formSize: PropTypes.string,
    };

    constructor(props) {
        super(props);
        
        const options = {
            ...props.fieldOptions,
            // 通过onchange去管理数据
            onChange: this.onChange,
        };
        
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

        // saveField	保存 Form 自动生成的 field 对象
        props.saveField(this._formField);

    }
    onChange = (name, value) => {
        // console.log(123);
        this.props.onChange(this._formField.getValues(), {
            name,
            value,
            field: this._formField,
        });
    };

    //传递给Item参数
    getChildContext() {
        
        return {
            _formField: this.props.field ? this.props.field : this._formField,
            _formSize: this.props.size,
        };
    }

    render() {
        const { 
            prefix, 
            size,
            children,
            component: Tag,
            labelCol,
            wrapperCol,
            labelAlign, // 位置
            labelTextAlign, //标签的对齐方式
            onSubmit,
        } = this.props;
        
    
        
        const formClassName = classNames({
            [`${prefix}form`]: true,
            [`${prefix}${size}`]: size,
        });
 
        return (
            <Tag
                className={formClassName}
                onSubmit={onSubmit}
                >
                {
                    React.Children.map(children, child=>{
                        // console.log( child );
                        // console.log( child );
                        if(child &&
                            typeof child.type === 'function' &&
                            child.type._typeMark === 'form_item') {
                                const childrenProps = {
                                    labelCol: child.props.labelCol
                                        ? child.props.labelCol // 子元素若传递labelCol，则优先使用子元素，否则使用父元素
                                        : labelCol,
                                    wrapperCol: child.props.wrapperCol
                                        ? child.props.wrapperCol
                                        : wrapperCol,
                                    labelAlign: child.props.labelAlign // 标签的位置
                                        ? child.props.labelAlign
                                        : labelAlign,
                                    labelTextAlign: child.props.labelTextAlign // 标签相当于组件的左右位置
                                        ? child.props.labelTextAlign
                                        : labelTextAlign
                                }
                                return React.cloneElement(
                                    child,
                                    pickerDefined(childrenProps)
                                );
                        }
                        return child;
                    })
                }
             
            </Tag>
        );
    }
}
