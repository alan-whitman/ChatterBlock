import React, { Component } from 'react';
import './Friends.css';
import { connect } from 'react-redux';
import { populateFriends } from '../../../redux/reducer';

class Friends extends Component {
    constructor(props) {
        super(props);
        this.props.socket.on('send your friends', myFriends => {
            this.props.populateFriends(myFriends);
        });
        this.props.socket.on('friend went offline', friendId => {
            const updatedFriends = this.props.friends.map(friend => {
                if (friend.id === friendId)
                    friend.online = false;
                return friend;
            });
            this.props.populateFriends(updatedFriends);
        });
        this.props.socket.on('friend came online', friendId => {
            const updatedFriends = this.props.friends.map(friend => {
                if (friend.id === friendId)
                    friend.online = true;
                return friend;
            })
            this.props.populateFriends(updatedFriends);
        });
    }
    componentDidMount() {
        this.props.socket.emit('get my friends');
    }
    addFriends() {

    }
    renderFriends() {
        let onlineFriends = this.props.friends
            .filter(friend => friend.online)
            .sort((a, b) => a.username < b.username ? -1 : 1)
            .map((friend, i) => <li key={i}>{friend.username}</li>);
        let offlineFriends = this.props.friends
            .filter(friend => !friend.online)
            .sort((a, b) => a.username < b.username ? -1 : 1)
            .map((friend, i) => <li key={i}>{friend.username}</li>);
        return (
            <div>
                <div style={{fontWeight: 'bold'}}>Online</div>
                <ul className="online-friends" style={{marginBottom: 10}}>
                    {onlineFriends}
                </ul>
                <div style={{fontWeight: 'bold'}}>Offline</div>
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
    let { friends } = state;
    return {
        friends
    }
}

export default connect(mapStateToProps, {populateFriends})(Friends);