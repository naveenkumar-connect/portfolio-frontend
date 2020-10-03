import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actionTypes from '../Store/Action';

class Logout extends Component {

    render() {
        
        return(
            <div>
                {   this.props.isAuthenticated ?
                        null
                        :
                        <Redirect to='/login' />
                }
                
            </div>
        );
    }

    componentDidMount() {
        axios.delete('http://127.0.0.1:8000/api/user/logout/'+this.props.authToken,{
                    headers: {
                    'Authorization' : `token ${this.props.authToken}`
                    }
                })
                .then(response => {
                    this.props.onLogout();
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
