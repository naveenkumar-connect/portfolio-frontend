import React, { Component } from 'react';
import './AboutApp.css'; 
import portfolio from '../../Images/portfolio.png';

class AboutApp extends Component {
    render() {
        return (
            <div className = 'AboutAppBox'> 
                <div className = 'AboutAppTitle'>
                  About
                </div>

                <div className = "ContentAndImage">
                    <div className = "AboutAppContent">
                        <h4 style = {{color: "#077bff"}}>Portfolio Web application</h4>
                        <b>Version: </b>1.00                        <br />
                        <b>Developed By: </b>Naveen Kumar Saini     <br />
                        <b>Portfolio account: </b> portfolioapp.com/naveen          <br/>
                        <br />
                        <h4 style = {{color: "#077bff"}}>Technologies used </h4>
                        <b>Front End: </b>JavaScript and React 16.13.1<br />
                        <b>Back End: </b>Python 3.7.0, Django 3.1 and Django Rest Framework 3.11.1<br />
                        <b>Database: </b>PostgreSQL 12.2<br />
                        <br />
                        <br />
                        <br />
                    </div>

                    <div className = "AboutAppImage">
                        <img 
                            src={portfolio} 
                            alt="The Portfolio App" 
                            height="200"
                            width="200"
                            
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default AboutApp;

