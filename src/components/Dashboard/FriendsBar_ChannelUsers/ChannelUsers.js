import React, { Component } from 'react';
import './ChannelUsers.css';
import { connect } from 'react-redux';
import ChannelPopup from './ChannelPopup';

class ChannelUsers extends Component {
    renderOnlineUsers() {
        return this.props.channelUsers.filter(user => user.online).map((user, i) => 
            <li key={i}>
                <ChannelPopup socket={this.props.socket} user={user} {...this.props} />
            </li>
        )
    }
    renderOfflineUsers() {
        return this.props.channelUsers.filter(user => !user.online).map((user, i) => 
            <li key={i}>
                <ChannelPopup socket={this.props.socket} user={user} {...this.props} />
            </li>
        )
    }
    render() {
        return (
            <div className="ChannelUsers">
                <h4>Channel Users</h4>
                <h6>Online</h6>
                <ul>
                    {this.renderOnlineUsers()}
                </ul>
                <h6>Offline Subscribers</h6>
                <ul>
                    {this.renderOfflineUsers()}
                </ul>
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