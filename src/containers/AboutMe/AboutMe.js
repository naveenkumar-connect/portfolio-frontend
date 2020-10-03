import React, {Component} from 'react';
import Aux from '../../hoc/AuxHoc';
import './AboutMe.css';
import axios from 'axios';
import Modifier from '../Modifier/Modifier';
import { connect } from 'react-redux';
import ProfilePicture from './ProfilePicture/ProfilePicture';

import defaultProfilePicture from '../../Images/defaultProfilePicture.png';
import placeholder16 from '../../Images/placeholder16.png';
import phone16 from '../../Images/phone16.png';
import email16 from '../../Images/email16.png';
import linkedin16 from '../../Images/linkedin16.png';
import github16 from '../../Images/github16.png';

class AboutMe extends Component {
    
    state = {
        user: {
            "name": "",
            "username": "", 
        },
        details: {
                "profile": "",
                "description": "",
                "city": ""
        },
        modifier: false,
        passwordModifier: false,
        oldPasswordWrongError: false,
        displayProfilePicture: false

    }

    profilePictureToggle = () => {
        this.setState({
            displayProfilePicture: !this.state.displayProfilePicture
        });
    }

    profilePictureUpdate = () => {
        this.profilePictureToggle();
        this.getValues();
    }

    inputFormField = (config, nameOfField, elementType, type, placeholder, value, validation) => {
        config[nameOfField] = {};
        config[nameOfField]['elementType'] = elementType;
        config[nameOfField]['elementConfig'] = {};
        config[nameOfField]['elementConfig']['type'] = type;
        config[nameOfField]['elementConfig']['placeholder'] = placeholder;
        config[nameOfField]['value'] = value;
        config[nameOfField]['validation'] = validation;
    }

    editMap = (id, index) => {
        const config = {};

        this.inputFormField(config, 'name', 'input', 'text', 'Name' , this.state.user.name, {required: true} );
        this.inputFormField(config, 'profile', 'input', 'text', 'Profile' , this.state.details.profile, {required: false} );
        this.inputFormField(config, 'description', 'input', 'text', 'Description' , this.state.details.description, {required: false} );
        this.inputFormField(config, 'city', 'input', 'text', 'City' , this.state.details.city, {required: false} );
        this.inputFormField(config, 'contactNo', 'input', 'text', 'Contact Number' , this.state.details.contactNo, {required: false} );
        //this.inputFormField(config, 'email', 'input', 'email', 'Email' , this.state.user.email, {required: true} );
        this.inputFormField(config, 'linkedIn', 'input', 'text', 'Linked In' , this.state.details.linkedIn, {required: false} );
        this.inputFormField(config, 'gitHub', 'input', 'text', 'GitHUB' , this.state.details.gitHub, {required: false} );

        return config;
    }

    setModifier = (value) => {
        this.setState({
            modifier: value
        });
    }

    setPasswordModifier = (value, truthValue) => {
        this.setState({
            passwordModifier: value,
            oldPasswordWrongError: truthValue
        });
    }

    onSubmitHandler = (values) => {

        axios.patch('http://127.0.0.1:8000/api/user/profile/'+ this.props.urlUsername + '/' + this.props.urlUsername + '/',  //need to be checked
            {
                name: values.name,
                //email: values.email,
                username: this.props.urlUsername
            },
            {
                headers: {
                    'Authorization' : `token ${this.props.authToken}`
                }
            })
            .then(response => {
                console.log(response);
                this.setModifier(false);
                this.getValues();
            })
            .catch(err =>{
                console.log(err);
            });

        axios.patch('http://127.0.0.1:8000/api/info/details/'+this.props.urlUsername + '/' + this.state.details.id +'/',
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
                console.log('add');
                console.log(response);
                this.setModifier(false);
                this.getValues();
            })
            .catch(err =>{
                console.log(err);
            });

    }   
    
    onPasswordSubmitHandler = ( values ) => {
        axios.put('http://127.0.0.1:8000/api/user/passwordreset/',
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
                console.log('Response')
                console.log(response);
                this.setPasswordModifier(false, false);
            })
            .catch(err =>{
                console.log("Error");
                console.log(err.response);
                this.setPasswordModifier(false,false);
                this.setPasswordModifier(true,true);
            }
        );
    }

    getValues() {
        axios.get('http://127.0.0.1:8000/api/user/profile/'+this.props.urlUsername, {
                headers: {
                'Authorization' : `token ${this.props.token}`
                }
            })
            .then(response => {
                console.log('response in AboutMe');
                response.data.map( (user,index) => {
                    this.setState({ 
                        user: user
                    });
                });
                
            })
            .catch(err =>{
                console.log(err);
            }
            ); 

        axios.get('http://127.0.0.1:8000/api/info/details/'+this.props.urlUsername)
            .then(response => {
                console.log('response2 in AboutMe');
                response.data.map( (detail,index) => {
                    console.log("detail");
                    console.log(detail.profilePic);
                    this.setState({ 
                        details: detail
                    });
                });
                if(!this.state.details.profilePicPresent) {
                    this.setState({
                        details: {
                            ...this.state.details,
                            profilePic: defaultProfilePicture
                        }
                    });
                }
                console.log("this.state.details.profilePic");
                console.log(this.state.details.profilePic);
            })
            .catch(err =>{
                console.log(err);
            }
        ); 
    }

    componentDidMount = () => {
        this.getValues();
    }

    render(){
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
                    passwordVerify: true,
                    similarTo: 'newPassword'
                },
            }
        };

        let className = "InfoEditButton";
        if (!this.props.isAuthenticated)
            className = className+" Displayy";

        return(
            <Aux>
                { this.state.modifier ?
                        <Modifier  
                            title = 'Profile Settings'  
                            map = {this.editMap()}
                            setModifier = { (  ) => ( this.setModifier( false ) ) }
                            formIsValid
                            onSubmitHandler = { ( values ) => ( this.onSubmitHandler( values ) ) }
                        />
                        :null
                }

                { this.state.passwordModifier ?
                        <Modifier  
                            title = 'Change Password'  
                            oldPasswordWrongError = {this.state.oldPasswordWrongError}
                            map = {passwordMap}
                            setModifier = { (  ) => ( this.setPasswordModifier( false, false ) ) }
                            formIsValid = {false}
                            onSubmitHandler = { ( values ) => ( this.onPasswordSubmitHandler( values ) ) }
                        />
                        :null
                }
                <div className = "Submenu">
                    <div className='ProfilePictureBox'>
                        <img 
                            src={this.state.details.profilePic} 
                            className='ProfilePicture'
                            onClick = {this.profilePictureToggle}
                            style = { {cursor: "pointer"} }
                        />
                        <div className="UserName">@{this.state.user.username}</div>
                        {
                            this.state.displayProfilePicture?
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
                    <div className='Info'>
                        <div className='Name'>{this.state.user.name}</div>
                        <div className='Profile'>{this.state.details.profile}</div>
                        <div className='Description'>{this.state.details.description}</div>
                        {
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
                        
                        
                        {this.props.urlUsername == this.props.loggedInUser?
                            <button 
                                className = {className + ' SubmenuEditButton'}
                                onClick = { () => this.setModifier(true) }
                            >   
                            </button> 
                            :null
                        }
                        {this.props.urlUsername == this.props.loggedInUser?
                            <button 
                                className = {className + ' SubmenuChangePassword'}
                                onClick = { () => this.setPasswordModifier(true, false) }
                            >
                            </button> 
                            :null
                        }
                        
                    </div>
                </div>
                <div className='Contacts'>
                        {
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
                        
                        {
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
                        
                        {
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
                        
                        {
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

const mapStateToProps = state => {
    return {
        ...state
    };
}

export default connect(mapStateToProps)(AboutMe);
