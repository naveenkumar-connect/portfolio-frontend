/* Displays side drawer when drawer toggle is clicked */

import React from 'react';
import NavigationItems from '../NavigationItems/NavigationItems';
import './SideDrawer.css';
import Backdrop from '../../UI/Backdrop/Backdrop';
import Aux from '../../../hoc/AuxHoc';

const sideDrawer = (props) => {
    /* displays side drawer on the basis of props.show and hides side drawer by executing props.closed
       which toggles props.show 
    */

    /* attachedClasses is used to set classes on components of <SideDrawer> so that side drawer can we displayed or hidden
       on the basis of props.show 
    */
    let attachedClasses = ['SideDrawer','Close'];
    if (props.show) {
        attachedClasses = ['SideDrawer','Open'];
    }

    return(
        <Aux>
            {/* <Backdrop> creates a semi transparent background for side drawer which shows up when flag is true
                and is disappeared when clicked is executed which in turn executes props.closed which toggles 
                the props.show
            */}
            <Backdrop flag={props.show} clicked={props.closed} />

            <div className = {attachedClasses.join(' ')}>
                <nav className = "Nav">
                    
                    {/* Navigation Items 
                        props sent to component - 
                        type: defines from where the <NavigationItems> is called to set UI accordingly
                        closeSideDrawer: when executes toggles props.show to false which closes side drawer
                    */}
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

