import React from 'react';
import './NavigationItems.css';
import SingleNavigationItem from './SingleNavigationItem/SingleNavigationItem';

import { connect } from 'react-redux';
import SearchField from '../../../containers/SearchField/SearchField';


const navigationItems = (props) => {

    let cssClass;
    if(props.type==='Toolbar')
        cssClass='NavigationItems NavigationItemsToolbar'
    else if(props.type==='SideDrawer')
        cssClass='NavigationItems NavigationItemsSideDrawer'
    
    

    return(
        <div>
            <ul className = {cssClass}>
                <SearchField closeSideDrawer = {props.closeSideDrawer} />
                {
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
                <SingleNavigationItem 
                    link='/aboutapp'
                    closeSideDrawer = {props.closeSideDrawer}
                >
                    About
                </SingleNavigationItem>
                {
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

const mapStateToProps = state => {
    return {
        ...state
    };
}

export default connect( mapStateToProps )( navigationItems );
