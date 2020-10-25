/*  Displays single field of <Form> 
    Displays error on the field, if any
*/

import React from 'react';
import './Input.css';

const input = ( props ) => {

    //holds the field to be displayed
    let inputElement = null;

    //css class for the input Element
    const inputClasses = [ 'InputElement' ];

    //used to display validation error
    let validationError = null;

    /*  when field value does't satisfy some constraint after it has been changed once, the error message element 
        is assigned to validationError to be displayed to the user
    */
    if(props.invalid && props.touched) {
        validationError = <p className='ValidationError'>{props.errorMessage}</p>;
    }

    /*  When the field value is invalid after it has been changed once and is set to be validated by the user
        then the css class 'Invalid' is added to inputClasses so that CSS can display the error to the user
    */
    if (props.invalid && props.shouldValidate && props.touched) {
        inputClasses.push('Invalid');
    }

    /*  switch decides the type of the field to be displayed on the basic of the props.elementType given to the 
        component.
    */
    switch ( props.elementType ) {
        case ( 'input' ):
            inputElement = <input
                className={inputClasses.join(' ')}
                {...props.elementConfig}
                value={props.value}
                onChange={props.changed} />;
            break;
        case ( 'textarea' ):
            inputElement = <textarea
                className={inputClasses.join(' ')}
                {...props.elementConfig}
                value={props.value}
                onChange={props.changed} />;
            break;
        case ( 'select' ):
            inputElement = (
                <select
                    className={inputClasses.join(' ')}
                    value={props.value}
                    onChange={props.changed}>
                    {props.elementConfig.options.map(option => (
                        <option key={option.value} value={option.displayValue}>
                            {option.displayValue}
                        </option>
                    ))}
                </select>
            );
            break;
        default:
            inputElement = <input
                className={inputClasses.join(' ')}
                {...props.elementConfig}
                value={props.value}
                onChange={props.changed} />;
    }

    return (
        <div className = 'Input'>
            <label className = 'Label'>{props.elementConfig.placeholder}</label>
            <div>
                {inputElement}      {/* displays field */}
                {validationError}   {/* displays validation error if any */}
            </div>
        </div>
    );

};

export default input;