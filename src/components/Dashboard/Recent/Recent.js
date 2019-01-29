import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Recent.css';
import { createAlertMessage } from '../../../redux/reducer';

class Recent extends Component {
    render(){
        return (
            <div className="Recent">
                <h1 style={{color: 'white'}}>Welcome to ChatterBlock!</h1>
                <p>ChatterBlock is a real-time chat application along the lines of Slack or Discord. It features a flat channel structure, where any user can create a chat channel which other users can see, join, and subscribe to. Users can also send direct messages and form friend relationships with each other.</p>
                <p>React.js | Node.js | Socket.io | Express | PostreSQL | HTML5 | CSS3</p>

            </div>
        )
    }
}

export default connect(null, { createAlertMessage })(Recent);