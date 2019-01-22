import React, { Component } from 'react';
import { connect } from 'react-redux';
import './recent.css';
import { createAlertMessage } from '../../../redux/reducer';

class Recent extends Component {
    render(){
        return (
            <div className="Recent">
                <h1 style={{color: 'white'}}>Recent stuff</h1>
            </div>
        )
    }
}

export default connect(null, { createAlertMessage })(Recent);