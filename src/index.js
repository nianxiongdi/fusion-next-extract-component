import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
 
import Button from './button/view/button';
import './index.js'

ReactDOM.render(
    
    <Button type="primary"  >123</Button>, document.getElementById('root'));
 
serviceWorker.unregister();
