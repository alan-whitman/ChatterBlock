import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import NavBar from './LeftNavBar/leftnavbar';
import ChannelView from './ChannelView/channelview';
import Recent from './Recent_Notifications/recent';
import Profile from './Profiles/profiles';
import Settings from './Settings/settings';
import FriendUserBar from './FriendsBar_ChannelUsers/frienduserbar';
import PrivateMsg from './PrivateMessaging/privatemsg';
import './dashboard.css';
import io from 'socket.io-client';
const socketPath = window.location.host.split(':')[0];
let socket;

class Dashboard extends Component {
    constructor() {
        super();
        socket = io(socketPath + ':5004');
    }
    render(){
        return (
            <div className="Dashboard">
                <NavBar/>
                <Switch>
                    <Route path="/dashboard" exact component={Recent} />
                    <Route path="/dashboard/channel" component={ChannelView} />
                    <Route path="/dashboard/profile" component={Profile} />
                    <Route path="/dashboard/settings" render={(props) => 
                        <Settings 
                            {...props}
                            socket={socket}
                        />} 
                    />
                    <Route path="/dashboard/dms" component={PrivateMsg} />
                </Switch>
                <FriendUserBar socket={socket} />
            </div>
        )
    }
}

export default Dashboard;