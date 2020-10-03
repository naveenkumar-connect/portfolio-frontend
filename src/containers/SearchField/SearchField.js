import React, { Component } from 'react';
import './SearchField.css';
import Modal from '../../components/UI/Modal/Modal';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import defaultProfilePicture from '../../Images/defaultProfilePicture.png';

class SearchField extends Component {

    state = {
        list: [],
        pre: null,
        next: null,
        noOfPages: 0,
        currentPage: 1,
        modalFlag: false,
        searchUser: '',
        userDetail: {
            username:{
                profilePic: '',
                profile: ''
            }
        }
    }

    toggleModalFlag = () => { 
        this.setState ({ 
          modalFlag: !this.state.modalFlag,
          currentPage: 1
        }); 

    }

    searchChangedHandler = (event) => {
        this.setState({
            searchFieldValue: event.target.value
        });
    }

    onSubmitHandler = (event) => {
        event.preventDefault();
        this.toggleModalFlag();
        this.getValue('http://127.0.0.1:8000/api/user/searchprofile/?search=' + this.state.searchFieldValue + '&page=1');
    }

    preHandler = () => {
        this.getValue(this.state.pre);
        this.setState( {
            currentPage: this.state.currentPage - 1
        } );
    }

    nextHandler = () => {
        this.getValue(this.state.next);
        this.setState( {
            currentPage: this.state.currentPage + 1
        } );
    }

    getValue = (api) => {
        axios.get(api)
        .then(response => {
            console.log('response.data check');
            console.log(response.data);
            this.setState({ 
                list: response.data.results,
                pre: response.data.previous,
                next: response.data.next,
                noOfPages: Math.ceil(response.data.count/5)
            });
            this.state.list.map((singleUser) => {
                this.getDetails(singleUser.username);
            });
        })
        .catch(err =>{
            console.log(err);
        });
        
    }

    getDetails = (user) => {
        axios.get('http://127.0.0.1:8000/api/info/details/'+user)
            .then(response => {
                response.data.map( (detail,index) => {
                    var tempUser = {};
                    tempUser[user] = {
                        profilePic: detail.profilePic,
                        profile: detail.profile
                    }
                    this.setState({
                        userDetail: {
                            ...this.state.userDetail,
                            ...tempUser
                        }
                    });
                    
                });
                console.log("in getDetails");
                console.log(this.state.userDetail);
                console.log(response.data);
                console.log(user);
            })
            .catch(err =>{
                console.log(err);
            }
        ); 
    }

    render() {
        
        return(
            <div>
                <form onSubmit = {this.onSubmitHandler} action="#">
                        <input  
                            type="text"  
                            name="searchField" 
                            className = 'Search' 
                            placeholder='Search profiles'
                            value= {this.state.searchFieldValue}
                            onChange = {(event) => this.searchChangedHandler(event)}
                        />
                </form>
                <Modal flag={this.state.modalFlag} toggleState={this.toggleModalFlag} SearchField> 
                    <div className="SearchResults">
                        Search Results
                    </div>
                    {   this.state.list.map((field, index) => {
                            var image, profile;
                            image = this.state.userDetail[field.username] ?
                                this.state.userDetail[field.username].profilePic
                                : defaultProfilePicture;
                            
                            profile = this.state.userDetail[field.username] ?
                                this.state.userDetail[field.username].profile
                                : '-';
                                
                             return(
                                <div 
                                    key={index} 
                                    className = 'Tiles' 
                                    onClick = {() => {
                                        
                                        if(this.props.closeSideDrawer)
                                            this.props.closeSideDrawer();
                                        this.toggleModalFlag();
                                        this.setState({
                                            searchUser: field.username
                                        });
                                    }} 
                                >
                                    <div className = "SearchImage">
                                        <img className = "SearchImg" src={image} />
                                    </div>
                                    
                                    <div className = 'SearchUsername'>
                                        @{field.username}
                                    </div>

                                    <div className = "SearchName">
                                        {field.name}
                                    </div>
                                    
                                    <div className = 'SearchProfile'>
                                        {profile}
                                    </div>
                                    
                                </div>
                            );
                        })
                    }
                {this.state.list.length == 0? 
                    <div className = "NoSearchResult" >
                        No Search Results found
                    </div>
                    : 
                    <div className = "ButtonGroupAndPageNo">    
                        <div className = "SearchButtonGroup">    
                            <button 
                                disabled = {this.state.pre == null} 
                                onClick = {this.preHandler}
                                className = "PreNextButton"
                            >
                                Previous
                            </button>

                            <button 
                                disabled = {this.state.next == null} 
                                onClick = {this.nextHandler}
                                className = "PreNextButton"
                            >
                                Next
                            </button>
                        </div>
                        <div className = "PageNo">
                            Page {this.state.currentPage} of {this.state.noOfPages}
                        </div>
                    </div>
                }
                
                </Modal>
                {
                    this.state.searchUser?
                        <Redirect to={'/' + this.state.searchUser + "/proxyhome"} />
                        :null
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

export default connect( mapStateToProps )( SearchField );
