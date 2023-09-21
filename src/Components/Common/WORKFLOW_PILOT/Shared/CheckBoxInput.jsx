import * as React from 'react';
import './checkbox.css'

export default function ControlledCheckbox(props) {
    //setting the escalted status ...0 for fresh
    const [checked, setChecked] = React.useState(props?.is_escalate);
    console.log('is escalate in concession...',props?.is_escalate)

    const handleChange = (event) => {
        setChecked(event.target.checked);
        props.fun(event.target.checked)
    };

    return (
        <div class="cntr flex gap-1 items-center">
            <input type='checkbox'
                class="hidden-xs-up"
                id='cbx'
                checked={checked}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'controlled' }}
            /><label for="cbx" class="cbx"></label> <span className='text-md font-semibold'>Escalate</span>
        </div>
    );
}
/**
 * Exported to :
 * 1. Workflow Component
 * 
 */