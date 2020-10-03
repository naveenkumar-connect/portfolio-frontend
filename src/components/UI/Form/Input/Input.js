import React from 'react';

import './Input.css';

const input = ( props ) => {
    let inputElement = null;
    const inputClasses = [ 'InputElement' ];
    let validationError = null;
    if(props.invalid && props.touched) {
        validationError = <p className='ValidationError'>{props.errorMessage}</p>;
    }

    if (props.invalid && props.shouldValidate && props.touched) {
        inputClasses.push('Invalid');
    }

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
                {inputElement}
                {validationError}
            </div>
        </div>
    );

};

export default input;