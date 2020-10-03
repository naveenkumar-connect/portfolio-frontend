import React from 'react';
import './Backdrop.css';

const backdrop = (props) => (
    props.flag ? <div className='Backdrop' onClick={props.clicked}></div> : null
);

export default backdrop;