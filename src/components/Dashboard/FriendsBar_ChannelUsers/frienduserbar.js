import React, { Component } from 'react';
import './frienduserbar.css'
import { connect } from 'react-redux';
import Friends from './Friends';
import ChannelUsers from './ChannelUsers';

class FriendUserBar extends Component {
    render(){
        return (
            <div className="FriendUserBar">
                {this.props.isAuthenticated ?
                    <Friends socket={this.props.socket} {...this.props}/>
                :
                    null
                }
                <ChannelUsers />
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

export default connect(mapStateToProps, null)(FriendUserBar);