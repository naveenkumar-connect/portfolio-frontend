/*
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
        fields: [],
        modifier: null,
        editReq: {
            id: '',
            index: ''
        }
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

    selectFormField = (config, nameOfField, elementType, placeholder, options, value, validation) => {
        config[nameOfField] = {};
        config[nameOfField]['elementType'] = elementType;
        config[nameOfField]['elementConfig'] = {};
        config[nameOfField]['elementConfig']['placeholder'] = placeholder;
        config[nameOfField]['elementConfig']['options'] = options;
        config[nameOfField]['value'] = value;
        config[nameOfField]['validation'] = validation;
    } 

    editMap = (id, index) => {
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
        console.log(values);
        switch(this.state.modifier){
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
                            console.log('add');
                            console.log(response);
                            this.setModifier(null);
                            this.getValues();
                        })
                        .catch(err =>{
                            console.log(err);
                        });
                        break;
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
                                console.log('edit');
                                console.log(response);
                                this.setModifier(null);
                                this.getValues();
                            })
                            .catch(err =>{
                                console.log(err);
                            });
                            break;
            case 'delete':  axios.delete(this.props.api+this.state.editReq.id+'/',
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
        axios.get(this.props.api)
        .then(response => {
            console.log('response.data');
            console.log(response.data);
            this.setState({ 
                fields: response.data
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
                        {this.props.urlUsername == this.props.username ?
                            <button 
                            style = {{float: 'right'}}
                            className = " AddButton"
                            onClick = { () => { this.setModifier('add') } } >
                            </button>
                            :null
                        }
                           
                    </div>
                    {
                        this.state.fields.map((field, index) => {
                            let allFieldValues = [];
                            for(let key in field) {
                                if(key != 'id' && key != 'username')
                                    allFieldValues.push([key, field[key]]);
                            }
                            let keyAndValueClass;
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
                                            <button 
                                            onClick = { () => { this.setModifier('edit', field.id, index) } }
                                            className = " EditButton"
                                            >
                                            </button> 
                                            :null
                                        }
                                        {this.props.urlUsername == this.props.username ?
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

const mapStateToProps = state => {
    return {
        ...state
    };
}

export default connect(mapStateToProps)(Card);