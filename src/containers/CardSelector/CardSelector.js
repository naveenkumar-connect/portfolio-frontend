/* Implements card selection feature on the home page */

import React, {Component} from 'react';
import axios from 'axios';
import './CardSelector.css';
import Modal from '../../components/UI/Modal/Modal';

class CardSelector extends Component {

    state = {
        modalFlag: false,   //required to manage card selector dialogue box, lauches dialogue box when true, dispose dialogue box when false
        cardActiveStatus: {     //hold status of all the cards
            id: this.props.inheritId, //row id in the database
            experience: this.props.states.experience,
            projects: this.props.states.projects,
            education: this.props.states.education,
            skills: this.props.states.skills,
            personalskills: this.props.states.personalskills,
            languagesknown: this.props.states.languagesknown,
            interests: this.props.states.interests,
            achievements: this.props.states.achievements
        }
    }

    toggleModalFlag = () => { 
        /* toggles state of modalFlag to open and close <CardSelector> */

        this.setState ({ 
          modalFlag: !this.state.modalFlag
        }); 
    }

    onSubmitHandler = (event) => {
        /* Executes when user hits the submit button */

        //prevents reloading of the page when user submits the form
        event.preventDefault();

        //API stores updated card status in the databases
        axios.patch('/api/info/cards/'+this.props.inheritUrlUsername+'/'+this.props.inheritId+'/', 
            this.state.cardActiveStatus)
            .then(response => {
                //when API works successfuly
                
                //updated value of the card status given back to parent component to rerender the cards
                this.props.cardStateHandler(this.state.cardActiveStatus);

                //toggles ModalFlag to close the <CardSelector>
                this.props.toggleModalFlag();
            })
            .catch(err =>{
                //executes when API fails
            });
        
    }

    onChangeHandler = (event, card) => {
        //executes when value of checkbox of a particular card changes

        // object stores value of card whose value is just changed
        var tempCard = {};
        tempCard[card] = event.target.checked;

        // updates state as per the new values of card check boxes
        this.setState({
            cardActiveStatus: {
                ...this.state.cardActiveStatus,
                ...tempCard
            }
        });
    }

    render() {
        console.log("In Card Selector render()");
        return (
            <div>
                {/* Modal creates dialogue box for profile picture updation
                    props sent to component -
                    flag: Equals to prop's modalFlag. Launches and disposes Modal with true and false value respectively
                    toggleState: Disposes Modal by setting props.Flag to false
                */}
                <Modal flag={this.props.modalFlag} toggleState={this.props.toggleModalFlag}>   
                    <div className = "CardSelectorTitle">
                        Select your Cards
                    </div>

                    <form onSubmit = {this.onSubmitHandler} className = "CardSelectorForm">
                        <div className = "FormBox1">
                            <div className = "CardSelectedPair">
                                <input 
                                    type = "checkbox" 
                                    className = 'CardSelecterCheckBox'
                                    checked = {this.state.cardActiveStatus.experience} 
                                    onChange = {(event) => {this.onChangeHandler(event,'experience')}}
                                />
                                <label className = 'CardSelecterLabel' >Experience</label>
                            </div>

                            <div className = "CardSelectedPair">
                                <input 
                                    type = "checkbox" 
                                    className = 'CardSelecterCheckBox'
                                    checked = {this.state.cardActiveStatus.projects} 
                                    onChange = {(event) => {this.onChangeHandler(event,'projects')}}
                                />
                                <label className = 'CardSelecterLabel' >Projects</label>
                            </div>
                            
                            <div className = "CardSelectedPair">
                                <input 
                                    type = "checkbox" 
                                    className = 'CardSelecterCheckBox'
                                    checked = {this.state.cardActiveStatus.education} 
                                    onChange = {(event) => {this.onChangeHandler(event,'education')}}
                                />
                                <label className = 'CardSelecterLabel' >Education</label>
                            </div>
                        </div>

                        <div className = "FormBox2">

                            <div className = "CardSelectedPair">
                                <input 
                                    type = "checkbox" 
                                    className = 'CardSelecterCheckBox'
                                    checked = {this.state.cardActiveStatus.skills} 
                                    onChange = {(event) => {this.onChangeHandler(event,'skills')}}
                                />
                                <label className = 'CardSelecterLabel' >Skills</label>
                            </div>

                            <div className = "CardSelectedPair">
                                <input 
                                    type = "checkbox" 
                                    className = 'CardSelecterCheckBox'
                                    checked = {this.state.cardActiveStatus.personalskills} 
                                    onChange = {(event) => {this.onChangeHandler(event,'personalskills')}}
                                />
                                <label className = 'CardSelecterLabel' >Personal Skills</label>
                            </div>

                            <div className = "CardSelectedPair">
                                <input 
                                    type = "checkbox" 
                                    className = 'CardSelecterCheckBox'
                                    checked = {this.state.cardActiveStatus.languagesknown} 
                                    onChange = {(event) => {this.onChangeHandler(event,'languagesknown')}}
                                />
                                <label className = 'CardSelecterLabel' >Languages Known</label>
                            </div>

                            <div className = "CardSelectedPair">
                                <input 
                                    type = "checkbox" 
                                    className = 'CardSelecterCheckBox'
                                    checked = {this.state.cardActiveStatus.interests} 
                                    onChange = {(event) => {this.onChangeHandler(event,'interests')}}
                                />
                                <label className = 'CardSelecterLabel' >Interests</label>
                            </div>

                            <div className = "CardSelectedPair">
                                <input 
                                    type = "checkbox" 
                                    className = 'CardSelecterCheckBox' 
                                    checked = {this.state.cardActiveStatus.achievements} 
                                    onChange = {(event) => {this.onChangeHandler(event,'achievements')}}
                                />
                                <label className = 'CardSelecterLabel' >Achievements</label>
                            </div>
                        </div>
                        <div className = "CardSelectorButtonGroup">
                            <button 
                                className = "CardSelectorButton CardSelectorBlueButton" 
                                type = "submit"
                            >
                                Save
                            </button>

                            <button 
                                className = "CardSelectorButton CardSelectorRedButton"
                                onClick = {this.props.toggleModalFlag}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>

            
        );
    }
}

export default CardSelector;