import React, { Component } from 'react';
import './Friends.css';
import friends from './friendsDummyData';
import { connect } from 'react-redux';

class Friends extends Component {
    constructor() {
        super();
        this.state = {
            friends: friends
        }
    }
    componentDidMount() {
        // console.log('asdsdaf')
        setInterval(() => this.props.socket.emit('test'), 3000);
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
                    <input type="text" placeholder="add friend" />
                    {this.renderFriends()}
                </div>
            </div>
        )
    }

}

const mapStateToProps = state => {
    let { isAuthenticated } = state;
    return {
        isAuthenticated
    }
}

export default connect(mapStateToProps, null)(Friends);