import React, { Component } from 'react';
import './ChannelUsers.css';
import { connect } from 'react-redux';

class ChannelUsers extends Component {
    renderChannelUsers() {
        // console.log('rendering channel users: ', this.props.channelUsers);
        return this.props.channelUsers.map((user, i) =>
            <li key={i}>
                {user.username}
            </li>
        );
    }
    render() {
        console.log('rendering channel users: ', this.props.channelUsers);
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
    const { channelUsers } = state;
    return {
        channelUsers
    }
}

export default connect(mapStateToProps)(ChannelUsers);