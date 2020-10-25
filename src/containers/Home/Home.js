/*
Displays home page of the user including the profile image, contacts and professional details.
*/

import React, {Component} from 'react';
import Aux from '../../hoc/AuxHoc';
import AboutMe from '../AboutMe/AboutMe';
import './Home.css';
import Card from '../Card/Card';
import { connect } from 'react-redux';
import axios from 'axios';
import CardSelector from '../CardSelector/CardSelector';
import { Redirect } from 'react-router-dom';

class Home extends Component
{   /* home component */

    state = {
      
      //default blank user details, these are however changed when data is learnt from the APIs
      user: {
          "name": "",
          "username": "", 
      },

      //default blank user details, these are however changed when data is learnt from the APIs
      details: {
              "profile": "",
              "description": "",
              "city": ""
      },

      /*default false cards status so that all the cards are not shown by default untill the user settings 
        aren't loaded from the API
      */
      cardActiveStatus: {
        experience: false,
        projects: false,
        education: false,
        skills: false,
        personalskills: false,
        languagesknown: false,
        interests: false,
        achievements: false
      },

      //when set to true launches the modal
      modalFlag: false,

      //required to keep track of user existence in database, true means user is existing in database
      checkedUserExistence: false
    }

    toggleModalFlag = () => { 
      /* toggles modal on or off */
      this.setState ({ 
        modalFlag: !this.state.modalFlag
      }); 
    }

    componentDidMount = () => {
      /* reads user login details, personal details and card settings */
      
      // token should only be given in header when it is available otherwise we will get unauthorized error
      var headers;
      if (this.props.authToken == true) 
        headers = {
          headers: {
          'Authorization' : `token ${this.props.authToken}`
          }
        }
      else 
        headers = {}

      //below api checks if user is existing in the database or not, if yes, the user details are stored in local state
      axios.get('/api/user/profile/'+ this.props.match.params.urlUsername + '/', headers)
          .then(response => {
              response.data.map( (user,index) => {
                  this.setState({ 
                      user: user,
                  });
              });

              // below code sets checkedUserExistence to true meaning is present in database
              this.setState({ 
                checkedUserExistence: true
              });
          })
          .catch(err =>{
              /* executes in case of error */
          }
          ); 
      
      //loads user details
      axios.get('/api/info/details/'+this.props.match.params.urlUsername)
          .then(response => {
              response.data.map( (detail,index) => {
                  this.setState({ 
                      details: detail
                  });
              });
          })
          .catch(err =>{
              /* executes in case of error */
          }
      ); 
      
      //loads user card settings
      axios.get('/api/info/cards/'+this.props.match.params.urlUsername)
          .then(response => {
              response.data.map( (card,index) => {
                  this.setState({ 
                    cardActiveStatus: card
                  });
              });
          })
          .catch(err =>{
              /* executes in case of error */;
          }
      ); 
    }

    cardStateSetter = (cardState) => {
      /*  receives cards acive status from the card selector form and save it in the state, so that the custom 
          user cards can be rendered on screen
      */
      this.setState({
        cardActiveStatus: cardState
      });
    }

    render(){

      //required for rendering details of the user who is searched in the URL bar
      let urlUsername = this.props.match.params.urlUsername;

      return(
         <Aux> 
                {   /*  executes when user is not present in database and redirection should only occur
                        after the API to check user existence are called.
                    */
                    this.state.checkedUserExistence && !this.state.user.name ?
                      <Redirect to='/404PageNotFound' />
                    :null
                }

                {/* Displays user profile pic, contacts and other personal details 
                    props sent to component - 
                    urlUsername: username taken from the URL bar
                    loggedInUser: username taken from the API i.e user who is logged in 

                    *Note-  the urlUsername and loggedIn User are required to restrict visitor user to change 
                            owners settings and details i.e. the changes can only be done when these two values
                            are equal.
                */}
                <AboutMe 
                  urlUsername = { urlUsername }
                  loggedInUser = { this.props.username }
                /> 

                {/* Disclaimer */}
                <div className = "Disclaimer">
                  The site is running under test purpose only. All the information and references are for dummy purpose only. 
                </div>
                
                {/* One can only change it's own card settings 
                    When user clicks strip, the modalFlag value is set to true by the toggleModalFlag
                    which in turn launches the model for card selector settings.
                */}
                {this.props.username == urlUsername ?
                  <div className = 'CardSelectorStrip' onClick = {this.toggleModalFlag}>
                    + Select your Cards
                  </div>
                  :null
                }
                
                {/* The card selector settings are lauched when state's modalFlag is set to true 
                    props sent to component -
                    inheritUrlUsername: username taken from URL bar
                    inheritId: *this.state.cardActiveStatus.id* to make changes in the database table for card settings
                                the unique id of the row for the concerned user is required. 
                                *this.state.cardActiveStatus.id* provides this value which was taken when the card settings were
                                read from the API
                    modalFlag:  sets modal on and off on which <CardSelector> is built
                    toggleModalFlag: required to close the <CardSelector>
                    states: sends the initial state of the cards
                    cardStateHandler: executes when changes are to be made to the state's cardActiveStatus
                                      so that cards can be rerendered as per the user's settings
                */}
                {this.state.modalFlag?
                  <CardSelector 
                    inheritUrlUsername = { urlUsername }
                    inheritId = {this.state.cardActiveStatus.id}
                    modalFlag = {this.state.modalFlag}
                    toggleModalFlag = {this.toggleModalFlag}
                    states = {this.state.cardActiveStatus} 
                    cardStateHandler = {(cardState) => (this.cardStateSetter(cardState))}
                  />:null
                }
                
                
                <div className="CardBox">

                  <div className='Box1'>

                    {/* Experience card is shown when the state.cardActiveStatus.experience is set true */
                     this.state.cardActiveStatus.experience?
                      <Card
                        name = 'Experience'                                 //name of the card, will be displayed with the card
                        api = {'/api/info/experience/' + urlUsername + '/'} //api from where the data of this is card is retrieved
                        urlUsername = { urlUsername }                       //user for whom this data is retrieved
                        
                        //fieldInfo is required to set field constraints in the card
                        fieldInfo = { [
                          { nameOfField: 'company', 
                            elementType: 'input', 
                            type: 'text', 
                            placeholder: 'Company',  //
                            validation: {required: true} 
                          },
                          { nameOfField: 'profile', 
                            elementType: 'input', 
                            type: 'text', 
                            placeholder: 'Profile', 
                            validation: {required: true} 
                          },
                          { nameOfField: 'startdate', 
                            elementType: 'input', 
                            type: 'date', 
                            placeholder: 'Start Date', 
                            validation: {required: true} 
                          },
                          { nameOfField: 'lastdate', 
                            elementType: 'input', 
                            type: 'date', 
                            placeholder: 'Last Date', 
                            validation: {
                              required: true,
                              shouldBeGreaterThanOrEqualTo: "startdate"   //sets constraint for lastdate, this field should always be greater or equal to startdate
                            } 
                          },
                          { nameOfField: 'city', 
                            elementType: 'input', 
                            type: 'text', 
                            placeholder: 'City', 
                            validation: {required: true} 
                          }
                        ] }
                      />:null
                    }

                    {/* Projects card is shown when the state.cardActiveStatus.projects is set true */
                     this.state.cardActiveStatus.projects?
                      <Card 
                        name = 'Projects'
                        api = {'/api/info/projects/' + urlUsername + '/'}
                        urlUsername = { urlUsername } 
                        fieldInfo = { [
                          { nameOfField: 'title', 
                            elementType: 'input', 
                            type: 'text', 
                            placeholder: 'Title', 
                            validation: {required: true} 
                          },
                          { nameOfField: 'description', 
                            elementType: 'input', 
                            type: 'text', 
                            placeholder: 'Description', 
                            validation: {required: true} 
                          }
                        ] }
                      />:null
                    }

                    {/* Education card is shown when the state.cardActiveStatus.education is set true */
                     this.state.cardActiveStatus.education?
                      <Card 
                        name = 'Education'
                        api = {'/api/info/education/' + urlUsername + '/'}
                        urlUsername = { urlUsername } 
                        fieldInfo = { [
                          { nameOfField: 'course', 
                            elementType: 'input', 
                            type: 'text', 
                            placeholder: 'Course', 
                            validation: {required: true} 
                          },
                          { nameOfField: 'institution', 
                            elementType: 'input', 
                            type: 'text', 
                            placeholder: 'Institution', 
                            validation: {required: true} 
                          },
                          { nameOfField: 'startdate', 
                            elementType: 'input', 
                            type: 'date', 
                            placeholder: 'Start Date', 
                            validation: {required: true} 
                          },
                          { nameOfField: 'lastdate', 
                            elementType: 'input', 
                            type: 'date', 
                            placeholder: 'Last Date', 
                            validation: {
                              required: true,
                              shouldBeGreaterThanOrEqualTo: "startdate"
                            } 
                          },
                          { nameOfField: 'city', 
                            elementType: 'input', 
                            type: 'text', 
                            placeholder: 'City', 
                            validation: {required: true} 
                          }
                        ] }
                      />:null
                    }  

                  </div>

                  <div className='Box2'>


                    {/* Skills card is shown when the state.cardActiveStatus.skills is set true */
                     this.state.cardActiveStatus.skills?
                      <Card 
                        name = 'Skills'
                        api = {'/api/info/skills/' + urlUsername + '/'}
                        urlUsername = { urlUsername } 
                        fieldInfo = { [
                          { nameOfField: 'skill', 
                            elementType: 'input', 
                            type: 'text', 
                            placeholder: 'Skill', 
                            validation: {required: true} 
                          },
                          { nameOfField: 'level', 
                            elementType: 'select', 
                            placeholder: 'Level',
                            options: [
                              {value: 'Beginner', displayValue: 'Beginner'},
                              {value: 'Intermediate', displayValue: 'Intermediate'},
                              {value: 'Advanced', displayValue: 'Advanced'}
                            ], 
                            validation: {required: true} 
                          }
                        ] }
                      />:null
                    }

                    {/* Personal Skills card is shown when the state.cardActiveStatus.personalskills is set true */
                     this.state.cardActiveStatus.personalskills?
                      <Card 
                        name = 'Personal Skills'
                        api = {'/api/info/personalskills/'+ urlUsername + '/'}
                        urlUsername = { urlUsername } 
                        fieldInfo = { [
                          { nameOfField: 'skill', 
                            elementType: 'input', 
                            type: 'text', 
                            placeholder: 'Personal Skill', 
                            validation: {required: true} 
                          }
                        ] }
                      />:null
                    }

                    {/* Languages Known card is shown when the state.cardActiveStatus.languagesknown is set true */
                     this.state.cardActiveStatus.languagesknown?
                      <Card 
                        name = 'Languages Known'
                        api = {'/api/info/languagesknown/' + urlUsername + '/'}
                        urlUsername = { urlUsername } 
                        fieldInfo = { [
                          { nameOfField: 'language', 
                            elementType: 'input', 
                            type: 'text', 
                            placeholder: 'Language', 
                            validation: {required: true} 
                          },
                          { nameOfField: 'readlevel', 
                            elementType: 'select', 
                            placeholder: 'Read Level',
                            options: [
                              {value: 'Beginner', displayValue: 'Beginner'},
                              {value: 'Intermediate', displayValue: 'Intermediate'},
                              {value: 'Advanced', displayValue: 'Advanced'}
                            ], 
                            validation: {required: true} 
                          },
                          { nameOfField: 'writelevel', 
                            elementType: 'select', 
                            placeholder: 'Write Level',
                            options: [
                              {value: 'Beginner', displayValue: 'Beginner'},
                              {value: 'Intermediate', displayValue: 'Intermediate'},
                              {value: 'Advanced', displayValue: 'Advanced'}
                            ], 
                            validation: {required: true} 
                          }
                        ] }
                      />:null
                    }

                    {/* Interests card is shown when the state.cardActiveStatus.interests is set true */
                     this.state.cardActiveStatus.interests?
                      <Card 
                        name = 'Interests'
                        api = {'/api/info/interests/' + urlUsername + '/'}
                        urlUsername = { urlUsername } 
                        fieldInfo = { [
                          { nameOfField: 'interest', 
                            elementType: 'input', 
                            type: 'text', 
                            placeholder: 'Interests', 
                            validation: {required: true} 
                          }
                        ] }
                      />:null
                    }

                    {/* Achievements card is shown when the state.cardActiveStatus.achievements is set true */
                     this.state.cardActiveStatus.achievements?
                      <Card 
                        name = 'Achievements'
                        api = {'/api/info/achievements/' + urlUsername + '/'}
                        urlUsername = { urlUsername } 
                        fieldInfo = { [
                          { nameOfField: 'description', 
                            elementType: 'input', 
                            type: 'text', 
                            placeholder: 'Description', 
                            validation: {required: true} 
                          },
                          { nameOfField: 'date', 
                            elementType: 'input', 
                            type: 'date', 
                            placeholder: 'Date', 
                            validation: {required: true} 
                          }
                        ] }
                      />:null
                    }
                    
                  </div>

                </div> 
         </Aux> 
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
export default connect( mapStateToProps )( Home );