import React from 'react';
import './SingleNavigationItem.css';
import { NavLink } from 'react-router-dom';

const singleNavigationItem = (props) => (
    <li className = 'SingleNavigationItem'>
        <NavLink
            to={props.link}
            exact
            className='NavLink'
            activeStyle = { {
                color: '#e1ff00',
                textDecoration: 'none'
            } } 
        >
            <button className = 'NavigationButton'
                onClick={props.closeSideDrawer}
            >
                {props.children}
            </button>
        </NavLink>
    </li>
);

export default singleNavigationItem;