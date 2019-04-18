import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {func} from '../util';
import zhCN from '../locale/zh-cn';

class Base extends React.Component {
    static propTypes = {
        prefix: PropTypes.string,
        /**
         * 当前值
         */
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        /**
         * 初始化值
         */
        defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        /**
         * 发生改变的时候触发的回调
         * @param {String} value 数据
         * @param {Event} e DOM事件对象
         */
        onChange: PropTypes.func,
        /**
         * 键盘按下的时候触发的回调
         * @param {Event} e DOM事件对象
         * @param {Object} opts 可扩展的附加信息：<br> - opts.overMaxLength: {Boolean} 已超出最大长度<br> - opts.beTrimed: {Boolean} 输入的空格被清理
         */
        onKeyDown: PropTypes.func,
        /**
         * 禁用状态
         */
        disabled: PropTypes.bool,
        /**
         * 最大长度
         */
        maxLength: PropTypes.number,
        /**
         * 是否展现最大长度样式
         */
        hasLimitHint: PropTypes.bool,
        /**
         * 当设置了maxLength时，是否截断超出字符串
         */
        cutString: PropTypes.bool,
        /**
         * 只读
         */
        readOnly: PropTypes.bool,
        /**
         * onChange返回会自动去除头尾空字符
         */
        trim: PropTypes.bool,
        /**
         * 输入提示
         */
        placeholder: PropTypes.string,
        /**
         * 获取焦点时候触发的回调
         */
        onFocus: PropTypes.func,
        /**
         * 失去焦点时候触发的回调
         */
        onBlur: PropTypes.func,
        /**
         * 自定义字符串计算长度方式
         * @param {String} value 数据
         * @returns {Number} 自定义长度
         */
        getValueLength: PropTypes.func,
        inputStyle: PropTypes.object,
        /**
         * 自定义class
         */
        className: PropTypes.string,
        /**
         * 自定义内联样式
         */
        style: PropTypes.object,
        /**
         * 原生type
         */
        htmlType: PropTypes.string,
        /**
         * name
         */
        name: PropTypes.string,
        rtl: PropTypes.bool,
        state: PropTypes.oneOf(['error', 'loading', 'success']),
        locale: PropTypes.object,
    };

    // 默认设置props
    static defaultProps = {
        disabled: false,
        prefix: 'next-', // 设置样式的前缀
        maxLength: null, // 最大长度默认设置为null
        hasLimitHint: false, // 
        cutString: true,
        readOnly: false,
        trim: false, 
        onFocus: func.noop,
        onBlur: func.noop,
        onChange: func.noop,
        getValueLength: func.noop, //自定义字符串计算长度方式
        locale: zhCN.Input,
    }

    // 样式
    getClass() {
        const { disabled, state, prefix } = this.props;

        return classNames({
            [`${prefix}input`]: true,
            [`${prefix}disabled`]: !!disabled,
            [`${prefix}error`]: state === 'error',
            [`${prefix}focus`]: this.state.focus,
        });
    }

    // 这样做的目的不是很明白 很疑惑 
    ieHack(value) {
        return value;
    }
     

    onChange(event) {
        let value = event.target.value;
        
        // value = this.ieHack(value);

        // 这个代码看半天才明白啥意思   当你传value的时候，用户自定义控制修改， 当用户没有 传这个字段时，自己修改
        if (!('value' in this.props)) {
            this.setState({
                value
            });
        }
        
        // 回调用户自定义的方法
        this.props.onChange(value, event);        
    }


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


    //  这个主要封装一些属性和方法 返回给Input组件
    // 以对象的形式返回
    getProps() {

        const props = {
            value: this.state.value,
            onChange: this.onChange.bind(this) , // 绑定this
            onKeyDown: this.onKeyDown.bind(this) //onKeyDown 进行this绑定
        }
 

        return props;
    }

   
}

export default Base;
