import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as serviceWorker from './serviceWorker';
 
// import Button from './button/view/button';

import Form from './form/form'
import Item from './form/item'

import Input from './input/input'
 
// import { Input } from '@alifd/next';
// import '@alifd/next/dist/next.css';

import { func } from './util';
const formItemLayout = {
    labelCol: {
        fixedSpan:5
    },
    wrapperCol: {
        span: 14
    }
};



function onchangeHandle(item1, item2) {
    console.log('123');
}


   // onChange={item=>console.log(item)}>
class Demo extends React.Component {
    render(){
        return (<div>
            <Input size="medium" placeholder="Large"   
                aria-label="Large" /><br /><br />
            <Form style={{width: '60%'}} {...formItemLayout}   
            size="large" labelAlign="left" labelTextAlign="right"
            >
         
                {/* <Item label="password:">
                    <Input htmlType="password" name="basePass" placeholder="Please Enter Password"/>
                </Item>
                <Item label="password:">
                    <Input htmlType="password" name="basePass" placeholder="Please Enter Password"/>
                </Item>
                <Item label="password:">
                    <Input htmlType="password" name="basePass" placeholder="Please Enter Password"/>
                </Item> */}
                <Item label="username:" size="small">
                    <Input htmlType="username" id="username" size="large" abc='123' name="uname" placeholder="Please Enter Username"/>
                </Item>
                 <Item label="password:"  >
                    <Input htmlType="password"  id="password" name="upass" placeholder="Please Enter Password"/>
                </Item>
            </Form>
    
            { null } {/* no display */}
        </div>);
    }
}


  
ReactDOM.render(
    <Demo />,
// <Button type="primary"  >123</Button>, 
document.getElementById('root'));

 