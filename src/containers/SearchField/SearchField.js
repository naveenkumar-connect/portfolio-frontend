/* Implements search feature on the toolbar and the sidedrawer */

import React, { Component } from 'react';
import './SearchField.css';
import Modal from '../../components/UI/Modal/Modal';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import defaultProfilePicture from '../../Images/defaultProfilePicture.png';

class SearchField extends Component {

    state = {
        list: [],               //list of the search results
        pre: null,              //api to next search result page
        next: null,             //api to previous search result page
        noOfPages: 0,           //used to keep track of total no of pages of search results, default is 0.
        currentPage: 1,         //used to keep track of current page, default is 1.
        modalFlag: false,       //required to launch and dispose Search Result dialogue box.
        searchFieldValue: '',   //string that user types in the search bar
        searchUser: '',         //hold value of the username that is selected from the search results when user clicks on a result
        userDetail: {           //required to display username, user profile pic and profile in the search results
            username:{
                profilePic: '',
                profile: ''
            }
        }
    }

    savedState = this.state; // kept for future version

    toggleModalFlag = () => { 
        //executes to dispose search result dialogue box by toggling state's modalFlag to false

        this.setState ({ 
          modalFlag: !this.state.modalFlag,
          currentPage: 1
        }); 

    }

    searchChangedHandler = (event) => {
        //executes when value of search field changes

        //updates the value of state's searchFieldValue when the value of search field changes
        this.setState({
            searchFieldValue: event.target.value
        });
    }

    onSubmitHandler = (event) => {
        //executes when user submits the search

        //prevents the page from reloading when user submits the search
        event.preventDefault();

        //clears searchUser if there was any previously value to avoid disturbence with the new searches
        this.setState({
            searchUser: ""
        });

        //disposes search results dialogue box
        this.toggleModalFlag();

        //performs API call with the search bar string and stores the values received in response in state
        this.getValue('/api/user/searchprofile/?search=' + this.state.searchFieldValue + '&page=1');
    }

    preHandler = () => {
        //executes when user hit the previous button

        //performs API call with state.pre api and stores the values received in response in state
        this.getValue(this.state.pre);

        //current page is updated
        this.setState( {
            currentPage: this.state.currentPage - 1
        } );
    }

    nextHandler = () => {
        //executes when user hit the next button

        //performs API call with state.next api and stores the values received in response in state
        this.getValue(this.state.next);

        //current page is updated
        this.setState( {
            currentPage: this.state.currentPage + 1
        } );
    }

    getValue = (api) => {
        //performs get request to the API provided to it and stores the response in the state 

        axios.get(api)
        .then(response => {
            /*  Executes when response is received and is stored in the state. The response is paginated,
                we will only receive 5 search results at a time.
            */
            
            //storing data in state received in response
            this.setState({ 
                list: response.data.results,    //the 5 search results are stored in state's list
                pre: response.data.previous,    //pre stores the api to the previous 5 search results
                next: response.data.next,       //next stores the api to the next 5 search results
                noOfPages: Math.ceil(response.data.count/5) //noOfPages stores total number of search results pages calculated by the response.data.count/5
            });

            /*  Traversing through all the values of the list array, gets all the related
                details through another API and store them in the state via getDetails().
            */  
            this.state.list.map((singleUser) => {
                this.getDetails(singleUser.username);
            });
        })
        .catch(err =>{
            /* executes when api call fails */
        });
        
    }

    getDetails = (user) => {
        /* gets all the related details of the user provided to it and save them in the state */

        axios.get('/api/info/details/'+user)
            .then(response => {
                /* executes when api call is successful */
                response.data.map( (detail,index) => {
                    
                    //creating and updating a temporary object to contain the data received in response.
                    var tempUser = {};
                    tempUser[user] = {
                        profilePic: detail.profilePic,
                        profile: detail.profile
                    }

                    //storing the temporary object in the state
                    this.setState({
                        userDetail: {
                            ...this.state.userDetail,
                            ...tempUser
                        }
                    });
                    
                });
            })
            .catch(err =>{
                /* executes when api call fails */
            }
        ); 
    }

    render() {

        return(
            <div>
                {/* Search field form */}
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

                {/* Modal creates dialogue box for search field results
                    props sent to component -
                    flag: Equals to prop's modalFlag. Launches and disposes Modal with true and false value respectively
                    toggleState: Disposes Modal by setting props.Flag to false
                    SearchField: True here. Specify Modal size to be custom set as per <SearchField> 
                */}
                <Modal flag={this.state.modalFlag} toggleState={this.toggleModalFlag} SearchField> 
                    <div className="SearchResults">
                        Search Results
                    </div>
                    {   this.state.list.map((field, index) => {
                            // traversing and displaying data on the search results 
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
                                            this.props.closeSideDrawer();   /*  required to close side drawer when the <SearchField> 
                                                                                is called from <SideDrawer> and user clicks on one of the
                                                                                search results.
                                                                            */
                                        this.toggleModalFlag();     // closes Search results modal
                                        
                                        /*  reset search bar and sets searchUser to the user clicked username
                                            to be used in redirection to home 
                                        */
                                        this.setState({
                                            searchFieldValue: "",
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
                {/* when search result are 0 prompt is given to the user for the same 
                    otherwise other buttons such as pre and next and page numbers are shown. 
                 */
                 this.state.list.length == 0? 
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
                {   //redirection is done to home page with the searcUser value
                    this.state.searchUser? 
                        <Redirect to={'/' + this.state.searchUser + "/proxyhome"} />
                        :null
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

/*  redux state subscription with connect */
export default connect( mapStateToProps )( SearchField );
