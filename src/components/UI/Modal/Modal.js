import React from 'react';
import './Modal.css';
import Backdrop from '../Backdrop/Backdrop';
import Aux from '../../../hoc/AuxHoc';

const modal = (props) => {
    let modalClassName = props.smallSize? 'Modal Small' : props.profilePic? 'Modal ProfilePic' : props.SearchField? 'Modal SearchField' : 'Modal Large';
    
    return(
        <Aux>
            <Backdrop flag={props.flag} clicked={props.toggleState}/>  
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

