import React, { Component } from 'react';
import Aux from '../../hoc/AuxHoc';
import './Layout.css';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer';

class Layout extends Component {

    state = {
        showSideDrawer: false
    }

    sideDrawerClosedHandler = () =>{
        this.setState({
            showSideDrawer: false
        });
    }

    sideDrawerToggleHandler = () => {
        this.setState ( ( prevState ) => {
            return { showSideDrawer: !prevState.showSideDrawer};
        } );
    }

    render() {
        return(
            <Aux>
                <Toolbar drawerToggleClicked={this.sideDrawerToggleHandler} username = {this.props.username} />
                <SideDrawer show={this.state.showSideDrawer} closed={this.sideDrawerClosedHandler} />

                <main>
                    {this.props.children}
                </main>
            </Aux>
        );
    }
} 

export default Layout;