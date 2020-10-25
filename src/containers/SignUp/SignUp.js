/* 
Implements signup feature. User provides personal info such as username, name, email and password to create an account.
The details are stored in database creating the user account and a token is performing user login altogether.
*/

import React, { Component } from 'react';
import './SignUp.css'; 
import Form from '../../components/UI/Form/Form';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import * as actionTypes from '../../Store/Action';
import portfolio from '../../Images/portfolio.png';
import Spinner from '../../components/UI/Spinner/Spinner';

class SignUp extends Component {

    state = {
        redirectToLogin: false, //When set to true redirects route to Login page. It happens when user cancels signup.
        redirectToHome: false,  //When set to true redirects route to Home page. It happens when user account is successfully created.
        errCode: '',            //Stores error code for authentication failure
        err: '',                //Stores error for authentication failure
        loading: false          //Required for waiting spinner, spinners shows up when loading is set true
    }

    onSubmitHandler = (values) => {
        /* executes when user submits for signup with details */

        //loading is set true for the wait spinner to show up
        this.setState({
            loading: true
        });

        /* post request is sent to create account */
        axios.post('/api/user/profile/',
            {
                username: values.username,
                email: values.email,
                name: values.name,
                password: values.password
            })
            .then(response => {
                /* executes when account is created */

                //loading is set false for the wait spinner to disappear
                this.setState({
                    loading: false
                });
                
                if(response.data.status == 'profileCreated')
                {   
                    /* when signup is successful following api is called to get token from the backend */
                    axios.post('/api/user/login/',{
                            username: values.username,
                            password: values.password,
                            returnSecureToken: true
                        })
                        .then(response => { 
                            /* executes when token is successfully received */

                            /* Details are set in redux state after user authentication.
                            */
                            this.props.onGetToken( {
                                username: values.username,
                                authToken: response.data.token,
                                isAuthenticated: true
                            } );
                            
                            /* when authentication is done route should redirect to <Home>, hence, setting redirectToHome as true */
                            this.setState({
                                redirectToHome: true
                            });
                        })
                        .catch(err =>{
                            /* executes in case if error */
                        });
                }
                if(response.data.status == 'improperUsernameAndEmail')
                {   /* executes when username and email are not as per the parameters set by the backend */
                    
                    /* state is changed to let user know about the error */
                    this.setState( {
                        errorCode: 'improperUsernameAndEmail',
                        err: response.data.err
                    } );
                }
            })
            .catch(err =>{

                //loading is set false for the wait spinner to disappear
                this.setState({
                    loading: true
                });
            });
    }

    onCancelHandler = () => {
        /* executes when user cancels login */

        /*  when authentication is cancelled, the route should redirect to login page, 
            hence, setting redirectToLogin as true 
        */
        this.setState({
            redirectToLogin: true
        });
    }

    render() {

        /* object required to set up custom form validation for signup details*/
        const userDetails = {
            username: {
                // inputs unique username

                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Username'
                },
                value: "",                                  // initial value
                validation: {
                    required: true,                         // field can't be left blank
                    usernameUniqueInDatabase: true,         // required when live validation is done with the database for the already presence of username
                    databaseAPI: '/api/user/usernamecheck/' // api from where the above validation is done
                },
            },
            name: {
                // inputs name of the user, may not be unique

                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Name'
                },
                value: "",                                  // initial value
                validation: {
                    required: true,                         // field can't be left blank
                },
            },
            email: {
                // inputs email of the user

                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Email'
                },
                value: "",                                  // initial value
                validation: {
                    required: true,                         // field can't be left blank
                    emailUniqueInDatabase: true,            // required when live validation is done with the database for the already presence of email
                    databaseAPI: '/api/user/emailcheck/'    // api from where the above validation is done
                },
            },
            password: {
                // inputs password

                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: "",                                  // initial value
                validation: {
                    required: true,                         // field can't be left blank
                    minLength: 8                            // length should be at least 8
                },
            },
            password2: {
                // inputs verification password, form submission won't be allowed untill it is similar to the first password

                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Re-enter Password'
                },
                value: "",                                  // initial value
                validation: {
                    required: true,                         // field can't be left blank
                    passwordVerify: true,                   // sets this field to be used as verification of another field
                    similarTo: 'password'                   // name of the field to which this current field needs to be similar to
                },
            }
        };

        return (
            <div className = 'SignUpBox'> 
                <div className ="SignUpImageBox">
                    {/* Portfolio logo  */}
                    <img 
                        className = 'Logo'
                        src={portfolio} 
                        alt="The Portfolio App" 
                        height="100"
                        width="100"
                    />
                </div>

                {   /*  following code either shown loading spinner or 
                        error code(in case any issue occured with the signup details provided by the user) 
                    */
                    this.state.loading ?
                        <Spinner type="login" />
                    :
                    this.state.errorCode == 'improperUsernameAndEmail'?
                        <div className = "SignUpErrorDisplay">
                            {'username: '+this.state.err.username}
                            
                            {this.state.err.email ? <div> Email already exists </div> :null}
                        </div>
                        :null
                }

                {/* signup form */}
                <Form 
                    title = ""
                    formElements = {userDetails}                                   //required to set fields and their validation
                    onSubmission = {(values) => {this.onSubmitHandler(values)}}
                    onCancel = {this.onCancelHandler}
                    oldPasswordWrongError = {this.props.oldPasswordWrongError}
                />

                {/* when user cancels signup, the value of redirectToLogin changes to true and below code executes
                redirecting the route to login page */}
                { this.state.redirectToLogin? <Redirect to = "/login" /> : null }

                {/* when signup is successfull, the value of redirectToHome changes to true and below code executes
                redirecting the route to Home page */}
                { this.state.redirectToHome? <Redirect to = {"/" + this.props.username + "/home"} /> : null }
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
export default connect( mapStateToProps, mapDispatchToProps )( SignUp );