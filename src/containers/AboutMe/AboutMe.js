/* Displays user profile pic, contacts and other personal details */

import React, {Component} from 'react';
import Aux from '../../hoc/AuxHoc';
import './AboutMe.css';
import axios from 'axios';
import Modifier from '../Modifier/Modifier';
import { connect } from 'react-redux';
import * as actionTypes from '../../Store/Action';
import ProfilePicture from './ProfilePicture/ProfilePicture';
import Modal from '../../components/UI/Modal/Modal';
import { Redirect } from 'react-router-dom';

import defaultProfilePicture from '../../Images/defaultProfilePicture.png';
import placeholder16 from '../../Images/placeholder16.png';
import phone16 from '../../Images/phone16.png';
import email16 from '../../Images/email16.png';
import linkedin16 from '../../Images/linkedin16.png';
import github16 from '../../Images/github16.png';

class AboutMe extends Component {
    
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
        modifier: false,                //when set true launches edit profile settings prompt
        passwordModifier: false,        //when set true launches password reset prompt 
        oldPasswordWrongError: false,   /*required when resetting the password, if the old password is found the 
                                        value stays false and password change won't be permitted */
        displayProfilePicture: false,   /*control whether to display profile picture prompt or not.
                                        displays profile picture when set to true*/
        deleteFlag: false,              //cotrols user profile delete dialogue box, when set to true shows delete dialogue box
        deletionDone: false             //sets to true when user profile is deleted. When set to true redirects route to login page.

    }

    profilePictureToggle = () => {
        /* toggles profile picture dialogue box from off to on and vice versa */
        this.setState({
            displayProfilePicture: !this.state.displayProfilePicture
        });
    }

    profilePictureUpdate = () => {
        /*  Executes when user submits new profile picture. 
            First the profile picture dialogue box is closed by profilePictureToggle().
            Second the new profile picture is read by the API and displayed on home screen by getValues()
        */
        this.profilePictureToggle();
        this.getValues();
    }

    inputFormField = (config, nameOfField, elementType, type, placeholder, value, validation) => {
        /* assists editMap() to avoid repetitive lines of code to create validation object for profile settings */

        config[nameOfField] = {};
        config[nameOfField]['elementType'] = elementType;
        config[nameOfField]['elementConfig'] = {};
        config[nameOfField]['elementConfig']['type'] = type;
        config[nameOfField]['elementConfig']['placeholder'] = placeholder;
        config[nameOfField]['value'] = value;
        config[nameOfField]['validation'] = validation;
    }

    editMap = (id, index) => {
        /* creates object required by profile details setting dialogue box to set validation */
        
        const config = {};

        this.inputFormField(config, 'name', 'input', 'text', 'Name' , this.state.user.name, {required: true} );
        this.inputFormField(config, 'profile', 'input', 'text', 'Profile' , this.state.details.profile, {required: false} );
        this.inputFormField(config, 'description', 'input', 'text', 'Description' , this.state.details.description, {required: false} );
        this.inputFormField(config, 'city', 'input', 'text', 'City' , this.state.details.city, {required: false} );
        this.inputFormField(config, 'contactNo', 'input', 'text', 'Contact Number' , this.state.details.contactNo, {required: false} );
        this.inputFormField(config, 'linkedIn', 'input', 'text', 'Linked In' , this.state.details.linkedIn, {required: false} );
        this.inputFormField(config, 'gitHub', 'input', 'text', 'GitHUB' , this.state.details.gitHub, {required: false} );

        return config;
    }

    setModifier = (value) => {
        /*  sets state's modifier as true or false depending on the "value" 
            the modifier launches and disappers edit profile settings dialogue box
        */

        this.setState({
            modifier: value
        });
    }

    setPasswordModifier = (value, truthValue) => {
        /*  Responsible for launching and closing the change password dialogur box by setting 
            passwordModifier to true and false respectively.

            Also responsible to display wrong old password error while resetting password when the inserted old
            password is wrong by setting oldPasswordWrongError to true.
        */

        this.setState({
            passwordModifier: value,
            oldPasswordWrongError: truthValue
        });
    }

    onSubmitHandler = (values) => {
        /* executes when user make changes in profile details and submit */

        /* API to make changes in the database to django user model */
        axios.patch('/api/user/profile/'+ this.props.urlUsername + '/' + this.props.urlUsername + '/',
            {
                name: values.name,
                username: this.props.urlUsername
            },
            {
                headers: {
                    'Authorization' : `token ${this.props.authToken}`
                }
            })
            .then(response => {
                /* executes when details submission is successful at the backend */

                this.setModifier(false);    // closes the profile setting dialogue box
                this.getValues();           // is executed to get the new details from backend and have them rerendered 
            })
            .catch(err =>{
                /* executes when details submission fails at the backend */
            });

        /* API to make changes in the database to django details model of work app */
        axios.patch('/api/info/details/'+this.props.urlUsername + '/' + this.state.details.id +'/',
            {   
                profile: values.profile,
                description: values.description,
                city: values.city,
                linkedIn: values.linkedIn,
                gitHub: values.gitHub,
                contactNo: values.contactNo,
                username: this.props.urlUsername
            }
            ,
            {
                headers: {
                    'Authorization' : `token ${this.props.authToken}`
                }
            })
            .then(response => {
                /* executes when details submission is successful at the backend */

                this.setModifier(false);    // closes the profile setting dialogue box
                this.getValues();           // is executed to get the new details from backend and have them rerendered
            })
            .catch(err =>{
                /* executes when details submission fails at the backend */
            });

    }   
    
    onPasswordSubmitHandler = ( values ) => {
        /* executes when user enters old and new passwords in the password change dialogue box and submit */

        //API to reset password on the database
        axios.put('/api/user/passwordreset/',
            {   
                username: this.props.urlUsername,
                old_password: values.oldPassword,
                new_password: values.newPassword
            },
            {
                headers: {
                    'Authorization' : `token ${this.props.authToken}`
                }
            })
            .then(response => {
                /* executes when password change is successful at the backend */

                this.setPasswordModifier(false, false);     //closes password change dialogue box and also specifies old password was not incorrect 
            })
            .catch(err =>{
                /* executes when details submission fails at the backend (mostly happen due to wrong old password) */

                this.setPasswordModifier(false,false);      //closes password change dialogue box
                this.setPasswordModifier(true,true);        //reopens password change dialogue box and specifies old password was wrong
            }
        );
    }

    getValues() {
        /*  fetches user details from the database over API and make modification in the local state which
            in turn rerenders the page with new values
        */
        
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

        axios.get('/api/user/profile/'+ this.props.urlUsername + '/', headers)
            .then(response => {
                /* executes on successfull response from the django user model from the backend */

                response.data.map( (user,index) => {
                    // value is stored in local state
                    this.setState({ 
                        user: user
                    });
                });
                
            })
            .catch(err =>{
                /* executes when get request fails */
            }
            ); 

        axios.get('/api/info/details/'+this.props.urlUsername)
            .then(response => {
                /* executes on successfull response from the django detail model of work app from the backend */
                response.data.map( (detail,index) => {
                    // value is stored in local state
                    this.setState({ 
                        details: detail
                    });
                });
                if(!this.state.details.profilePicPresent) {
                    //executes when user has not uploaded any profile picture

                    /*  in this case an object of default picture will be stored in local state which will 
                        display a default picture on home page
                    */
                    this.setState({
                        details: {
                            ...this.state.details,
                            profilePic: defaultProfilePicture
                        }
                    });
                }
            })
            .catch(err =>{
                /* executes when get request fails */
            }
        ); 
    }

    componentDidMount = () => {
        //required to render values received from the APIs for the very first time
        this.getValues();
    }

    deleteProfile = () => {
        /* executes when user submits to delete the profile */

        /* API call to the database to delete the user profile */
        axios.delete('/api/user/profile/' + this.props.loggedInUser + '/' + this.props.loggedInUser + '/',
            {
                headers: {
                    'Authorization' : `token ${this.props.authToken}`
                }
            })
            .then(response => {
                this.props.onLogout();  //redux action dispatch, deletes user authentication details from redux state
                this.setState({
                    deletionDone: true, //will be responsible for redirection of route to login page.
                    deleteFlag: false   //hides delete dialogue box
                });
            })
            .catch(err =>{
                /* executes when delete request fails */
            }
        );
    }

    render(){

        /* creates object required by password reset dialogue box to set validation */
        const passwordMap = {
            oldPassword: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Old Password'
                },
                value: "",
                validation: {
                    required: true,
                },
            },
            newPassword: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'New Password'
                },
                value: "",
                validation: {
                    required: true,
                    minLength: 8
                },
            },
            newPassword2: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Re-enter new Password'
                },
                value: "",
                validation: {
                    required: true,
                    passwordVerify: true,           // sets this field to be used as verification of another field
                    similarTo: 'newPassword'        // name of the field to which this current field needs to be similar to
                },
            }
        };

        return(
            <Aux>
                {   /* When modifier is set to true, below mentioned code executes the profile settings dialogue box */
                    this.state.modifier ?
                        /*  <Modifier> executes profile settings dialogue box here
                            props sent to component - 
                            title: Title of the profile setting dialogue box 
                            map: object for field validation of profile seting dialogue box form
                            setModifier: used to close the profile setting dialogue box
                            formIsValid: required to set initial validation state of the profile setting dialogue box form, valid initially
                            onSubmitHandler: executes to update details over API when user hit submit 
                        */
                        <Modifier  
                            title = 'Profile Settings'  
                            map = {this.editMap()}
                            setModifier = { (  ) => ( this.setModifier( false ) ) }
                            formIsValid     // by default this is true
                            onSubmitHandler = { ( values ) => ( this.onSubmitHandler( values ) ) }
                        />
                        :null
                }

                {   /* When passwordModifier is set to true, below mentioned code executes the reset password dialogue box */
                    this.state.passwordModifier ?
                        /*  <Modifier> executes reset password dialogue box here
                            props sent to component - 
                            title: Title of the reset password dialogue box 
                            oldPasswordWrongError: tells dialogue box that the last reset was failed due to wrong old password
                            map: object for field validation of reset password dialogue box form
                            setModifier: used to close the profile setting dialogue box
                            formIsValid: required to set initial validation state of the profile setting dialogue box form, invalid initially
                            onSubmitHandler: executes to reset password over API when user hit submit
                        */
                        <Modifier  
                            title = 'Change Password'  
                            oldPasswordWrongError = {this.state.oldPasswordWrongError}
                            map = {passwordMap}
                            setModifier = { (  ) => ( this.setPasswordModifier( false, false ) ) }
                            formIsValid = {false}   // form will be invalid initially
                            onSubmitHandler = { ( values ) => ( this.onPasswordSubmitHandler( values ) ) }
                        />
                        :null
                }

                {/* Modal creates dialogue box for profile deletion 
                    props sent to component -
                    flag: Equals to state's deleteFlag. Launches and disposes Modal with true and false value respectively
                    toggleDeleteState: Disposes Modal by setting deleteFlag to false
                */}
                <Modal flag={this.state.deleteFlag} toggleDeleteState = {() =>{this.setState({deleteFlag: !this.state.deleteFlag})}}>
                    <div className = "DeletePromptTitle">
                        Confirm Delete ?
                    </div>
                    <div className = "DeletePromptDescription">
                        Pressing the below <b>Confirm Delete</b> button will delete all your records and will not be recoverable.
                        Kindly confirm if you still want to proceed with the deletion.
                    </div>

                    <div className = "DeletePromptButtonGroup">
                        {/* Delete button, performs deletion of the profile by delete API to the backend via deleteProfile. 
                            deleteProfile also sets deletionDone to true which is required for redirection to login page.
                        */}
                        <button 
                            onClick = {this.deleteProfile}
                            className="DeletePromptButton DeletePromptRedButton"
                        >
                            Confirm Delete
                        </button>

                        {/* Cancel button, sets deleteFlag to false to dispose delete profile prompt */}
                        <button 
                                onClick = {() =>{this.setState({deleteFlag: !this.state.deleteFlag})}}
                                className="DeletePromptButton DeletePromptBlueButton"
                        >
                            Cancel
                        </button>
                    </div>
                </Modal>


                {   /* redirect route to login page when deletionDone is set to true */
                    this.state.deletionDone?
                        <Redirect to='/login' />
                    :null
                }

                {/* This div renders User's personal details such as profile picture, name, username, profile etc */}
                <div className = "Submenu">
                    { /* disclaimer is shown when user is visiting other's profile */
                      this.props.urlUsername != this.props.loggedInUser?
                        <div className = "VisitorProfile">
                            Viewing this profile as a visitor
                        </div>
                        :null
                    }
                    
                    <div className='ProfilePictureBox'>
                        {/* Profile pic on the home page.
                            DisplayProfilePicture is set to true by profilePictureToggle when user 
                            clicks on the picture.
                        */}
                        <img 
                            src={this.state.details.profilePic} 
                            className='ProfilePicture'
                            onClick = {this.profilePictureToggle}
                            style = { {cursor: "pointer"} }
                        />
                        {   /*  Try showing user name only when it is available in local state. 
                                This is to avoid special character being printed without the username.
                            */
                            this.state.user.username?
                                <div className="UserName">@{this.state.user.username}</div>
                                :null
                        }
                        {   /*  Profile picture dialogue box is displayed when displayProfilePicture is set true.
                                displayProfilePicture is set True when user clicks on the profile picture.
                            */
                            this.state.displayProfilePicture?
                                /*  Displays profile picture dialogue box.
                                    props sent to component -
                                    src: url of the profile pic stored in state from the API
                                    flag:   Same to displayProfilePicture, launches and disposes profile picture prompt
                                            with values true and false respectively.
                                    disposePic:     Launches proflePictureToggle when user hits cancel which toggles flag to false to close profile
                                                    pic prompt.
                                    inheritUrlUsername: provides username from the URL to <ProfilePicture>
                                    inheritLoggedInUser: provides logged in username to <ProfilePicture>
                                    inheritId: Row id from the database, required to make changes to the same row via API.
                                    updatePic: Same to profilePictureUpdate. It closes profile picture prompt after user updates new picture and rerenders the page
                                    profilePicPresent:  It is read from detail model over the API from the backend.
                                                        If it's value is true it means profile image is stored in data base
                                                        and the image can be displayed on screen.
                                                        If it's value is false then the profile image is not uploaded by the user
                                                        hence, a default picture will be shown on screen.
                                */
                                <ProfilePicture
                                    src={this.state.details.profilePic} 
                                    flag = {this.state.displayProfilePicture}
                                    disposePic = {this.profilePictureToggle}
                                    inheritUrlUsername = {this.props.urlUsername}
                                    inheritLoggedInUser = {this.props.loggedInUser}
                                    inheritId = {this.state.details.id}
                                    updatePic = {this.profilePictureUpdate}
                                    profilePicPresent = {this.state.details.profilePicPresent}
                                />
                            :
                            null
                        }
                    </div>

                    {/* This Displays User's personal details */}
                    <div className='Info'>
                        <div className='Name'>{this.state.user.name}</div>
                        <div className='Profile'>{this.state.details.profile}</div>
                        <div className='Description'>{this.state.details.description}</div>
                        {   /*  when city value is available in state then it will be displayed with the location icon 
                                other wise even location icon will be missing as well
                            */
                            this.state.details.city ?
                            <div className='City'>
                                <div className = "SubCity" >{this.state.details.city}</div>
                                <img 
                                    src= {placeholder16}
                                    className='ImageIcon'
                                />
                            </div>
                            :
                            null
                        }
                        
                        
                        {//delete button is visible only when logged in user is the owner of the profile
                         this.props.urlUsername == this.props.loggedInUser?
                            <button 
                                className = {"InfoEditButton" + ' SubmenuDeleteProfile'}
                                onClick = {() =>{this.setState({deleteFlag: !this.state.deleteFlag})}}
                            >
                            
                            </button>
                            :null
                        } 

                        {//edit button is visible only when logged in user is the owner of the profile
                         this.props.urlUsername == this.props.loggedInUser?
                            <button 
                                className = {"InfoEditButton" + ' SubmenuEditButton'}
                                onClick = { () => this.setModifier(true) }
                            >   
                            </button> 
                            :null
                        }

                        {//change password button is visible only when logged in user is the owner of the profile
                         this.props.urlUsername == this.props.loggedInUser?
                            <button 
                                className = {"InfoEditButton" + ' SubmenuChangePassword'}
                                onClick = { () => this.setPasswordModifier(true, false) }
                            >
                            </button> 
                            :null
                        }
                          
                        
                        
                    </div>
                </div>

                {/* This div renders User's contact details */}
                <div className='Contacts'>
                        {   /*  when contactNo value is available in state then it will be displayed with the icon 
                                other wise even the icon will be missing as well
                            */
                            this.state.details.contactNo ?
                                <div className = "Test">
                                    <img 
                                        src= {phone16}
                                        className='ImageIcon'
                                    />
                                    <div className = "SubContact" >{this.state.details.contactNo}</div>
                                </div>
                                :
                                null
                        }
                        
                        {   /*  when email value is available in state then it will be displayed with the icon 
                                other wise even the icon will be missing as well
                            */
                            this.state.user.email?
                                <div className = "Test">
                                    <img 
                                        src={email16}
                                        className='ImageIcon'
                                    />
                                    <div className = "SubContact" >{this.state.user.email}</div>
                                </div>
                                :
                                null
                        }
                        
                        {   /*  when linkedIn value is available in state then it will be displayed with the icon 
                                other wise even the icon will be missing as well
                            */
                            this.state.details.linkedIn?
                                <div className = "Test">
                                    <img 
                                        src={linkedin16} 
                                        className='ImageIcon'
                                    />
                                    <div className = "SubContact" >{this.state.details.linkedIn}</div>
                                </div>
                                :
                                null
                        }
                        
                        {   /*  when gitHub value is available in state then it will be displayed with the icon 
                                other wise even the icon will be missing as well
                            */
                            this.state.details.gitHub?
                                <div className = "Test">
                                    <img 
                                        src={github16}
                                        className='ImageIcon'
                                    />
                                    <div className = "SubContact" >{this.state.details.gitHub}</div>
                                </div>
                                :
                                null
                        }
                        
                        
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

/* redux action dispatch */
const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch( { type: actionTypes.LOGOUT } )
    };
}

/*  redux state subscription with connect */
export default connect( mapStateToProps, mapDispatchToProps )(AboutMe);
