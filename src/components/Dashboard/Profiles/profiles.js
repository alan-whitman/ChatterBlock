import React, { Component } from 'react';
import './profiles.css'
import { connect } from 'react-redux';
import axios from 'axios';

class Profile extends Component {
    constructor(){
        super()

        this.state = {
            profileInfo: {},
            prevProps: 0
        }
    }
    componentDidMount(){
        this.getUser();
        this.setState({prevProps: this.props.match.params});
    }
    componentDidUpdate(){
        if(this.state.prevProps !== this.props.match.params){
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
                    <h3>Add</h3>
                </div>
                <div className="profileSection1">
                    <div className="about">
                        <h2>{this.state.profileInfo.user.about_text}</h2>
                    </div>
                    <div className="profileChannels">
                        {this.state.profileInfo.userSubChannels.map((channel, i) => {
                            return (
                            <p key={i} className="channels">  
                                {channel.channel_name}
                            </p>             
                        )})}
                    </div>
                </div>

                <div className="profileSection2">
                    <div className="friends">
                        {console.log(this.state.profileInfo)}
                        {this.state.profileInfo.userFriends.map((friend, i) => {
                            return (
                            <p key={i} className="channels">  
                                {friend.username}
                            </p>             
                        )})}
                    </div>
                    <div className="extraBox">
                        {this.state.profileInfo.postMeta.count}
                    </div>
                </div>
                <div className="profileSection2">
                    <div className="friends">
                    
                    </div>
                    <div className="extraBox">
                        {this.state.profileInfo.profileRecentMessages.map((message, i)=> {
                            return (
                                <p key={i}>
                                    {message.content_text}
                                </p>
                            )
                        })}
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