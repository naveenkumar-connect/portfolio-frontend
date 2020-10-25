/* Displays the Navigation Items on the toolbar and the sidedrawer */

import React from 'react';
import './NavigationItems.css';
import SingleNavigationItem from './SingleNavigationItem/SingleNavigationItem';

import { connect } from 'react-redux';
import SearchField from '../../../containers/SearchField/SearchField';


const navigationItems = (props) => {

    /*  cssClass value depends on whether the <NavigationItems> is called from Toolbar or Sidedrawer.
        Separate css classes are required for navigation items display in toolbar and side drawer
    */
    let cssClass;
    if(props.type==='Toolbar')
        cssClass='NavigationItems NavigationItemsToolbar'
    else if(props.type==='SideDrawer')
        cssClass='NavigationItems NavigationItemsSideDrawer'
    
    

    return(
        <div>
            <ul className = {cssClass}>

                {/* Displays SearchField */}
                <SearchField closeSideDrawer = {props.closeSideDrawer} />

                {/* home link will only be seen in navigation items when user is logged in */
                    props.isAuthenticated ?
                        <SingleNavigationItem 
                        link={'/'+props.username+'/proxyhome'} 
                        closeSideDrawer = {props.closeSideDrawer}
                        >
                            Home
                        </SingleNavigationItem> 
                        :
                        null
                
                }

                {/* Displays link to about app */}
                <SingleNavigationItem 
                    link='/aboutapp'
                    closeSideDrawer = {props.closeSideDrawer}
                >
                    About
                </SingleNavigationItem>

                {/* login link is visible only when no user is logged in */
                    !props.isAuthenticated ?
                        <SingleNavigationItem 
                            link='/login'
                            closeSideDrawer = {props.closeSideDrawer}
                        >
                            Login
                        </SingleNavigationItem> 
                        :
                        <SingleNavigationItem 
                            link='/logout'
                            closeSideDrawer = {props.closeSideDrawer}
                        >
                            Logout
                        </SingleNavigationItem>
                
                }
                
            </ul>
            
        </div>
    );
}

/* redux state subscription */
const mapStateToProps = state => {
    return {
        ...state
    };
}

/*  redux state subscription with connect */
export default connect( mapStateToProps )( navigationItems );
