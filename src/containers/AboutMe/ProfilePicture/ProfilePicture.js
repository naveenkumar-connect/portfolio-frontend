import React, {Component} from 'react';
import Modal from '../../../components/UI/Modal/Modal';
import Aux from '../../../hoc/AuxHoc';
import axios from 'axios';
import './ProfilePicture.css';

class ProfilePicture extends Component {
    
    state = {
        profilePicture: this.props.src,
        profilePictureFile: null,
        enableUpdateButton: false,
        enableDeleteButton: this.props.profilePicPresent,
        wannaDelete: false
    }

    profilePicHandler = (event) => {
        event.persist();
        this.setState({
            profilePicture: window.URL.createObjectURL(event.target.files[0]),
            profilePictureFile: event.target.files[0],
            enableUpdateButton: true,
            enableDeleteButton: true
        });
    }

    deletePicHandler = () => {
        this.setState({
            wannaDelete: true
        });
    }

    submitProfilePicture = () => {
        var data = new FormData();
        data.append('profilePic', this.state.profilePictureFile);
        data.append('profilePicPresent', true);

        axios.patch('http://127.0.0.1:8000/api/info/details/'+this.props.inheritUrlUsername+'/'+this.props.inheritId+'/', 
            data,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                }, 
            })
            .then(response => {
                this.props.updatePic();
            })
            .catch(err =>{
                console.log(err);
            });
    }

    deletePic = () => {
        var data = new FormData();
        data.append('profilePicPresent', false);

        axios.patch('http://127.0.0.1:8000/api/info/details/'+this.props.inheritUrlUsername+'/'+this.props.inheritId+'/', 
            data,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                }, 
            })
            .then(response => {
                this.props.updatePic();
            })
            .catch(err =>{
                console.log(err);
            });
    }


    render() {
        var switchOnDeleteHit = this.state.wannaDelete? "OnDeleteHit": null;
        var processDeleteHit = this.state.wannaDelete? null: "OnDeleteHit";
        console.log("ProfilePIC props");
        console.log(this.props);
        return(
            <Modal flag={this.props.flag} toggleState={this.props.disposePic} profilePic >
                <img 
                    src = {this.state.profilePicture} 
                    width="100%"
                    className = "ProfileImage"
                />

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

