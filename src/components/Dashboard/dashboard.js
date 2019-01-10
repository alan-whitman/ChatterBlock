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

class Dashboard extends Component {
    render(){
        return (
            <div className="Dashboard">
                <NavBar/>
                <Switch>
                    <Route path="/dashboard" exact component={Recent} />
                    <Route path="/dashboard/channel" component={ChannelView} />
                    <Route path="/dashboard/profile" component={Profile} />
                    <Route path="/dashboard/settings" component={Settings} />
                    <Route path="/dashboard/dms" component={PrivateMsg} />
                </Switch>
                <FriendUserBar/>
            </div>
        )
    }
}

export default Dashboard;