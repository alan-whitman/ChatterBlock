import React, { Component } from 'react';
import './ChannelUsers.css';
import { connect } from 'react-redux';

class ChannelUsers extends Component {
    renderChannelUsers() {
        return this.props.channelUsers.map((user, i) =>
            <li key={i}>
                {user.username}
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