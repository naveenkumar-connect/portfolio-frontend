/* Provides UI for addition, updation and deletion of database values over API */

import React, { Component } from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Form from '../../components/UI/Form/Form';
import './Modifier.css';

class Edit extends Component {

    state = {
        modalFlag: true     //required to launch and dispose modal prompt
    }
    
    toggleModalFlag = () => { 
        //closes the model by setting the modalFlag false

        this.setState ({ 
          modalFlag: !this.state.modalFlag
        }); 
        
        this.props.setModifier(); // closes <Modifier>
    }

    render() {

        /*  title is used to display title of the Modifier prompt. When modifier is used to change password
            the value of oldPasswordWrongError displays whether the old password is wrong or not.
        */
        let title;
        if(this.props.oldPasswordWrongError)
            title = this.props.title + ' - Old Password is wrong';
        else 
            title = this.props.title;
        
        let isDelete = this.props.title === 'delete';   // value will be true when modifier is used for deletion purpose
        
        return(
            <div>
                {/* Modal creates dialogue box for profile addition, updation and deletion 
                    props sent to component -
                    flag: Equals to state's modalFlag. Launches and disposes Modal with true and false value respectively
                    toggleState: Disposes Modal by setting modalFlag to false
                    smallSize: will be true when <Modifier> is used for deletion which sets smaller size of the modal
                */}
                <Modal flag={this.state.modalFlag} toggleState={this.toggleModalFlag} smallSize = {isDelete}>   
                    { /* when <Modifier> is used for addition and updation details <Form> is used to get values
                         from the user.    
                      */  
                      this.props.title !== 'delete'?
                        <div className = "ModifierForm">

                            {/* Gets values from the User 
                                props sent to component -
                                title: displays title on <Form> dialogue box
                                formElements: this object sets validation for the form fields
                                formIsValid: required to set initial validation state of the profile setting dialogue box form, initially true for updation while false for addition
                                onSubmission: executes when user hits submit button
                                onCancel: closes <Form> and <Modifier> when user hits cancel on the <Form>
                                oldPasswordWrongError: Is true when old password was wrong. Conveys same to <Form>
                            */}
                            <Form 
                            title = {title}
                            formElements = {this.props.map}
                            formIsValid = {this.props.formIsValid}
                            onSubmission = {(values) => {this.props.onSubmitHandler(values)}}
                            onCancel = {this.toggleModalFlag}
                            oldPasswordWrongError = {this.props.oldPasswordWrongError}
                            />
                        </div>
                        :
                        <div className='Delete'>
                            {/* Executes when modifier is required for deletion */}

                            <div className = 'Confirm'>Are you Sure?</div>
                            <button 
                                onClick = {this.props.onSubmitHandler}
                                className = "DeleteButtonLook DeleteSubmitButtonLook"
                            >
                                Delete
                            </button> 
                            
                            <button 
                                onClick = {this.toggleModalFlag}
                                className = "DeleteButtonLook DeleteCancelButtonLook"
                            >
                                Cancel
                            </button> 
                                    
                        </div>
                    }
                </Modal>
            </div>
        );
    }
}

export default Edit;