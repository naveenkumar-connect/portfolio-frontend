/* 
Implements authentication feature. When user logs in authentication token is shared by the django backend.
The authentication is saved in redux state, it is used for future requests to the backend.
*/

import React, { Component } from 'react';
import axios from 'axios';
import './Auth.css';
import { Redirect, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actionTypes from '../Store/Action';
import portfolio from '../Images/portfolio.png';
import Spinner from '../components/UI/Spinner/Spinner';

class Auth extends Component {
    /* Manages authetication. Sends username and password to backend and receives authentication token. */

    /* Local state for this component */
    state = {
        auth: {
            username : "",
            password : "",
            returnSecureToken: true // required when auth token is requested, when set true token is returned otherwise not
        },
        errorCode: '',              // stores error code for authentication failure
        err: '',                    // stores error for authentication failure
        loading: false              // required for waiting spinner, spinners shows up when loading is set true
    }
  
    handleUserNameChange = (event) => {
        /* updates username in state when the value in the username field of the authentication form changes */
        this.setState ({
            auth: {
                ...this.state.auth,
                username : event.target.value
            }
        });
    }
  
    handlePasswordChange = (event) => {
        /* updates password in state when the value in the password field of the authentication form changes */
        this.setState ({
            auth: {
                ...this.state.auth,
                password : event.target.value
            }
        });
    }
  
    login = (event) => {
        /* executes when authentication form is submitted with credentials */

        //preventDefault() prevents auto reload of page when authentication form is submitted
        event.preventDefault();

        //loading is set true for the wait spinner to show up
        this.setState({
            loading: true
        });

        //request is sent to api with credential and receives auth token in response
        axios.post('/api/user/login/', this.state.auth)
            .then(response => {
                
                //loading is set false for the wait spinner to disappear
                this.setState({
                    loading: false
                });

                if(response.data.status == 'success')
                {   /*  on successfull authetication username, authtoken (returned by backend)
                        and isAuthenticated = true are set in redux state to be used by other components 
                        and set redirect route to home 
                    */

                    //redux action dispatch, sets user authentication details in redux state
                    this.props.onGetToken( {
                        username: this.state.auth.username,
                        authToken: response.data.token,
                        isAuthenticated: true
                    } );
                }

                if(response.data.status == 'wrongCreds')
                {   /*  on unsuccessfull authetication due to wrongs creds the username and password are set to blank 
                        and the error code is set to wrongCreds to display user the wrong credentials response. 
                    */
                    this.setState( {
                        auth: {
                            ...this.state.auth,
                            username : "",
                            password : ""
                        },
                        errorCode: 'wrongCreds'
                    } );
                }
                if(response.data.status == 'improperCreds')
                {   /*  on unsuccessfull authetication due to blank credentials the username and password are set to blank 
                        and the error code is set to improperCreds and error to response.data.err from the response to 
                        display user the improper credentials response. 
                    */
                    this.setState( {
                        errorCode: 'improperCreds',
                        err: response.data.err
                    } );
                }
            })
            .catch(err =>{
                /* executes when any other issue occurs from the backend */

                //loading is set false for the wait spinner to disappear
                this.setState({
                    loading: false
                });
            });
    }

    render() {
        /* renders authentication page */

        /* variable used to conditionally display spinner if state's loading is true 
            otherwise displays the sign in prompt
        */
        var titleOrLoading;
        titleOrLoading = this.state.loading ? 
                            <Spinner type = "login"/>
                            :
                            <h1 className="heading authFont">Please sign in</h1>;

        return(
            <div className='main'>

                {/* authentication form */}
                <form className="text-center SignInForm" onSubmit = {this.login}>
                    
                    {/* portfolio logo */}
                    <img 
                        className="" 
                        src={portfolio}
                        alt="The Portfolio App" 
                        height="150"
                        width="150"
                        
                    />

                    {/* conditionally displaying spinner or the login prompt */}
                    {titleOrLoading}

                    {/* username label and input field */}
                    <label htmlFor="username" className="lab">User Name</label>
                    <input 
                        type="text" 
                        id="username" 
                        className="ControlForm top" 
                        placeholder="Username" 
                        required 
                        autoFocus 
                        value={this.state.auth.username} 
                        onChange={this.handleUserNameChange} 
                    />

                    {/* password label and input field */}
                    <label htmlFor="inputPassword" className="lab">Password</label>
                    <input 
                        type="password" 
                        id="inputPassword" 
                        className="ControlForm bottom" 
                        placeholder="Password" 
                        required  
                        value={this.state.auth.password} 
                        onChange={this.handlePasswordChange}
                    />

                    {/* displays Invalid Credentials prompt when state's errorCode is set to wrongCreds */}
                    {this.state.errorCode == 'wrongCreds'?
                        <div className = "ErrorDisplay">
                            Invalid Credentials !
                        </div>
                        :null
                    }

                    {/* displays error prompt when state's errorCode is set to improperCreds */}
                    {this.state.errorCode == 'improperCreds'?
                        <div className = "ErrorDisplay">
                            {this.state.err.username ? <div> {"Username: " + this.state.err.username} </div> :null}
                            
                            {this.state.err.password ? <div> {"Password: " + this.state.err.password} </div> :null}
                        </div>
                        :null
                    }
                    
                    {/* submit button */}
                    <button className="btn authFont" type="submit"
                    >
                        Sign in
                    </button>
                    
                    {/* Link to sign up page which on click directs route to sign up component */}
                    <p className="authFont createAccount">
                        Don't have an account?  
                        <NavLink
                            to = "/signup"
                            exact
                            className="signup"
                        > Create New !
                        </NavLink>
                    </p>

                    {/* owner discription */}
                    <p className="owner authFont">Designed by Naveen Kumar Saini</p>

                </form>

                {/* when redux state's isAuthenticated is set to true follwing redirection of route occurs  */}
                { 
                   this.props.isAuthenticated ? <Redirect to={'/' + this.state.username + "/home"} /> : null
                }
            
            </div>
        );
    }
}

/* redux state subscription */
const mapStateToProps = state => {
    return {
        ...state
    };
}

/* redux action dispatch */
const mapDispatchToProps = dispatch => {
    return {
        onGetToken: (authData) => dispatch( {type: actionTypes.TOKENRECEIVED, authData: authData } )
    };
}

/*  redux state subscription with connect */
export default connect( mapStateToProps, mapDispatchToProps )( Auth );