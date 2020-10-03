import React from 'react';
import NavigationItems from '../NavigationItems/NavigationItems';
import './SideDrawer.css';
import Backdrop from '../../UI/Backdrop/Backdrop';
import Aux from '../../../hoc/AuxHoc';

const sideDrawer = (props) => {

    let attachedClasses = ['SideDrawer','Close'];
    if (props.show) {
        attachedClasses = ['SideDrawer','Open'];
    }

    return(
        <Aux>
            <Backdrop flag={props.show} clicked={props.closed} />
            <div className = {attachedClasses.join(' ')}>
                <nav className = "Nav">
                    <NavigationItems 
                        type='SideDrawer'
                        closeSideDrawer = {props.closed}
                    />
                </nav>
            </div>
        </Aux>
    );

};

export default sideDrawer;

