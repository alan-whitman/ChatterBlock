import React, { Component } from 'react';
import './frienduserbar.css'
import friends from './friendsDummyData';

class FriendUserBar extends Component {
    constructor() {
        super();
        this.state = {
            friends: friends
        }
    }
    componentDidMount() {
        
    }
    renderFriends() {
        let onlineFriends = this.state.friends
            .filter(friend => friend.online)
            .sort((a, b) => a.username < b.username ? -1 : 1)
            .map((friend, i) => <li key={i}>{friend.username}</li>);
        let offlineFriends = this.state.friends
            .filter(friend => !friend.online)
            .sort((a, b) => a.username < b.username ? -1 : 1)
            .map((friend, i) => <li key={i}>{friend.username}</li>);
        return (
            <div>
                <h4>Online</h4>
                <ul className="online-friends">
                    {onlineFriends}
                </ul>
                <div>Offline</div>
                <ul className="offline-friends">
                    {offlineFriends}
                </ul>
            </div>
        )
    }
    render(){
        return (
            <div className="rightBar">
                <div className="friends-holder">
                    {this.renderFriends()}
                </div>
            </div>
        )
    }
}

export default FriendUserBar;