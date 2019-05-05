import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
 
// import Button from './button/view/button';

import Input from './input/input'
import { func } from './util';


function handleChange(v, e) {
    console.log(v)
}

function hadnleKeyDown(e, opts) {
    console.log(e)
    console.log(opts)
    console.log('----')
}

ReactDOM.render(
    <div>
    <Input size="medium" placeholder="Large"   
        aria-label="Large" 
        defaultValue="init value"
        trim 
        // disabled
        // onChange={handleChange}
        // onKeyDown={hadnleKeyDown}
        maxLength={3}
        hasLimitHint
         
    /><br /><br />

    </div>,
    // <Button type="primary"  >123</Button>, 
    document.getElementById('root'));
 
 