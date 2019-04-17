import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../icon';
import {obj, func} from '../util';
import Base from './base';
import Group from './group';


import './style'
import { typeOf } from '../util/object';
 
/** Input */
export default class Input extends Base {
    static propTypes = {
        ...Base.propTypes,
        /**
         * label
         */
        label: PropTypes.node,
        /**
         * 是否出现clear按钮
         */
        hasClear: PropTypes.bool,
        /**
         * 是否有边框
         */
        hasBorder: PropTypes.bool,
        /**
         * 状态
         * @enumdesc 错误, 校验中, 成功
         */
        state: PropTypes.oneOf(['error', 'loading', 'success']),
        /**
         * 尺寸
         * @enumdesc 小, 中, 大
         */
        size: PropTypes.oneOf(['small', 'medium', 'large']),
        /**
         * 按下回车的回调
         */
        onPressEnter: PropTypes.func,

        onClear: PropTypes.func,
        /**
         * 原生type
         */
        htmlType: PropTypes.string,
        htmlSize: PropTypes.string,
        /**
         * 水印 (Icon的type类型，和hasClear占用一个地方)
         */
        hint: PropTypes.string,
        /**
         * 文字前附加内容
         */
        innerBefore: PropTypes.node,
        /**
         * 文字后附加内容
         */
        innerAfter: PropTypes.node,
        /**
         * 输入框前附加内容
         */
        addonBefore: PropTypes.node,
        /**
         * 输入框后附加内容
         */
        addonAfter: PropTypes.node,
        /**
         * 输入框前附加文字
         */
        addonTextBefore: PropTypes.node,
        /**
         * 输入框后附加文字
         */
        addonTextAfter: PropTypes.node,
        /**
         * (原生input支持)
         */
        autoComplete: PropTypes.string,
        /**
         * 自动聚焦(原生input支持)
         */
        autoFocus: PropTypes.bool,
        inputRender: PropTypes.func,
        extra: PropTypes.node,
        innerBeforeClassName: PropTypes.string,
        innerAfterClassName: PropTypes.string,
    };

    //设置input的props
    static defaultProps = {
        ...Base.defaultProps,
        size: 'medium',
        autoComplete: 'off',
        hasBorder: true,
        onPressEnter: func.noop,
        inputRender: (el) => el,
    };

    constructor(props) {
        super(props);
        console.log(props.defaultProps)
        let value;
        if('value' in props) {
            value = props.value;
        }else {
            value = props.defaultValue;
        }

        this.state = {
            value: typeof value === 'undefined' ? '' : value
        }

    }

    componentWillReceiveProps(nextProps) {
        console.log(123);
    }

    render() {
        // console.log(this.props)
        const {size, prefix, inputRender, value } = this.props;
        // console.log(size)
        // console.log(value)
        // console.log(this.props)

        //获取class的名字
        const cls = classNames(this.getClass(), {
            [`${prefix}${size}`]: true,
            
        });


        //调用Base组件的 getProps方法
        const props = this.getProps();
        // console.log(props)
        // console.log('--')
        
        const inputEl = (
            <input 
                value={value} //这里实现 显示value
                {...props}
            />
        );


        const inputWrap = (
            <span 
                className={cls}>
                {inputRender(inputEl)} 
            </span>
        );
 
 
        return (<Group>
            { inputWrap }
        </Group>);

    }
}
