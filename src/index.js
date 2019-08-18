import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as serviceWorker from './serviceWorker';
 
// import Button from './button/view/button';

import Form from './form/form'
import Item from './form/item'
import Button from './button/'
import Field from './field/'

// import Input from './input/input'
 
import { Input } from '@alifd/next';
import '@alifd/next/dist/next.css';

import { func } from './util';
const formItemLayout = {
    labelCol: {
        fixedSpan:5
    },
    wrapperCol: {
        span: 14
    }
};



// class App extends React.Component {

//     field = new Field(this, {
//         autoValidate: true
//     });

//     normFile(list) {
//         if (Array.isArray(list)) {
//             return list;
//         }
//         return list && list.fileList;
//     }

//     normDate(date, strdate) {
//         console.log('normDate:', date, strdate);
//         return strdate;
//     }

//     render() {
//         const init = this.field.init;

//         return (<div>
//             <Input {...init('name', { getValueFromEvent: (value) => {
//                 if (value.match(/##/)) {
//                     return value;
//                 } else {
//                     return `## title-${value}`;
//                 }
//             }})} />
//             <Button type="primary" onClick={() => {
//                 consolees</Button>
//         </div>);.log(this.field.getValues());
//             }}>getValu
//     }
// }

class App extends React.Component {
    state = {
        checkboxStatus: true
    }
    field = new Field(this, {
        scrollToFirstError: -10,
        valueName: 'value',
        // parseName: true,
        values: {
            objWithDefaults: {
                a: 1,
                b: 2
            }
        },
        autoValidate: true,     
    });
 
    render() {
        console.log('~render~');
        console.log(this.field.getValues(['obj']));
        console.log('~render~');
        const init = this.field.init;
        // console.log(this.field.getError('input'));
        return (<div className="demo">
            <Input value="123" {...init('obj', {initValue: 'delete all',
            props: {
                // value:'abc1'
            },  
            rules: {required: true},
            trigger: [ 'onChange']})} />
            {this.field.getError('obj.b') ?
                <span style={{color: 'red'}}>{this.field.getError('input').join(',')}</span> : ''}
           
        </div>);
    }
}

  
ReactDOM.render(
    <App />,
// <Button type="primary"  >123</Button>, 
document.getElementById('root'));

 