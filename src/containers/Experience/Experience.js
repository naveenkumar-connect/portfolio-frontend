import axios from 'axios';
import React, {Component} from 'react';
import Aux from '../../hoc/AuxHoc';
import { connect } from 'react-redux';
import Modifier from '../Modifier/Modifier';

class Experience extends Component {
    
    state = {
        experience: [
          {
            "company": "",
            "profile": "",
            "startdate": "",
            "lastdate": "",
            "city": ""
          }
        ],
        modifier: null,
        editReq: {
            id: '',
            index: ''
        }
    }

    formField = (config, formFieldName, elementType, type, placeholder, value, required) => {

        config[formFieldName] = {};
        config[formFieldName]['elementType'] = elementType;
        config[formFieldName]['elementConfig'] = {};
        config[formFieldName]['elementConfig']['type'] = type;
        config[formFieldName]['elementConfig']['placeholder'] = placeholder;
        config[formFieldName]['value'] = value;
        config[formFieldName]['validation'] = {};
        config[formFieldName]['validation']['required'] = required;

    }

    editMap = (id, index) => {

        const config = {};

        this.formField(config, 'company', 'input', 'text', 'Company' , this.state.experience[index].company, true);
        this.formField(config, 'profile', 'input', 'text', 'Profile' , this.state.experience[index].profile, true);
        this.formField(config, 'startdate', 'input', 'date', 'Start Date' , this.state.experience[index].startdate, true);
        this.formField(config, 'lastdate', 'input', 'date', 'Last Date' , this.state.experience[index].lastdate, true);
        this.formField(config, 'city', 'input', 'text', 'City' , this.state.experience[index].city, true);

        return config;
    }

    addMap = () => {
        
        const config = {};

        this.formField(config, 'company', 'input', 'text', 'Company' , '', true);
        this.formField(config, 'profile', 'input', 'text', 'Profile' , '', true);
        this.formField(config, 'startdate', 'input', 'date', 'Start Date' , '', true);
        this.formField(config, 'lastdate', 'input', 'date', 'Last Date' , '', true);
        this.formField(config, 'city', 'input', 'text', 'City' , '', true);

        return config;
    }

    setModifier = (action, id, index) => {
        this.setState({
            modifier: action
        });

        if(id) {
            this.setState({
                editReq: {
                     id: id,
                    index: index
                }
            });
        }
    }

    onSubmitHandler = (values) => {
        switch(this.state.modifier){
            case 'add': axios.post('http://127.0.0.1:8000/api/info/experience/'+'naveen/',
                        {
                            ...values,
                            username: 'naveen'
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
                            this.setModifier(null);
                            this.getValues();
                        })
                        .catch(err =>{
                            console.log(err);
                        });
                        break;
            case 'edit':    axios.patch('http://127.0.0.1:8000/api/info/experience/'+'naveen/'+this.state.editReq.id+'/',
                            {
                                ...values,
                                username: 'naveen'
                            }
                                ,
                            {
                                headers: {
                                    'Authorization' : `token ${this.props.authToken}`
                                }
                            })
                            .then(response => {
                                console.log('edit');
                                console.log(response);
                                this.setModifier(null);
                                this.getValues();
                            })
                            .catch(err =>{
                                console.log(err);
                            });
                            break;
            case 'delete':  axios.delete('http://127.0.0.1:8000/api/info/experience/'+'naveen/'+this.state.editReq.id+'/',
                            {
                                headers: {
                                    'Authorization' : `token ${this.props.authToken}`
                                }
                            })
                            .then(response => {
                                console.log('delete');
                                console.log(response);
                                this.setModifier(null);
                                this.getValues();
                            })
                            .catch(err =>{
                                console.log(err);
                            });
           
        }

    }

    getValues() {
        axios.get('http://127.0.0.1:8000/api/info/experience/'+'naveen')
        .then(response => {
            this.setState({ 
                experience: response.data
            });
        })
        .catch(err =>{
            console.log(err);
        });
    }

    componentDidMount() {
        this.getValues();
    }


    
    render(){
        let map, title, formIsValid;
        if(this.state.modifier == 'add'){
            map = this.addMap();
            title = 'ADD NEW ENTRY';
            formIsValid = false;
        }    
        else if (this.state.modifier == 'edit'){
            map = this.editMap(this.state.editReq.id, this.state.editReq.index);
            title = 'EDIT ENTRY';
            formIsValid = true;
        }
        else if (this.state.modifier == 'delete'){
            map = 'delete';
        }
    
        return(
            <Aux>
                
                <div className='item experience top'>
                    EXPERIENCE
                    { this.state.modifier !== null
                        ?
                        <Modifier  
                            title = { title }  
                            map = {map}
                            setModifier = { (  ) => ( this.setModifier( null ) ) }
                            formIsValid = {formIsValid}
                            onSubmitHandler = { ( values ) => ( this.onSubmitHandler( values ) ) }
                        />
                        :null
                    }
                    <button 
                        onClick = { () => { this.setModifier('add') } }>
                        Add
                    </button>
                    {
                        this.state.experience.map((experience, index) => {
                            return (
                                <div key={index} className = 'Card'>
                                    <br />
                                    {experience.company}
                                    <br />
                                    {experience.profile}
                                    <br />
                                    {experience.startdate} - {experience.lastdate}
                                    <br />
                                    {experience.city}
                                    <br />
                                    <button onClick = { () => { this.setModifier('edit', experience.id, index) } }>Edit {experience.id}</button> 
                                    <br />
                                    <br />
                                    <button onClick = { () => { this.setModifier('delete', experience.id, index) } }>Delete {experience.id}</button> 
                                </div>
                            )
                        })
                    }
                </div>
            </Aux>
        );
        
    } 
}

const mapStateToProps = state => {
    return {
        token: state.token
    };
}

export default connect(mapStateToProps)(Experience);