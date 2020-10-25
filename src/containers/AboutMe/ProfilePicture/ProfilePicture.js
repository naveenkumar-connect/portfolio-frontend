/* Displays profile picture dialogue box when user clicks on the profile picture at the home screen */

import React, {Component} from 'react';
import Modal from '../../../components/UI/Modal/Modal';
import axios from 'axios';
import './ProfilePicture.css';

class ProfilePicture extends Component {
    
    state = {
        profilePicture: this.props.src,     //Holds the location of the picture file that is to be displayed on the dialogue box
        profilePictureFile: null,           //Holds the picture file that user selcts with <Input type=file>. This is used to save picture in database over API.
        enableUpdateButton: false,          //Set to true when user select a picture file with <Input type=file>. When set to true this enable the update on the dialogue box.
        enableDeleteButton: this.props.profilePicPresent, /*Hold the value true or false. 
                                                            True when user has already uploaded one image and false when user has not uploaded any image.
                                                            When true, the delete button is shown, when false delete button is hidden.
                                                          */
        wannaDelete: false                  //Set to true when user hits the delete button. This launches one confirmation prompt.
    }

    profilePicHandler = (event) => {
        /*  executes when user selects new profile picture from the local system */

        event.persist();
        this.setState({
            profilePicture: window.URL.createObjectURL(event.target.files[0]), //url of the new image, require to display image on the screen
            profilePictureFile: event.target.files[0],  //Image file that is to be send over API to be stored in the database
            enableUpdateButton: true,                   //set to true, which enable update button on the prompt
            enableDeleteButton: false                   //hides delete button when user select new image
        });
    }

    deletePicHandler = () => {
        //executes when user hits the delete button

        this.setState({
            wannaDelete: true
        });
    }

    submitProfilePicture = () => {
        /* executes when user selects a new picture and and hits the update button */

        //creating formData object to sent the image file over the API
        var data = new FormData();
        data.append('profilePic', this.state.profilePictureFile);
        data.append('profilePicPresent', true);

        //API to save image in database
        axios.patch('/api/info/details/'+this.props.inheritUrlUsername+'/'+this.props.inheritId+'/', 
            data,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                }, 
            })
            .then(response => {
                //executes when image storing over api is successfull

                this.props.updatePic(); /* closes profile picture dialogue box and renders the page to load the new image */
            })
            .catch(err =>{
                //executes when the image storing to the database fails 
            });
    }

    deletePic = () => {
        //executes when user hits the delete button and confirms

        //creating formData object to inform the backend that user wants to delete the profile picture
        var data = new FormData();
        data.append('profilePicPresent', false);

        //api to the backend to remove the profile picture
        axios.patch('/api/info/details/'+this.props.inheritUrlUsername+'/'+this.props.inheritId+'/', 
            data,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                }, 
            })
            .then(response => {
                //executes when image removal was successful

                this.props.updatePic(); /* closes profile picture dialogue box and renders the page to load the new image */
            })
            .catch(err =>{
                //executes when the image removal from the database fails 
            });
    }


    render() {

        //determines the css class when user has hit the delete button to hide the file upload input, update button and the cancel button
        var switchOnDeleteHit = this.state.wannaDelete? "OnDeleteHit": null;

        //determines the css class when user has hit the delelte button to show the image delete confirmation prompt
        var processDeleteHit = this.state.wannaDelete? null: "OnDeleteHit";
        
        return(
            /* Modal creates dialogue box for profile picture updation
                props sent to component -
                flag: Equals to prop's Flag. Launches and disposes Modal with true and false value respectively
                toggleState: Disposes Modal by setting props.Flag to false
                profilePic: let know the <Modal> to set custom width for profile picture
            */
            <Modal flag={this.props.flag} toggleState={this.props.disposePic} profilePic >
                <img 
                    src = {this.state.profilePicture} 
                    width="100%"
                    className = "ProfileImage"
                />

                {/* Displays profile picture upload input, upload button and cancel button */}
                <div className = {switchOnDeleteHit}>
                    {this.props.inheritUrlUsername == this.props.inheritLoggedInUser ?
                        <div className="ProfilePicInputAndDelete">
                            <form   style= {{textAlign:"left", width:"90%", overflow: "hidden"}}>
                                
                                    <input 
                                        className = "ProfilePicInput"
                                        type="file" accept='image/*'  
                                        onChange={ (event) => (this.profilePicHandler(event)) } 
                                    />

                            </form>
                            <button 
                                disabled = {!this.state.enableDeleteButton}
                                onClick = {this.deletePicHandler}
                                className = "ProfilePicDeleteButton"
                            >                      
                            </button>
                        </div>
                        :null
                    }
                    

                    <div className="ProfilePicButtonGroup">
                        {this.props.inheritUrlUsername == this.props.inheritLoggedInUser ?
                            <button 
                                disabled= {!this.state.enableUpdateButton}
                                onClick={this.submitProfilePicture}
                                className="ProfilePicButton ProfilePicBlueButton"
                            >
                                Update
                            </button>
                            :null
                        }
                        
                        <button 
                            onClick={this.props.disposePic}
                            className="ProfilePicButton ProfilePicRedButton"
                        >
                            { 
                                this.props.inheritUrlUsername == this.props.inheritLoggedInUser ? 
                                    'Cancel': 'Close' 
                            }
                        </button>
                    </div>
                </div>

                {/* Displays profile picture delete confirmation prompt */}
                <div className = {processDeleteHit}>
                        <div className = "ConfirmDelete">
                            Confirm Delete ?
                        </div>
                        <button 
                            onClick={this.deletePic}
                            className="ProfilePicButton ProfilePicRedButton"
                        >
                            Yes
                        </button>
                        <button 
                            onClick={()=>(this.setState({ wannaDelete: false }))}
                            className="ProfilePicButton ProfilePicBlueButton"
                        >
                            No
                        </button>
                </div>
            </Modal>
        );
    }
}

export default ProfilePicture;

