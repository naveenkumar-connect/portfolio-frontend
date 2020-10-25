/* Displays toolbar */

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
                {/* Application Name */}
                <Link to ='/' className='AppName'>Portfolio</Link>
            </div>
            <nav>
                {/* Navigation Items 
                    props sent to component - 
                    type: defines from where the <NavigationItems> is called to set UI accordingly
                */}
                <NavigationItems 
                    type='Toolbar'
                />
            </nav>

            {/* Displaying ham burger styled toggle button on toolbar when displying full navigations items is not possible
                props sent to component - 
                clicked: when onClick of a component inside <DrawerToggle> is triggered then props.drawerToggleClicked is 
                executed which toggles <Layout> state's showSideDrawer which in turn closes the side drawer
            */}
            <DrawerToggle clicked={props.drawerToggleClicked}/>
        </header>
        
        
    </Aux>
);

export default toolbar;

