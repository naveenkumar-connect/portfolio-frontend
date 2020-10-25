/* Handles the toolbar and the sidedrawers */

import React, { Component } from 'react';
import Aux from '../../hoc/AuxHoc';
import './Layout.css';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer';

class Layout extends Component {

    state = {
        showSideDrawer: false   //used to launch sidedrawer when set true
    }

    sideDrawerClosedHandler = () =>{
        /* closes side drawer by setting the state's showSideDrawer as False */
        this.setState({
            showSideDrawer: false
        });
    }

    sideDrawerToggleHandler = () => {
        /* toggle the state of sidedrawer(on/off) by toggling state property showSideDrawer */
        this.setState ( ( prevState ) => {
            return { showSideDrawer: !prevState.showSideDrawer};
        } );
    }

    render() {
        return(
            <Aux>

                {/* <Toolbar> displays the toolbar.
                    props sent to component - 
                    drawerToggleClicked: toggles state's showSideDrawer from the <Toolbar> so that the SideDrawer can be opened or closed from <Toolbar> 
                    username: Sends username to toolbar. Received from App.js (redux state) 
                */}
                <Toolbar drawerToggleClicked = {this.sideDrawerToggleHandler} username = {this.props.username} />

                {/* <SideDrawer> displays the side drawer.
                    props sent to component - 
                    show: when set true side drawer is displayed otherwise not
                    closed: changes the value of <Layout> state showSideDrawer to false from inside of <SideDrawer> to hide side drawer
                */}
                <SideDrawer show={this.state.showSideDrawer} closed={this.sideDrawerClosedHandler} />

                {/* Displays all the children within <Layout> so that the toolbar and side drawer can be displayed to all pages */}
                <main>
                    {this.props.children}
                </main>
            </Aux>
        );
    }
} 

export default Layout;