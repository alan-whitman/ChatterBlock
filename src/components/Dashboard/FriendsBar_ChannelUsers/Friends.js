import React, { Component } from 'react';
import './Friends.css';
import { connect } from 'react-redux';
import { populateFriends } from '../../../redux/reducer';
import Popup from './popup';

class Friends extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestedFriend: '',
            pendingFriends: [],
            rightclickmenu: false
        }
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
        this.props.socket.on('confirm friend request', confirmation => {
            // console.log(confirmation);
        });
        this.props.socket.on('new friend request', requester => {
            let { pendingFriends } = this.state;
            pendingFriends.push(requester);
            this.setState({pendingFriends});
        });
        this.props.socket.on('send pending requests', pendingRequests => {
            if (pendingRequests !== 'no requests pending')
                this.setState({pendingFriends: pendingRequests})
            else
                this.setState({pendingFriends: []});
        });
        this.props.socket.on('friend update complete', () => {
            this.props.socket.emit('get my friends');
            this.props.socket.emit('get pending friend requests');
        })
    }
    componentDidMount() {
        this.props.socket.emit('get my friends');
        this.props.socket.emit('get pending friend requests');
    }
    updateInput(e) {
        const { name, value } = e.target;
        this.setState({[name]: value});
    }
    requestFriend() {
        if (this.props.friends.findIndex(friend => friend.username === this.state.requestedFriend ) !== -1)
            return console.log(`${this.state.requestedFriend} is already your friend`);
        this.props.socket.emit('request friend', this.state.requestedFriend);
        this.setState({requestedFriend: ''});
    }
    acceptFriend(user) {
        this.props.socket.emit('accept friend', user);
    }
    rejectFriend(user) {
        this.props.socket.emit('reject friend', user);
    }
    deleteFriend(user) {
        this.props.socket.emit('delete friend', user);
    }
    renderFriends() {
        const onlineFriends = this.props.friends
            .filter(friend => friend.online)
            .sort((a, b) => a.username < b.username ? -1 : 1)
            .map((friend, i) => 
                <li key={i}>
                    <Popup deleteFriend={this.deleteFriend} friend={friend}/>
                </li>
            );
        const offlineFriends = this.props.friends
            .filter(friend => !friend.online)
            .sort((a, b) => a.username < b.username ? -1 : 1)
            .map((friend, i) => 
                <li key={i}>
                    <Popup deleteFriend={this.deleteFriend} friend={friend}/>
                
                    {/* <h3 onContextMenu={this.handleClick}>{friend.username}</h3><br />
                    {this.state.rightclickmenu && <div className="popupmenu"><Link to={`/dashboard/profile/${friend.id}`}>{friend.username}</Link>
                    <br /><span onClick={e => this.deleteFriend({id: friend.id, username: friend.username})} className="accept-reject">Delete</span></div>} */}
                    
                </li>
            );
        const pendingFriends = this.state.pendingFriends
            .sort((a, b) => a.username < b.username ? -1 : 1)
            .map((friend, i) => 
                <li key={i}>
                    {friend.username}<br />
                    <span onClick={e => this.acceptFriend({id: friend.id, username: friend.username})} className="accept-reject">Accept</span>&nbsp;&nbsp; 
                    <span onClick={e => this.rejectFriend({id: friend.id, username: friend.username})} className="accept-reject">Reject</span>
                </li>
            );
        return (
            <div>
                <div style={{fontWeight: 'bold'}}>Online</div>
                <ul className="online-friends" style={{marginBottom: 10}}>
                    {onlineFriends}
                </ul>
                <div style={{fontWeight: 'bold'}}>Offline</div>
                <ul className="offline-friends" style={{marginBottom: 10}}>
                    {offlineFriends}
                </ul>
                <div style={{fontWeight: 'bold'}}>Pending</div>
                <ul className="pending-friends">
                    {pendingFriends}
                </ul>
            </div>
        )
    }

    render(){
        return (
            <div className="rightBar">
                <div className="friends-holder">
                    <input 
                        type="text"
                        name="requestedFriend"
                        placeholder="add friend" 
                        value={this.state.requestedFriend}  
                        onChange={e => this.updateInput(e)}
                        onKeyPress={e => {if (e.key === "Enter") this.requestFriend()}}
                    />
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