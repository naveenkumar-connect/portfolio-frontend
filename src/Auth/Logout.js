import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actionTypes from '../Store/Action';
import Spinner from '../components/UI/Spinner/Spinner';

class Logout extends Component {

    state = {
        logoutDone: false,
        loading: false
    }

    render() {
        
        return(
            <div>
                {   this.state.loading ?
                        <Spinner type = "logout" />
                    :null
                }
                {   this.state.logoutDone?
                        <Redirect to='/login' />
                    :null
                }
                
            </div>
        );
    }

     componentDidMount() {
        this.setState({
            loading: true
        });
        axios.delete('/api/user/logout/'+this.props.authToken,{
                    headers: {
                    'Authorization' : `token ${this.props.authToken}`
                    }
                })
                .then(response => {
                    this.props.onLogout();
                    this.setState({
                        loading: false,
                        logoutDone: true
                    });
                })
                .catch(err =>{
                    console.log(err);
                });
    }
    
}

const mapStateToProps = state => {
    return {
        authToken: state.authToken,
        isAuthenticated: state.isAuthenticated
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch( { type: actionTypes.LOGOUT } )
    };
}

export default connect( mapStateToProps, mapDispatchToProps )( Logout );
