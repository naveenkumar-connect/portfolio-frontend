/*
Display cards such as Experience, education etc on the home page.

props required:

name: name of the card
api: url of the data resource
fieldInfo: contains all the display fields and the constraints
 [ [nameOfField, elementType, type, placeholder, validation], .. ]
*/

import axios from 'axios';
import React, {Component} from 'react';
import Aux from '../../hoc/AuxHoc';
import { connect } from 'react-redux';
import Modifier from '../Modifier/Modifier';
import './Card.css';


class Card extends Component {
    
    state = {
        fields: [],         // will be needed to store list of objects from API response
        modifier: null,     // sets the purpose the modifier is required for (add, edit or delete)
        editReq: {          // keep track of the entry to be edited or deleted by this card
            id: '',         // row id of the entry in the database
            index: ''       // index of the entry in state's fields
        }
    }

    inputFormField = (config, nameOfField, elementType, type, placeholder, value, validation) => {
        //saves repetition code for <input> in editMap and addMap

        config[nameOfField] = {};
        config[nameOfField]['elementType'] = elementType;
        config[nameOfField]['elementConfig'] = {};
        config[nameOfField]['elementConfig']['type'] = type;
        config[nameOfField]['elementConfig']['placeholder'] = placeholder;
        config[nameOfField]['value'] = value;
        config[nameOfField]['validation'] = validation;
    }

    selectFormField = (config, nameOfField, elementType, placeholder, options, value, validation) => {
        //saves repetition code for <select> in editMap and addMap

        config[nameOfField] = {};
        config[nameOfField]['elementType'] = elementType;
        config[nameOfField]['elementConfig'] = {};
        config[nameOfField]['elementConfig']['placeholder'] = placeholder;
        config[nameOfField]['elementConfig']['options'] = options;
        config[nameOfField]['value'] = value;
        config[nameOfField]['validation'] = validation;
    } 

    editMap = (id, index) => {
        /*  Creates validation object for the form for editing in required format from the raw data 
            received from parent component.
        */

        const config = {};
        this.props.fieldInfo.map( (field) => {
            if(field.elementType == 'input')
                this.inputFormField(config, field.nameOfField, field.elementType, field.type, field.placeholder , this.state.fields[index][field.nameOfField], field.validation);
            else if(field.elementType == 'select')
                this.selectFormField(config, field.nameOfField, field.elementType, field.placeholder ,field.options, this.state.fields[index][field.nameOfField], field.validation);
        } ); 
        return config;
    }

    addMap = () => {
        /*  Creates validation object for the form for addition in required format from the raw data 
            received from parent component.
        */

        const config = {};
        this.props.fieldInfo.map( (field) => {
            if(field.elementType == 'input')
                this.inputFormField(config, field.nameOfField, field.elementType, field.type, field.placeholder , '', field.validation);
            else if(field.elementType == 'select')
                this.selectFormField(config, field.nameOfField, field.elementType, field.placeholder ,field.options, field.options[0]['value'], field.validation);
        } ); 
        return config;
    }

    setModifier = (action, id, index) => {
        /*  sets action to be taken by the modifier in the lcal state, if editing or addition is to be done then 
            editReq.id and editReq.index are also set in state to perform editing or addition to the database 
        */

        this.setState({
            modifier: action
        });

        if(id) {
            this.setState({
                editReq: {
                     id: id,        // id is the row id in the database for the concerned entry
                    index: index    // index is the index of the entry in state's field
                }
            });
        }
    }

    onSubmitHandler = (values) => {
        //perform updation on the database over APIs with the "values" given to onSubmitHandler

        switch(this.state.modifier){
            
            /*  performs addition of new entry over the api provided by props.api with "values" provided 
                to onSubmitHandler
            */
            case 'add': axios.post(this.props.api,
                        {
                            ...values,
                            username: this.props.urlUsername
                        }
                        ,
                        {
                            headers: {
                                'Authorization' : `token ${this.props.authToken}`
                            }
                        })
                        .then(response => {
                            //executes when addition was successful at the backend

                            this.setModifier(null); //clearing modifier actions to avoid interruption with next actions
                            this.getValues();       //reloads card data from the api and rerenders the UI
                        })
                        .catch(err =>{
                            //executes when addition at the backend fails
                        });
                        break;

            /*  performs updation of an existing entry over the api provided by props.api with "values" provided 
                to onSubmitHandler
            */
            case 'edit':    axios.patch(this.props.api+this.state.editReq.id+'/',
                            {
                                ...values,
                                username: this.props.urlUsername
                            }
                                ,
                            {
                                headers: {
                                    'Authorization' : `token ${this.props.authToken}`
                                }
                            })
                            .then(response => {
                                this.setModifier(null); //clearing modifier actions to avoid interruption with next actions
                                this.getValues();       //reloads card data from the api and rerenders the UI
                            })
                            .catch(err =>{
                                //executes when updation at the backend fails
                            });
                            break;

            /*  performs deletion of an existing entry over the api provided by props.api 
            */
            case 'delete':  axios.delete(this.props.api+this.state.editReq.id+'/',
                            {
                                headers: {
                                    'Authorization' : `token ${this.props.authToken}`
                                }
                            })
                            .then(response => {
                                this.setModifier(null); //clearing modifier actions to avoid interruption with next actions
                                this.getValues();       //reloads card data from the api and rerenders the UI
                            })
                            .catch(err =>{
                                //executes when deletion at the backend fails
                            });
           
        }

    }

    getValues() {
        //performs reading values over the API and update them to state

        axios.get(this.props.api)
        .then(response => {
            this.setState({ 
                fields: response.data
            });
        })
        .catch(err =>{
            //executes when updation over API fails
        });
    }

    componentDidMount() {
        //Reads value for the first time over api and renders the UI
        this.getValues();
    }


    
    render(){

        /*  map stores validation object for the form 
            title stores title for the Card
            formIsValid stores whether the edit/add form should be initially valid or not 
            (ie. for addition it should be initially invalid or submit button should be greyed out
             and for editing it should be initially valid or submit button should be enabled.)
        */
        let map, title, formIsValid;
        if(this.state.modifier == 'add'){
            map = this.addMap();
            title = 'Add New Entry';
            formIsValid = false;
        }    
        else if (this.state.modifier == 'edit'){
            map = this.editMap(this.state.editReq.id, this.state.editReq.index);
            title = 'Edit Entry';
            formIsValid = true;
        }
        else if (this.state.modifier == 'delete'){
            title = 'delete';
        }

        return(
            <Aux>
                
                <div className='OuterCard'>
                    <div className="CardName">
                        {this.props.name}
                        { //executes when user user click any of add, edit and delete button 
                          this.state.modifier !== null
                            ?
                            /*  <Modifier> executes profile settings dialogue box here
                                props sent to component - 
                                title: Title of the profile setting dialogue box 
                                map: object for field validation of profile seting dialogue box form
                                setModifier: used to close the profile setting dialogue box
                                formIsValid: required to set initial validation state of the profile setting dialogue box form, valid initially
                                onSubmitHandler: executes to update details over API when user hit submit 
                            */
                            <Modifier  
                                title = { title }  
                                map = {map}
                                setModifier = { (  ) => ( this.setModifier( null ) ) }
                                formIsValid = {formIsValid}
                                onSubmitHandler = { ( values ) => ( this.onSubmitHandler( values ) ) }
                            />
                            :null
                        }
                        {this.props.urlUsername == this.props.username ?
                            //add button, only visible when user is the logged in user
                            <button 
                            style = {{float: 'right'}}
                            className = " AddButton"
                            onClick = { () => { this.setModifier('add') } } >
                            </button>
                            :null
                        }
                           
                    </div>
                    {   //traverse each value of field to display all fields details on the cards
                        this.state.fields.map((field, index) => {
                            
                            /*  allFieldValues creates a new list that contains lists having values from field 
                                as [key, field[key]]
                            */
                            let allFieldValues = [];
                            for(let key in field) {
                                if(key != 'id' && key != 'username')
                                    allFieldValues.push([key, field[key]]);
                            }

                            let keyAndValueClass; //will be used to set different css classes on differnt field properties
                            return (
                                <div key={index} className = 'InnerCard'>
                                    <div>
                                        {   allFieldValues.map((keyAndValue, index) => {
                                                if(keyAndValue[0] === "date" || keyAndValue[0] === "startdate" || keyAndValue[0] === "lastdate") {
                                                    var res = keyAndValue[1].split("-");
                                                    var month;
                                                    switch(parseInt(res[1])) {
                                                        case 1: month="Jan"; break;
                                                        case 2: month="Feb"; break;
                                                        case 3: month="Mar"; break;
                                                        case 4: month="Apr"; break;
                                                        case 5: month="May"; break;
                                                        case 6: month="Jun"; break;
                                                        case 7: month="Jul"; break;
                                                        case 8: month="Aug"; break;
                                                        case 9: month="Sep"; break;
                                                        case 10: month="Oct"; break;
                                                        case 11: month="Nov"; break;
                                                        case 12: month="Dec"; break;
                                                    }
                                                    keyAndValue[1] = res[2]+ ' ' + month + ' ' + res[0];
                                                }
                                                
                                                if(keyAndValue[0] === "readlevel") {
                                                    keyAndValue[1]= 'Read Level: '+keyAndValue[1]; 
                                                }

                                                if(keyAndValue[0] === "writelevel") {
                                                    keyAndValue[1]= 'Write Level: '+keyAndValue[1];
                                                }

                                                switch(keyAndValue[0]) {

                                                    case 'institution':
                                                    case 'skill':
                                                    case 'description':
                                                    case 'interest':
                                                    case 'achievement':
                                                    case 'profile' : keyAndValueClass = "CardTitle"; break;
                                                    case 'course':
                                                    case 'title':
                                                    case 'language':
                                                    case 'company' : keyAndValueClass = "CardSubtitle"; break;
                                                    case 'date' :
                                                    case 'startdate' : keyAndValueClass = "StartDate"; break;
                                                    case 'lastdate' :   keyAndValueClass = "LastDate";
                                                                        keyAndValue[1] = '- '+keyAndValue[1];
                                                                        break;
                                                    case 'readlevel' :
                                                    case 'writelevel' :
                                                    case 'level' : keyAndValueClass = "CardLevel"; break;
                                                    case 'city' : keyAndValueClass = "CardCity"; break;
                                                }
                                                return(
                                                <div 
                                                    className={keyAndValueClass} 
                                                    key={index}
                                                >
                                                    {keyAndValue[1]}
                                                </div>
                                                );
                                            })
                                        }
                                    </div>
                                    <div>
                                        {this.props.urlUsername == this.props.username ?
                                            //edit button, only visible when user is the logged in user
                                            <button 
                                            onClick = { () => { this.setModifier('edit', field.id, index) } }
                                            className = " EditButton"
                                            >
                                            </button> 
                                            :null
                                        }
                                        {this.props.urlUsername == this.props.username ?
                                            //delete button, only visible when user is the logged in user
                                            <button 
                                            onClick = { () => { this.setModifier('delete', field.id, index) } }
                                            className = " DeleteButton"
                                            >
                                            </button> 
                                            :null
                                        }  
                                        
                                    </div>
                                </div>    
                            )
                        })
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

/*  redux state subscription with connect */
export default connect(mapStateToProps)(Card);