import React, { Component } from 'react';
import './Projects.css'; 
import Card from '../../containers/Card/Card';

class Projects extends Component {
    render() {
        return (
            <div className = 'Box'> 
                <Card 
                  name = 'PROJECTS'
                  api = 'http://127.0.0.1:8000/api/info/projects/'
                  fieldInfo = { [
                    { nameOfField: 'title', 
                      elementType: 'input', 
                      type: 'text', 
                      placeholder: 'Title', 
                      validation: {required: true} 
                    },
                    { nameOfField: 'description', 
                      elementType: 'input', 
                      type: 'text', 
                      placeholder: 'Description', 
                      validation: {required: true} 
                    }
                  ] }
                />
            </div>
        );
    }
}

export default Projects;