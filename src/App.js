import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/layout/Layout';
import AboutApp from './components/AboutApp/AboutApp';
import Home from './containers/Home/Home';
import Auth from './Auth/Auth';
import Logout from './Auth/Logout';
import SignUp from './containers/SignUp/SignUp';
import { connect } from 'react-redux';
import { Redirect, Switch } from 'react-router-dom';


class App extends Component
{   
    render(){
      return(
        <BrowserRouter>
          <Layout username = {this.props.username} >
              { 
                this.props.isAuthenticated ?
                  <Route path ="/" exact render = {() => (<Redirect to={'/' + this.props.username + "/home"} />)}  />
                  :
                  <Route path ="/" exact render = {() => (<Redirect to='/login' />)} />
              }
              
              <Switch>
                <Redirect exact from="/:urlUsername/proxyhome" to='/:urlUsername/home' />
                <Route path= '/:urlUsername/home' exact component = {Home} />
              </Switch>
              <Route path='/aboutapp' exact component = {AboutApp}  />
              <Route path='/signup' exact component = {SignUp} />
              { 
                this.props.isAuthenticated ?
                  <Route path='/login' exact render = {() => (<Redirect to={'/' + this.props.username + "/home"} />)} />
                  :
                  <Route path='/login' exact component = {Auth} />
              }
              
              <Route path='/logout' exact component = {Logout} /> 
            </Layout>
        </BrowserRouter>
      );
    }

    
}

const mapStateToProps = state => {
  return {
      ...state
  };
}

export default connect( mapStateToProps )( App );