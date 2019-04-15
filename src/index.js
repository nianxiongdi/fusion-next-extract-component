import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
 
// import Button from './button/view/button';

import Input from './input/input'

 

ReactDOM.render(
    <div>
    <Input size="large" placeholder="Large"   aria-label="Large" value="this is input" /><br /><br />

 

    </div>,
    // <Button type="primary"  >123</Button>, 
    document.getElementById('root'));
 
 