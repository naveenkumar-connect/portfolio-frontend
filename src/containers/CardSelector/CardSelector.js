import React, {Component} from 'react';
import axios from 'axios';
import './CardSelector.css';
import Modal from '../../components/UI/Modal/Modal';

class CardSelector extends Component {

    state = {
        modalFlag: false,
        cardActiveStatus: {
            id: this.props.inheritId,
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
        this.setState ({ 
          modalFlag: !this.state.modalFlag
        }); 
    }

    onSubmitHandler = (event) => {
        event.preventDefault();
        axios.patch('http://127.0.0.1:8000/api/info/cards/'+this.props.inheritUrlUsername+'/'+this.props.inheritId+'/', 
            this.state.cardActiveStatus)
            .then(response => {
                console.log("Card Selector worked");
                this.props.cardStateHandler(this.state.cardActiveStatus);
                this.props.toggleModalFlag();
            })
            .catch(err =>{
                console.log(err);
            });
        
    }

    onChangeHandler = (event, card) => {
        console.log("card selector");
        console.log(event.target.checked);
        var tempCard = {};
        tempCard[card] = event.target.checked;
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
                
                <Modal flag={this.props.modalFlag} toggleState={this.props.toggleModalFlag}>   
                    <div className = "CardSelectorTitle">
                        Select your Cards
                    </div>
                    <form onSubmit = {this.onSubmitHandler} className = "CardSelectorForm">
                        <div className = "FormBox1">
                            <div className = "CardSelectedPair">
                                <label className = 'CardSelecterLabel' >Experience</label>
                                <input 
                                    type = "checkbox" 
                                    className = 'CardSelecterCheckBox'
                                    checked = {this.state.cardActiveStatus.experience} 
                                    onChange = {(event) => {this.onChangeHandler(event,'experience')}}
                                />
                            </div>

                            <div className = "CardSelectedPair">
                                <label className = 'CardSelecterLabel' >Projects</label>
                                <input 
                                    type = "checkbox" 
                                    className = 'CardSelecterCheckBox'
                                    checked = {this.state.cardActiveStatus.projects} 
                                    onChange = {(event) => {this.onChangeHandler(event,'projects')}}
                                />
                            </div>
                            
                            <div className = "CardSelectedPair">
                                <label className = 'CardSelecterLabel' >Education</label>
                                <input 
                                    type = "checkbox" 
                                    className = 'CardSelecterCheckBox'
                                    checked = {this.state.cardActiveStatus.education} 
                                    onChange = {(event) => {this.onChangeHandler(event,'education')}}
                                />
                            </div>
                        </div>

                        <div className = "FormBox2">

                            <div className = "CardSelectedPair">
                                <label className = 'CardSelecterLabel' >Skills</label>
                                <input 
                                    type = "checkbox" 
                                    className = 'CardSelecterCheckBox'
                                    checked = {this.state.cardActiveStatus.skills} 
                                    onChange = {(event) => {this.onChangeHandler(event,'skills')}}
                                />
                            </div>

                            <div className = "CardSelectedPair">
                                <label className = 'CardSelecterLabel' >Personal Skills</label>
                                <input 
                                    type = "checkbox" 
                                    className = 'CardSelecterCheckBox'
                                    checked = {this.state.cardActiveStatus.personalskills} 
                                    onChange = {(event) => {this.onChangeHandler(event,'personalskills')}}
                                />
                            </div>

                            <div className = "CardSelectedPair">
                                <label className = 'CardSelecterLabel' >Languages Known</label>
                                <input 
                                    type = "checkbox" 
                                    className = 'CardSelecterCheckBox'
                                    checked = {this.state.cardActiveStatus.languagesknown} 
                                    onChange = {(event) => {this.onChangeHandler(event,'languagesknown')}}
                                />
                            </div>

                            <div className = "CardSelectedPair">
                                <label className = 'CardSelecterLabel' >Interests</label>
                                <input 
                                    type = "checkbox" 
                                    className = 'CardSelecterCheckBox'
                                    checked = {this.state.cardActiveStatus.interests} 
                                    onChange = {(event) => {this.onChangeHandler(event,'interests')}}
                                />
                            </div>

                            <div className = "CardSelectedPair">
                                <label className = 'CardSelecterLabel' >Achievements</label>
                                <input 
                                    type = "checkbox" 
                                    className = 'CardSelecterCheckBox' 
                                    checked = {this.state.cardActiveStatus.achievements} 
                                    onChange = {(event) => {this.onChangeHandler(event,'achievements')}}
                                />
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