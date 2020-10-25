/*  Displays Dialogue box with sizes as per user requests   */

import React from 'react';
import './Modal.css';
import Backdrop from '../Backdrop/Backdrop';
import Aux from '../../../hoc/AuxHoc';

const modal = (props) => {

    /*  set classname on the basis of the user request, this classname is then responsible to set
        custom size of the dialogue box as per user's request
    */
    let modalClassName = props.smallSize? 'Modal Small' : props.profilePic? 'Modal ProfilePic' : props.SearchField? 'Modal SearchField' : 'Modal Large';
    
    return(
        <Aux>
            {/*     Displays semi transparent background for the modal dialogue box to show up 
                    props sent to component -
                    flag: turn on and off to the <Backdrop> with values true and false respectively
                    clicked: executes to toggle the value of flag to close the backdrop
            */}
            <Backdrop flag={props.flag} clicked={props.toggleState}/>  
            
            {/* Displays whatever is received from the parent component 
                shows up when flag is true
                disappears when flag is false
            */}
            <div 
                className = {modalClassName}
                style={{
                    transform: props.flag ? 'translateY(0)' : 'translateY(-100vh)',
                    opacity: props.flag ? '1' : '0'
                }}
            >
                {props.children}
            </div>
        </Aux>
    );
}

export default modal;

