import React, { Component } from 'react';
import './ChannelUsers.css';
import { connect } from 'react-redux';
import ChannelPopup from './ChannelPopup';

class ChannelUsers extends Component {
    renderOnlineUsers() {
        return this.props.channelUsers.filter(user => user.online).map((user, i) => 
            <ChannelPopup socket={this.props.socket} user={user} {...this.props} key={user.username} />
        )
    }
    renderOfflineUsers() {
        return this.props.channelUsers.filter(user => !user.online).map((user, i) => 
            <ChannelPopup socket={this.props.socket} user={user} {...this.props} key={user.username} />
        )
    }
    render() {
        return (
            <div className="ChannelUsers">
                <div className="channel-users-title">Channel Users</div>
                <div className="channel-users-header">Online</div>
                {this.renderOnlineUsers()}
                <div className="channel-users-header">Offline</div>
                {this.renderOfflineUsers()}
            </div>
        )
    }
}

const mapStateToProps = state => {
    let { channelUsers } = state;
    return {
        channelUsers
    }
}

export default connect(mapStateToProps)(ChannelUsers);