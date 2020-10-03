import React, { Component } from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Form from '../../components/UI/Form/Form';
import './Modifier.css';

class Edit extends Component {
    state = {
        modalFlag: true
    }
    
    toggleModalFlag = () => { 
        
        this.setState ({ 
          modalFlag: !this.state.modalFlag
        }); 
        
        this.props.setModifier();
    }

    render() {
        let title;
        if(this.props.oldPasswordWrongError)
            title = this.props.title + ' - Old Password is wrong';
        else 
            title = this.props.title;
        
        let isDelete = this.props.title === 'delete';
        console.log("Title");
        console.log(isDelete);
        
        return(
            <div>
                <Modal flag={this.state.modalFlag} toggleState={this.toggleModalFlag} smallSize = {isDelete}>   
                    {   this.props.title !== 'delete'?
                        <div className = "ModifierForm">
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