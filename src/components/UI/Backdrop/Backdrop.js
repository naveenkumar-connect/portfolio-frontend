/*  Displays semi transparent backgrond when requested */

import React from 'react';
import './Backdrop.css';

const backdrop = (props) => (
    /*  show up when props.flag is true and disappears when props.flag is false.
        onClick executes props.clicked which toggles props.flag to false which in turn disappers the 
        <Backdrop>
    */
    props.flag ? <div className='Backdrop' onClick={props.clicked}></div> : null
);

export default backdrop;