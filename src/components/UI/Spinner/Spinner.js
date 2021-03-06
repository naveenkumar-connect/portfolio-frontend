/* Displays Spinner when requested*/

import React from 'react';
import './Spinner.css';

const spinner = (props) => {

    var loader;

    switch(props.type) {
        case "login":   loader =    <div className="LoginSpinnerHolder">
                                        <div className="LoginLoader">Loading...</div>
                                    </div>;
                        break;
        case "logout":  loader =    <div className="LogoutSpinnerHolder">
                                        <div className="LogoutLoader">Loading...</div>
                                    </div>;
    }

    return(
        <div>
            {loader}
        </div>
    );
}

export default spinner;