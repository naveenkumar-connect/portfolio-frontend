/*  Creates form UI which accepts value from the user and performs validation and provides the final values
    to the parent component.
*/

import React, { Component } from 'react';
import Input from './Input/Input';
import './Form.css';
import axios from 'axios';

class Form extends Component {
    /*  Form field elements are required in the following form

            username: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Username'
                },
                value: "",
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 8
                },
                valid: false,
                touched: false,
                errorMessage: ""
            },
            isPermanent: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'True', displayValue: 'True'},
                        {value: 'False', displayValue: 'False'},
                    ],
                },
                value: 'True',
                validation: {
                    required: true
                },
                valid: true
            }
    */

    state = {
        authForm: { },          //This object is required to set validation for the form fields. Will be provided by parent component.
        formIsValid: false,     //when false, form submit will greyed out, when true for submit will be active
        loading: false,         // required for waiting spinner, spinners shows up when loading is set true
        usernameAvailabilityStatus: 'Available',    /*  Required to check username availability in data base.
                                                        It can have three values:
                                                        Available:      signifies username is available, form can be submitted if other field constraints are staisfied
                                                        NotAvailable:   signifies username is not available, form submit button is greyed out 
                                                        Wait:           signifies check is under process, form submit button is greyed out 
                                                    */
        emailAvailabilityStatus: 'Available'        /*  Required to check email availability in data base.
                                                        It can have three values:
                                                        Available:      signifies email is available, form can be submitted if other field constraints are staisfied
                                                        NotAvailable:   signifies email is not available, form submit button is greyed out 
                                                        Wait:           signifies check is under process, form submit button is greyed out 
                                                    */
    }

    checkValidity(value, rules, touched) {
        /* checks if the particular field satifies all the set constraints */

        let isValid = true;         /*  Will be true if all the constraints are satisfied by the particular field value.
                                        If the field values fails any constraint, the value will be false and <Form> submit
                                        button will be greyed out.
                                    */
        let errorMessage = null;    /*  If the field value fails any constrained the error value will be stored
                                        in errorMessage
                                    */
        let check;                  //  Required to check each constraint for the field value

        if(rules.required) {
            //checks field is empty or not

            check = value.trim() !== '';    //checks if field value is not empty
            isValid = check && isValid;     //form validation is decided on the basis of current validation check and last value of isValid
            if(!check)                      //error message is set when constraint is not satisfied
                errorMessage = 'Value is required!';
        }

        if(rules.minLength) {
            //checks field value length should be greater that or equal to the specified value

            check = value.length >= rules.minLength || value.length == 0; //checks if the field value is greater than or equal to specified value
            isValid = check && isValid;     //form validation is decided on the basis of current validation check and last value of isValid
            if(!check)                      //error message is set when constraint is not satisfied
                errorMessage = 'Number of characters can not be lesser than '+rules.minLength;
        }

        if(rules.maxLength) {
            //checks field value length should be less that or equal to the specified value

            check = value.length <= rules.maxLength;    //checks if the field value is less than or equal to specified value
            isValid = check && isValid;     //form validation is decided on the basis of current validation check and last value of isValid
            if(!check)                      //error message is set when constraint is not satisfied
                errorMessage = 'Number of characters can not be greater than '+rules.maxLength;
        }

        if(rules.passwordVerify) {
            //performs double check on new password

            check = this.state.authForm[rules.similarTo].value === value; //checks if current password field value is equal to the specified password field value
            isValid = check && isValid;     //form validation is decided on the basis of current validation check and last value of isValid
            if(!check)                      //error message is set when constraint is not satisfied
                errorMessage = 'Passwords do not match';
        }

        if(rules.shouldBeGreaterThanOrEqualTo) {
            //perform checks if current field value is greater to a specified field value

            check = new Date(value) >= new Date(this.state.authForm[rules.shouldBeGreaterThanOrEqualTo].value); // check if current field value is greater than the specified field value
            isValid = check && isValid;     //form validation is decided on the basis of current validation check and last value of isValid
            if(!check)                      //error message is set when constraint is not satisfied
                errorMessage = 'Last date cannot be before the start date';
        }

        if(rules.usernameUniqueInDatabase) {
            //checks if username is unique in database

            //disables submit button of the form while check is done
            this.setState ({
                usernameAvailabilityStatus: "Wait"
            });

            //API request to the backend to request details with the particular username
            axios.get(rules.databaseAPI + value + '/')
            .then(response => { 
                //executes when received response

                if (response.data.length === 1) {
                    /*  executes when details are received with the provided username, as only a single entry 
                        would be available per user in the database that's why we are expecting only a single 
                        value in response 
                    */

                    //specifies username is unavailable, form submit button stays disable after this
                    this.setState({
                        usernameAvailabilityStatus: "NotAvailable"
                    });
                }
                else {
                    /* executes when username is not found */

                    //specifies username is available, form submit button is enable provided all the other constraints are met
                    this.setState({
                        usernameAvailabilityStatus: "Available"
                    });
                }
            })
            .catch(err =>{
                //executes when API request fails
            });
        }

        if(rules.emailUniqueInDatabase) {
            //checks if email is unique in database

            //disables submit button of the form while check is done
            this.setState ({
                emailAvailabilityStatus: "Wait"
            });

            //API request to the backend to request details with the particular email
            axios.get(rules.databaseAPI + value + '/')
            .then(response => { 
                //executes when received response

                if (response.data.length === 1) {
                    /*  executes when details are received with the provided email, as only a single entry 
                        would be available per email in the database that's why we are expecting only a single 
                        value in response 
                    */

                    //specifies email is unavailable, form submit button stays disable after this
                    this.setState({
                        emailAvailabilityStatus: "NotAvailable"
                    });
                }
                else {
                    /* executes when username is not found */

                    //specifies email is available, form submit button is enable provided all the other constraints are met
                    this.setState({
                        emailAvailabilityStatus: "Available"
                    });
                }
            })
            .catch(err =>{
                //executes when API request fails
            });
        }

        return {
            //return form validation state and the error message if any

            isValid: isValid,
            errorMessage: errorMessage 
        };
    }

    inputChangedHandler = (event, inputIdentifier) => {
        /*  executes when any change in any of the form fields is done by the user
            event: field change event with the target element and value
            inputIdentifier: concerned field name of the form
        */

        /*  creates copy of state authform (field validation object) */
        const updatedAuthForm = {
            ...this.state.authForm
        };

        /*  extracts current field detail object */
        const updatedFormElement = {
            ...updatedAuthForm[inputIdentifier]
        };

        /*  setting current field value in updatedFormElement */
        updatedFormElement.value = event.target.value;

        /*  checking validity of the field */
        const validity = this.checkValidity( updatedFormElement.value, updatedFormElement.validation, updatedFormElement.touched);
        
        /*  setting validity value in updatedFormElement */
        updatedFormElement.valid = validity.isValid;

        /*  setting errorMessage in updatedFormElement */
        updatedFormElement.errorMessage = validity.errorMessage;

        /*  Field validation error is only shown when the value of the field is changed atleast once(signified by changing touched = true) */
        updatedFormElement.touched = true;

        /*  Copying back the current field details object to updatedAuthForm*/
        updatedAuthForm[inputIdentifier] = updatedFormElement;

        /*  formIsValid traverses through all the field's valid property and sets whether the form is okay to be submitted or not */
        let formIsValid = true;
        for(let inputIdentifier in updatedAuthForm) {
            formIsValid = updatedAuthForm[inputIdentifier].valid && formIsValid;
        }

        /*  copying back updatedAuthForm to the state so that it can be used foe next changes in the form fields */
        this.setState({authForm: updatedAuthForm, formIsValid: formIsValid});
    }

    submitHandler = (event) => {
        /*  executes when user hits the submit button */

        //avoids page reloading when user submits the form
        event.preventDefault();

        //creating an object of values of all the fields
        const formData = {};
        for(let formElementIdentifier in this.state.authForm) {
            formData[formElementIdentifier] = this.state.authForm[formElementIdentifier].value;
        }

        //submits the object of values to the parent component
        this.props.onSubmission(formData);
    }    

    componentWillMount = () => {

        //converting the validation object received from parent component to required format
        let formData = this.props.formElements;
        for (let formElement in formData) {
            if(formData[formElement].elementType == 'input') {
                formData[formElement]["valid"] = this.props.formIsValid || !formData[formElement]["validation"]["required"];
                formData[formElement]["touched"] = formData[formElement]["validation"]["required"] == false;
                formData[formElement]["errorMessage"] = "";
            }
            else if (formData[formElement].elementType == 'select') {
                formData[formElement]["valid"] = true;
            }  
        }

        //sending the validation object to the state to be used in other functions of the class
        this.setState({
            authForm: formData
        });
    }

    componentDidMount = () => {
        //setting initial validation state of the form

        this.setState({
            formIsValid: this.props.formIsValid
        });
    }

    render() {        

        //creating an array of objects (formElementsArray) containing field name and field validation properties
        const formElementsArray = [];
        for(let key in this.state.authForm) {
            formElementsArray.push({
                id: key,                            //field name
                config: this.state.authForm[key]    //field validation properties
            });
        }

        return(
            <div className = 'Border'>

                {/* form title, sent by the parent component */}
                <div className = "ModifierTitle" >{this.props.title}</div>

                    {/* executes when user provided username is not available in the database */}
                    <div className = {this.state.usernameAvailabilityStatus}>
                        Username is not available!
                    </div>

                    {/* executes when user provided email is not available in the database */}
                    <div className = {this.state.emailAvailabilityStatus}>
                        Email is already used!
                    </div>

                    <form className = "Form" onSubmit = { this.submitHandler } >
                        {/* all objects in the formElementsArray will be displayed by the UI 
                            one by one by the below map function 
                         */
                         formElementsArray.map(formElement => (
                            /*  <Input> display a particular field of the form
                                props sent to component -
                                key: name of the field
                                elementType: type of the element (like input, select etc)
                                elementConfig: subtype and placeholder
                                value: value of the field
                                invalid: tells if field is invalid or not
                                shouldValidate: tells if field is to be validated or not
                                touched: tells if field value is changed atleast once or not after the lainch of the form
                                errorMessage: tells the error if field is invalid 
                                changed: executes inputChangedHandler when the filed value is changed
                            */
                            <Input 
                                key={formElement.id}
                                elementType = {formElement.config.elementType}
                                elementConfig = {formElement.config.elementConfig}
                                value = {formElement.config.value}
                                invalid = {!formElement.config.valid}
                                shouldValidate = {formElement.config.validation}
                                touched = {formElement.config.touched}
                                errorMessage = {formElement.config.errorMessage}
                                changed = {(event) => this.inputChangedHandler(event, formElement.id)}
                            />
                        ))}

                        {/* Submit and Cancel buttons */}
                        <div className="FormButtons">

                            {/* Submit Button 
                                Will be enable when all fields constraints are satisfied
                                and the usernameAvailabilityStatus and emailAvailabilityStatus are Available 
                            */}
                            <button 
                                type = 'submit' 
                                disabled = {
                                    !this.state.formIsValid 
                                    ||  this.state.usernameAvailabilityStatus === 'Wait' 
                                    || this.state.usernameAvailabilityStatus === 'NotAvailable' 
                                    ||  this.state.emailAvailabilityStatus === 'Wait' 
                                    || this.state.emailAvailabilityStatus === 'NotAvailable' 
                                }
                                className="SubmitButton ButtonLook SubmitButtonLook"
                            >
                                Submit
                            </button>

                            {/* Cancel Button */}
                            <button 
                                onClick = {this.props.onCancel}
                                className="CancelButton ButtonLook CancelButtonLook"
                            >
                                Cancel
                            </button>
                        </div>

                    </form>
            </div>
        );
    }

}

export default Form;
