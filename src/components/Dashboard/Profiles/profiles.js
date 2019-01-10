import React, { Component } from 'react';
import './profiles.css'
import { connect } from 'react-redux';

class Profile extends Component {
    render(){
        console.log(this.props.user)
        return (
            <div className="mainProfile">
            <div className="profileHeader">
                <div style={{display: "flex", alignItems: 'center', width: '500px', justifyContent: 'space-between'}}>
                    <div className="profileImage"><img src={this.props.user.user_image} alt="profile pic"/></div>
                    <h1>{this.props.user.username}</h1>
                </div>
                <h3>Add</h3>
            </div>
            <div className="profileSection1">
                <div className="about">
                    <h2>{this.props.user.about_text}</h2>
                </div>
                <div className="profileChannels"></div>
            </div>

            <div className="profileSection2">
                <div className="friends">
                
                </div>
                <div className="extraBox">
                
                </div>
            </div>
            <div className="profileSection2">
                <div className="friends">
                
                </div>
                <div className="extraBox">
                
                </div>
            </div>
                <h2>{this.props.user.email}</h2>
                
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