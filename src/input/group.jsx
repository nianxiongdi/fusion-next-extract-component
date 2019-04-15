import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../config-provider';

/**
 * Input.Group
 */
class Group extends React.Component {
    static propTypes = {
        /**
         * 样式前缀
         */
        prefix: PropTypes.string,
        className: PropTypes.string,
        style: PropTypes.object,
        children: PropTypes.node,
        /**
         * 输入框前附加内容
         */
        addonBefore: PropTypes.node,
        /**
         * 输入框前附加内容css
         */
        addonBeforeClassName: PropTypes.string,
        /**
         * 输入框后附加内容
         */
        addonAfter: PropTypes.node,
        /**
         * 输入框后额外css
         */
        addonAfterClassName: PropTypes.string,
        /**
         * rtl
         */
        rtl: PropTypes.bool,
    };

    static defaultProps = {
        prefix: 'next-',
    };

    render() {
        const {children } = this.props;
        // console.log( this.props)
        return (
            <span    >
          
                {children}
          
            </span>
        );
    }
}

export default ConfigProvider.config(Group);
