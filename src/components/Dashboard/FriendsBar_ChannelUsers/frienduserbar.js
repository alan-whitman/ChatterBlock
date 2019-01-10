import React, { Component } from 'react';
import './frienduserbar.css'
import { connect } from 'react-redux';
import Friends from './Friends';

class FriendUserBar extends Component {
    render(){
        console.log(this.props.isAuthenticated)
        return (
            <div className="rightBar">
                {this.props.isAuthenticated ?
                    <Friends socket={this.props.socket} />
                :
                    null
                }
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