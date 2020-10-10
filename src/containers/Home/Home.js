import React, {Component} from 'react';
import Aux from '../../hoc/AuxHoc';
import AboutMe from '../AboutMe/AboutMe';
import './Home.css';
import Card from '../Card/Card';
import { connect } from 'react-redux';
import axios from 'axios';
import CardSelector from '../CardSelector/CardSelector';
import { Redirect } from 'react-router-dom';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actionTypes from '../../Store/Action';


class Home extends Component
{   state = {
      user: {
          "name": "",
          "username": "", 
      },
      details: {
              "profile": "",
              "description": "",
              "city": ""
      },
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
      modalFlag: false,
      checkedUserExistence: false
    }

    toggleModalFlag = () => { 
      this.setState ({ 
        modalFlag: !this.state.modalFlag
      }); 
    }

    componentDidMount = () => {
      axios.get('/api/user/profile/'+this.props.match.params.urlUsername, {
              headers: {
              'Authorization' : `token ${this.props.token}`
              }
          })
          .then(response => {
              console.log('response in AboutMe');
              response.data.map( (user,index) => {
                  this.setState({ 
                      user: user,
                  });
              });
              this.setState({ 
                checkedUserExistence: true
              });
          })
          .catch(err =>{
              console.log(err);
          }
          ); 

      axios.get('/api/info/details/'+this.props.match.params.urlUsername)
          .then(response => {
              console.log('response2 in AboutMe');
              response.data.map( (detail,index) => {
                  this.setState({ 
                      details: detail
                  });
              });
          })
          .catch(err =>{
              console.log(err);
          }
      ); 

      axios.get('/api/info/cards/'+this.props.match.params.urlUsername)
          .then(response => {
              console.log('in Cards');
              response.data.map( (card,index) => {
                  this.setState({ 
                    cardActiveStatus: card
                  });
              });
          })
          .catch(err =>{
              console.log(err);
          }
      ); 
    }

    cardStateSetter = (cardState) => {
      this.setState({
        cardActiveStatus: cardState
      });
    }

    render(){
      

      let urlUsername = this.props.match.params.urlUsername;
      console.log("In Home");
      console.log(this.props.searchFieldUser);
      console.log(urlUsername);

      return(
         <Aux> 
                {   this.state.checkedUserExistence && !this.state.user.name ?
                      <Redirect to='/404PageNotFound' />
                    :null
                }
                <AboutMe 
                  urlUsername = { urlUsername }
                  loggedInUser = { this.props.username }
                /> 

                <div className = "Disclaimer">
                  The site is running under test purpose only. All the information and references are for dummy purpose only. 
                </div>

                {this.props.username == urlUsername ?
                  <div className = 'CardSelectorStrip' onClick = {this.toggleModalFlag}>
                    + Select your Cards
                  </div>
                  :null
                }
                

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

                    {this.state.cardActiveStatus.experience?
                      <Card
                        name = 'Experience'
                        api = {'/api/info/experience/' + urlUsername + '/'}
                        urlUsername = { urlUsername } 
                        fieldInfo = { [
                          { nameOfField: 'company', 
                            elementType: 'input', 
                            type: 'text', 
                            placeholder: 'Company', 
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

                    {this.state.cardActiveStatus.projects?
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

                    {this.state.cardActiveStatus.education?
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


                    {this.state.cardActiveStatus.skills?
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

                    {this.state.cardActiveStatus.personalskills?
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

                    {this.state.cardActiveStatus.languagesknown?
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

                    {this.state.cardActiveStatus.interests?
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

                    {this.state.cardActiveStatus.achievements?
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

const mapStateToProps = state => {
  return {
      ...state
  };
}

export default connect( mapStateToProps )( Home );