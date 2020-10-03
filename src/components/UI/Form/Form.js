import React, { Component } from 'react';
import Input from './Input/Input';
import './Form.css';

class Form extends Component {
    /*  Form elements are required in the following form

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
        authForm: {
            
        },
        formIsValid: false,
        loading: false
    }

    checkValidity(value, rules, touched) {
        let isValid = true;
        let errorMessage = null;
        let check;

        if(rules.required) {
            check = value.trim() !== '';
            isValid = check && isValid;
            if(!check)
                errorMessage = 'Value is required!';
        }

        if(rules.minLength) {
            check = value.length >= rules.minLength || value.length == 0;
            isValid = check && isValid;
            if(!check)
                errorMessage = 'Number of characters can not be lesser than '+rules.minLength;
        }

        if(rules.maxLength) {
            check = value.length <= rules.maxLength;
            isValid = check && isValid;
            if(!check)
                errorMessage = 'Number of characters can not be greater than '+rules.maxLength;
        }

        if(rules.passwordVerify) {
            check = this.state.authForm[rules.similarTo].value === value;
            isValid = check && isValid;
            if(!check)
                errorMessage = 'Passwords do not match';
        }

        return {
            isValid: isValid,
            errorMessage: errorMessage 
        };
    }

    inputChangedHandler = (event, inputIdentifier) => {
        const updatedAuthForm = {
            ...this.state.authForm
        };
        const updatedFormElement = {
            ...updatedAuthForm[inputIdentifier]
        };
        updatedFormElement.value = event.target.value;
        const validity = this.checkValidity( updatedFormElement.value, updatedFormElement.validation, updatedFormElement.touched);
        updatedFormElement.valid = validity.isValid;
        updatedFormElement.errorMessage = validity.errorMessage;
        updatedFormElement.touched = true;
        updatedAuthForm[inputIdentifier] = updatedFormElement;

        let formIsValid = true;
        for(let inputIdentifier in updatedAuthForm) {
            formIsValid = updatedAuthForm[inputIdentifier].valid && formIsValid;
        }

        this.setState({authForm: updatedAuthForm, formIsValid: formIsValid});
    }

    submitHandler = (event) => {
        event.preventDefault();
        console.log("Check Submit");
        this.setState( {loading: true} );
        const formData = {};
        for(let formElementIdentifier in this.state.authForm) {
            formData[formElementIdentifier] = this.state.authForm[formElementIdentifier].value;
        }
        this.props.onSubmission(formData);
    }    

    componentWillMount = () => {
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
        this.setState({
            authForm: formData
        });
    }

    componentDidMount = () => {
        this.setState({
            formIsValid: this.props.formIsValid
        });
    }

    render() {        


        const formElementsArray = [];
        for(let key in this.state.authForm) {
            formElementsArray.push({
                id: key,
                config: this.state.authForm[key]
            });
        }

        return(
            <div className = 'Border'>
                <div className = "ModifierTitle" >{this.props.title}</div>
                    <form className = "Form" onSubmit = { this.submitHandler } >
                        {formElementsArray.map(formElement => (
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

                        <div className="FormButtons">
                            <button 
                                type = 'submit' 
                                disabled = {!this.state.formIsValid}
                                className="SubmitButton ButtonLook SubmitButtonLook"
                            >
                                Submit
                            </button>
                            <button 
                                onClick = {this.props.onCancel}
                                className="CancelButton ButtonLook CancelButtonLook"
                            >
                                Cancel
                            </button>
                        </div>

                    </form>
                    {console.log(this.state)}
            </div>
        );
    }

}

export default Form;