import React, { Component } from 'react';
import './profiles.css'
import { connect } from 'react-redux';
import axios from 'axios';

class Profile extends Component {
    constructor(){
        super()

        this.state = {
            profileInfo: {},
        }
    }
    componentDidMount(){
        this.getUser();
        this.setState({prevProps: this.props.match.params});
    }
    componentDidUpdate(prevProps){
        if(prevProps.match.params.id !== this.props.match.params.id){
            this.getUser();
        }
    }

    getUser = () => {
        axios.get(`/api/profile/${this.props.match.params.id}`).then(response => {
            this.setState({profileInfo: response.data}) 
            // console.log(this.state.profileInfo)
        })
    }
    
    render(){
        return (
            <div className="shush">
                {this.state.profileInfo.user && 
                
                <div className="mainProfile">
                <div className="profileHeader">
                    <div style={{display: "flex", alignItems: 'center', width: '500px', justifyContent: 'space-between'}}>
                        <div className="profileImage"><img src={this.state.profileInfo.user.user_image} alt="profile pic"/></div>
                        <h1>{this.state.profileInfo.user.username}</h1>
                    </div>
                </div>
                <div className="profileSection1">
                    <div className="about">
                        <h2>{this.state.profileInfo.user.about_text ? this.state.profileInfo.user.about_text : <h3>You do not have a summary yet.</h3>}</h2>
                    </div>
                    <div className="profileChannels">
                        {this.state.profileInfo.userSubChannels ? this.state.profileInfo.userSubChannels.map((channel, i) => {
                            return (
                            <p key={i} className="channels">  
                                {channel.channel_name}
                            </p>             
                        )}) : <h3>You are not subbed to any channels yet.</h3>}
                    </div>
                </div>

                <div className="profileSection2">
                    <div className="friends">
                        {this.state.profileInfo.userFriends ? this.state.profileInfo.userFriends.map((friend, i) => {
                            return (
                            <p key={i} className="channels">  
                                {friend.username}
                            </p>             
                        )}) : <h3>You don't have any friends yet.</h3>}
                    </div>
                    <div className="extraBox">
                        {this.state.profileInfo.postMeta.count ? this.state.profileInfo.postMeta.count : <h3>You haven't posted any messages yet.</h3>}
                    </div>
                </div>
                <div className="profileSection2">
                    <div className="friends">
                    
                    </div>
                    <div className="extraBox">
                        {this.state.profileInfo.profileRecentMessages ? this.state.profileInfo.profileRecentMessages.map((message, i)=> {
                            return (
                                <p key={i}>
                                    {message.content_text}
                                </p>
                            )
                        }) : <h3>You haven't posted any messages yet.</h3>}
                    </div>
                </div>
                </div>}
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