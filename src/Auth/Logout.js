/* 
Implements logout feature. When user opts to logout, the redux state's authetication details are cleared and
the token in the backend is deleted.
*/

import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actionTypes from '../Store/Action';
import Spinner from '../components/UI/Spinner/Spinner';

class Logout extends Component {

    state = {
        logoutDone: false,  //when this value changes to true it indicates logout is successful and route redirects to login page 
        loading: false      //required for waiting spinner, spinners shows up when loading is set true 
    }

    render() {
        
        return(
            <div>
                {/* spinner shows up when laoding is true */
                    this.state.loading ?
                        <Spinner type = "logout" />
                    :null
                }
                {/* route is redirected to login page when logoutDone is set to true */   
                    this.state.logoutDone?
                        <Redirect to='/login' />
                    :null
                }
                
            </div>
        );
    }

     componentDidMount() {
        /* performs api request to backend to delete the user token */ 

        //loading is set true for the wait spinner to show up
        this.setState({
            loading: true
        });

        //delete request is sent to backend to delete currently logged in user's token
        axios.delete('/api/user/logout/'+this.props.authToken,{
                    headers: {
                    'Authorization' : `token ${this.props.authToken}`
                    }
                })
                .then(response => {
                    /* executes when token deletetion is successful at the backend */

                    this.props.onLogout();  //dispact action to redux state to clear authentication details from the state
                    this.setState({
                        loading: false,     //loading is set false for the wait spinner to disappear
                        logoutDone: true    //logoutDone is set true to redirect the route to login page when logout is successful
                    });
                })
                .catch(err =>{
                    /* executes when token deletion fails */
                });
    }
    
}

/* redux state subscription */
const mapStateToProps = state => {
    return {
        authToken: state.authToken,
        isAuthenticated: state.isAuthenticated
    };
}

/* redux action dispatch */
const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch( { type: actionTypes.LOGOUT } )
    };
}

/*  redux state subscription with connect */
export default connect( mapStateToProps, mapDispatchToProps )( Logout );
