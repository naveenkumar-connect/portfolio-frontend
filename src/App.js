/* 
Defines routes and UI layout for the project
*/

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
{   /*
    Main component for this project, sets routes and call Layout Component in the project
    */
    render(){
      return(

        // Routing works for all the sub components in the BrowserRouter component
        <BrowserRouter>

          {/* <Layout> handles the toolbar and the sidedrawers.
              props sent to component - 
              username: taken from the redux state
          */}
          <Layout username = {this.props.username} >

            {/* Only one of the routes is selected at a time declared within <Switch> */}
            <Switch>
                { /*if user is authenticated then go to the home page otherwise to the login page when "<baseurl>/" is typed in url bar*/
                  this.props.isAuthenticated ?
                    <Route path ="/" exact render = {() => (<Redirect to={'/' + this.props.username + "/home"} />)}  />
                    :
                    <Route path ="/" exact render = {() => (<Redirect to='/login' />)} />
                }
                
                  { /* 
                    following proxyhome concept is used because the <Home> does no rerender otherwise if 
                    we search for a new user in the toolbar search box
                  */}
                  <Redirect exact from="/:urlUsername/proxyhome" to='/:urlUsername/home' />
                  <Route path= '/:urlUsername/home' exact component = {Home} />
                
                <Route path='/aboutapp' exact component = {AboutApp}  />
                <Route path='/signup' exact component = {SignUp} />
                { /*  
                      if user is authenticated then go to home page otherwise go to login page when user 
                      types <baseurl>/login in url bar 
                  */
                  this.props.isAuthenticated ?
                    <Route path='/login' exact render = {() => (<Redirect to={'/' + this.props.username + "/home"} />)} />
                    :
                    <Route path='/login' exact component = {Auth} />
                }
                
                <Route path='/logout' exact component = {Logout} /> 

                {/* All the other unmatched urls request will be given response of 404 page not found by the below route */}
                <Route 
                  render = {() => 
                    <div className = "PageNotFound">
                      Error 404: Page not found
                    </div> 
                  } 
                />
            </Switch>
          </Layout> 
        </BrowserRouter>
      );
    }

    
}

const mapStateToProps = state => {
  /* redux store state is called in App component */
  return {
      ...state
  };
}

/*  redux state subscription i.e. redux store state is connected to <App> 
    such that store state can be called in <App> as props 
*/
export default connect( mapStateToProps )( App );