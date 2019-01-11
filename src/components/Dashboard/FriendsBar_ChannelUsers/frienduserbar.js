import React, { Component } from 'react';
import './frienduserbar.css'
import friends from './friendsDummyData';
import { Redirect } from 'react-router-dom';
import Popup from 'reactjs-popup';

class FriendUserBar extends Component {
    constructor() {
        super();
        this.state = {
            friends: friends,
            rightclickmenu: false
        }
    }
    componentDidMount() {
        
    }

    handleClick = (event) => {
        if (event.type === 'click') {
            // <Redirect to="/dashboard/profile"/>;
        } else if (event.type === 'contextmenu') {
            event.preventDefault();
            
            this.setState({ rightclickmenu: true }, () => {
                document.addEventListener('click', this.closeMenu);
            });
        }
    }

    closeMenu = () => {
        this.setState({ rightclickmenu: false }, () => {
          document.removeEventListener('click', this.closeMenu);
        });
    }

    renderFriends() {
        let onlineFriends = this.state.friends
            .filter(friend => friend.online)
            .sort((a, b) => a.username < b.username ? -1 : 1)
            .map((friend, i) => <li key={i}>{friend.username}</li>);
        let offlineFriends = this.state.friends
            .filter(friend => !friend.online)
            .sort((a, b) => a.username < b.username ? -1 : 1)
            .map((friend, i) => <Popup trigger={<li key={i} onClick={this.handleClick} onContextMenu={this.handleClick}>{friend.username}</li>} position="top left"><div>Popup content here !!</div></Popup>);
        return (
            <div>
                <div>Online</div>
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
                {this.state.rightclickmenu && <div>hello</div>}
                <Popup open={this.state.rightclickmenu} ><div>Popup content here !!</div></Popup>
            </div>
        )
    }
}

export default FriendUserBar;