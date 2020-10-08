import React, { Component } from 'react';
import axios from 'axios';
import './Auth.css';
import { Redirect, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actionTypes from '../Store/Action';
import portfolio from '../Images/portfolio.png';
import Spinner from '../components/UI/Spinner/Spinner';

class Auth extends Component {
    
    state = {
        auth: {
            username : "",
            password : "",
            returnSecureToken: true
        },
        errorCode: '',
        err: '',
        loading: false
    }
  
    handleUserNameChange = (event) => {
        this.setState ({
            auth: {
                ...this.state.auth,
                username : event.target.value
            }
        });
    }
  
    handlePasswordChange = (event) => {
        this.setState ({
            auth: {
                ...this.state.auth,
                password : event.target.value
            }
        });
    }
  
    login = (event) => {
        event.preventDefault();
        this.setState({
            loading: true
        });
        axios.post('/api/user/login/', this.state.auth)
            .then(response => { 
                this.setState({
                    loading: false
                });
                if(response.data.status == 'success')
                {  
                    this.props.onGetToken( {
                        username: this.state.auth.username,
                        authToken: response.data.token,
                        isAuthenticated: true
                    } );
                }
                if(response.data.status == 'wrongCreds')
                {  
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
                {  
                    this.setState( {
                        errorCode: 'improperCreds',
                        err: response.data.err
                    } );
                }
                console.log('response.data.token');
                console.log(response);
            })
            .catch(err =>{
                this.setState({
                    loading: false
                });
                console.log('err');
                console.log(err.response);
            });
    }

    render() {
        var titleOrLoading;
        titleOrLoading = this.state.loading ? 
                            <Spinner type = "login"/>
                            :
                            <h1 className="heading authFont">Please sign in</h1>;

        return(
            <div className='main'>
                <form className="text-center SignInForm" onSubmit = {this.login}>
                    <img 
                        className="" 
                        src={portfolio}
                        alt="The Portfolio App" 
                        height="150"
                        width="150"
                        
                    />
                    {titleOrLoading}
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

                    {this.state.errorCode == 'wrongCreds'?
                        <div className = "ErrorDisplay">
                            Invalid Credentials !
                        </div>
                        :null
                    }

                    {this.state.errorCode == 'improperCreds'?
                        <div className = "ErrorDisplay">
                            {this.state.err.username ? <div> {"Username: " + this.state.err.username} </div> :null}
                            
                            {this.state.err.password ? <div> {"Password: " + this.state.err.password} </div> :null}
                        </div>
                        :null
                    }
                    
                    <button className="btn authFont" type="submit"
                    >
                        Sign in
                    </button>

                    <p className="authFont createAccount">
                        Don't have an account?  
                        <NavLink
                            to = "/signup"
                            exact
                            className="signup"
                        > Create New !
                        </NavLink>
                    </p>

                    <p className="owner authFont">Designed by Naveen Kumar Saini</p>

                </form>
                { 
                   this.props.isAuthenticated ? <Redirect to={'/' + this.state.username + "/home"} /> : null
                }
            
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

export default connect( mapStateToProps, mapDispatchToProps )( Auth );