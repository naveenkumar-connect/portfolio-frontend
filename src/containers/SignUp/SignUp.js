import React, { Component } from 'react';
import './SignUp.css'; 
import Form from '../../components/UI/Form/Form';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import * as actionTypes from '../../Store/Action';
import portfolio from '../../Images/portfolio.png';

class SignUp extends Component {

    state = {
        redirectToLogin: false,
        redirectToHome: false,
        errCode: '',
        err: ''
    }

    onSubmitHandler = (values) => {
        console.log(values);
        axios.post('/api/user/profile/',
            {
                username: values.username,
                email: values.email,
                name: values.name,
                password: values.password
            })
            .then(response => {
                console.log('profile created');
                console.log(response);
                if(response.data.status == 'profileCreated')
                {
                    axios.post('/api/user/login/',{
                            username: values.username,
                            password: values.password,
                            returnSecureToken: true
                        })
                        .then(response => { 
                            this.props.onGetToken( {
                                username: values.username,
                                authToken: response.data.token,
                                isAuthenticated: true
                            } );
                            console.log('username testing');
                            console.log(values.username);
                            this.setState({
                                redirectToHome: true
                            });
                        })
                        .catch(err =>{
                            console.log(err);
                        });
                }
                if(response.data.status == 'improperUsernameAndEmail')
                {  
                    this.setState( {
                        errorCode: 'improperUsernameAndEmail',
                        err: response.data.err
                    } );
                }
            })
            .catch(err =>{
                console.log(err);
            });
    }

    onCancelHandler = () => {
        this.setState({
            redirectToLogin: true
        });
    }

    render() {

        const userDetails = {
            username: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Username'
                },
                value: "",
                validation: {
                    required: true,
                },
            },
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Name'
                },
                value: "",
                validation: {
                    required: true,
                },
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Email'
                },
                value: "",
                validation: {
                    required: true,
                },
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: "",
                validation: {
                    required: true,
                    minLength: 8
                },
            },
            password2: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Re-enter Password'
                },
                value: "",
                validation: {
                    required: true,
                    passwordVerify: true,
                    similarTo: 'password'
                },
            }
        };

        return (
            <div className = 'SignUpBox'> 
                <div className ="SignUpImageBox">
                    <img 
                        className = 'Logo'
                        src={portfolio} 
                        alt="The Portfolio App" 
                        height="100"
                        width="100"
                    />
                </div>

                {this.state.errorCode == 'improperUsernameAndEmail'?
                    <div className = "SignUpErrorDisplay">
                        {this.state.err.username ? <div> Username is already taken </div> :null}
                        
                        {this.state.err.email ? <div> Email already exists </div> :null}
                    </div>
                    :null
                }

                <Form 
                    title = ""
                    formElements = {userDetails}
                    onSubmission = {(values) => {this.onSubmitHandler(values)}}
                    onCancel = {this.onCancelHandler}
                    oldPasswordWrongError = {this.props.oldPasswordWrongError}
                />
                { this.state.redirectToLogin? <Redirect to = "/login" /> : null }
                { this.state.redirectToHome? <Redirect to = {"/" + this.props.username + "/home"} /> : null }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ...state
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onGetToken: (authData) => dispatch( {type: actionTypes.TOKENRECEIVED, authData: authData } )
    };
}

export default connect( mapStateToProps, mapDispatchToProps )( SignUp );