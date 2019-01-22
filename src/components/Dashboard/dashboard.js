import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import NavBar from './LeftNavBar/leftnavbar';
import ChannelView from './ChannelView/channelview';
import Recent from './Recent_Notifications/recent';
import Profile from './Profiles/profiles';
import Settings from './Settings/settings';
import FriendUserBar from './FriendsBar_ChannelUsers/frienduserbar';
import DirectMessage from './DirectMessage/DirectMessage';
import { connect } from 'react-redux';
import { createAlertMessage } from '../../redux/reducer';
import './dashboard.css';
import io from 'socket.io-client';
const socketPath = window.location.host.split(':')[0];
let socket;

class Dashboard extends Component {
    constructor() {
        super();
        socket = io(socketPath + ':5004');
        socket.on('send user feedback', feedback => {
            this.props.createAlertMessage(feedback);
        })
    }
    showNav = (e, a) => {
        var x = document.getElementById(e);
        var y = document.getElementById(a);
        if (x.style.display === "none") {
            x.style.display = "block";
            y.style.display = "none";
        } else {
            x.style.display = "none";
        }


    }

    render() {
        return (
            <Route path="/dashboard" render={(props) => {
                return (
                    <div className="Dashboard">
                        <NavBar socket={socket} />
                        <div className="center-container">
                            <Switch>
                                <Route path="/dashboard" exact component={Recent} />
                                <Route path="/dashboard/channel/:channelName" render={props =>
                                    <ChannelView
                                        {...props}
                                        socket={socket}
                                    />}
                                />
                                <Route path="/dashboard/profile/:id" component={Profile} />
                                <Route path="/dashboard/settings" render={props =>
                                    <Settings
                                        {...props}
                                        socket={socket}
                                    />}
                                />
                                <Route path="/dashboard/dm/:username" render={props =>
                                    <DirectMessage
                                        {...props}
                                        socket={socket}
                                    />}
                                />
                            </Switch>
                        </div>
                        <FriendUserBar socket={socket} {...props} />
                        {/* <MobileNav /> */}
                        <div className="mobile-nav">
                            <div className="mobile-nav-link" ><i className="fas fa-cog"></i></div>
                            <div className="mobile-nav-link" name="Channels" onClick={(e, a) => this.showNav("NavBar", "FriendUserBar")}><i className="fas fa-comments"></i></div>
                            <div className="mobile-nav-link" name="FriendUserBar" onClick={(e, a) => this.showNav("FriendUserBar", "NavBar")}><i className="fas fa-user-friends"></i></div>
                        </div>
                    </div>
                )
            }}
            />)
    }
}

function mapStateToProps(state) {
    let { user } = state
    return {
        user
    }
}

export default connect(mapStateToProps, { createAlertMessage })(Dashboard);