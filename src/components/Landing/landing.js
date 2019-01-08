import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class Landing extends Component {
    render(){
        return (
            <div>
                <h1>Landing</h1>
                {/*Authentication turnary for landing*/}
                {/* {isAuthenticated ? <Redirect to="/dashboard" /> : <div>

                </div>} */}
            </div>
        )
    }
}

export default Landing;