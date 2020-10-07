import React from 'react';
import './Toolbar.css';
import NavigationItems from '../NavigationItems/NavigationItems';
import Aux from '../../../hoc/AuxHoc';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle';
import { Link } from 'react-router-dom';

const toolbar = (props) => (
    <Aux>
        <header className='Toolbar'>
            <div>
                <Link to ='/' className='AppName'>Portfolio</Link>
            </div>
            <nav>
                <NavigationItems 
                    type='Toolbar'
                />
            </nav>
            <DrawerToggle clicked={props.drawerToggleClicked}/>
        </header>
        
        
    </Aux>
);

export default toolbar;

