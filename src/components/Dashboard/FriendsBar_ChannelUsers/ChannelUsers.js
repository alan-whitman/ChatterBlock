import React, { Component } from 'react';
import './ChannelUsers.css';
import { connect } from 'react-redux';
import ChannelPopup from './ChannelPopup';

class ChannelUsers extends Component {
    renderChannelUsers() {
        return this.props.channelUsers.map((user, i) =>
            <li key={i}>
                <ChannelPopup socket={this.props.socket} user={user} {...this.props} />
            </li>
        );
    }
    render() {
        return (
            <div className="ChannelUsers">
                <h4>Channel Users</h4>
                <ul>
                    {this.renderChannelUsers()}
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