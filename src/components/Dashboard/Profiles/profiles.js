import React, { Component } from 'react';
import './profiles.css'
import { connect } from 'react-redux';

class Profile extends Component {
    render(){
        console.log(this.props.user)
        return (
            <div>
                <h1>{this.props.user.username}</h1>
                <h2>{this.props.user.email}</h2>
                <h2>{this.props.user.about_text}</h2>
                <h2>{this.props.user.user_image}</h2>
                <h2>{this.props.user.verified}</h2>
            </div>
        )
    }
}

function mapStateToProps(state) {
    let { user, isAuthenticated } = state
    return {
      user, isAuthenticated
    }
  }
  
export default connect(mapStateToProps)(Profile);