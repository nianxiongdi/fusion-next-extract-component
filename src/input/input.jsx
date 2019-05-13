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
        // console.log(props.defaultProps)
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

    /**
     * 获取字符串的长度， 也可以自定义
     **/
    getValueLength(value) {
        console.log('--getValueLength')
        const nv = `${value}`;
        
        //这里判断是否是用户 自定义的方法获取长度，若没有定义  返回的是undefined
        let strLen = this.props.getValueLength(nv);
    
        // 若用户没有自定义 则获取的是字符串长度  思想666
        if (typeof strLen !== 'number') {
            strLen = nv.length;
        }

        return strLen;
    }

 
    componentWillReceiveProps(nextProps) {
        console.log(123);
    }

    //onKeyDown事件的调用函数
    handleKeyDown = e => {

        // Enter键
        if(e.keyCode === 13) {
            //\
            return ;
        }

        //调用的是父类的方法
        this.onKeyDown(e);
    }

    renderControl() {
        const { prefix, //前缀
            state
         } = this.props;

        const lenWrap = this.renderLength();

         console.log('----------renderControl-------')
         console.log(lenWrap)
        let stateWrap = null;
        if (state === 'success') {
            stateWrap = <Icon type="success-filling"/>;
        } else if (state === 'loading') {
            stateWrap = <Icon type="loading"/>;
        }

        return <span className={`${prefix}input-control`}>
            {stateWrap}{lenWrap} 
        </span> ;
 
    }
    

    render() {
        // console.log(this.props)
        
        this.renderLength();

        const {
            size, // 输入框的带下 
            prefix, // class的前缀
            inputRender, //渲染
            value,
            htmlType, // 原生的type类型判断
            

        } = this.props;
         // console.log(size)
        // console.log(value)
        // console.log(this.props)
        // console.log(disabled)
        //获取class的名字
        const cls = classNames(this.getClass(), {
            [`${prefix}${size}`]: true,
            [`${prefix}hidden`]: this.props.htmlType === 'hidden',

        });


        //调用Base组件的 getProps方法
        const props = this.getProps();
        // console.log(props)
        // console.log('--')
        
         // custom data attributes are assigned to the top parent node
        // data-类自定义数据属性分配到顶层node节点
        const dataProps = obj.pickAttrsWith(this.props, 'data-');
        // Custom props are transparently transmitted to the core input node by default
        // 自定义属性默认透传到核心node节点：input
        const others = obj.pickOthers(Object.assign({}, dataProps, Input.propTypes), this.props);

        const inputEl = (
            <input 
                {...others} 
                value={value} //这里实现 显示value
                onKeyDown={this.handleKeyDown}
                type={htmlType}
                {...props}
            />
        );
        
     

        const inputWrap = (
            <span 
                className={cls}>
                {inputRender(inputEl)} 
                {this.renderControl()}
            </span>
        );
 
 
        return (<Group>
            { inputWrap }
        </Group>);

    }
}
