import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "./leftnavbar.css";
import { connect } from 'react-redux';
import { userLoggedOut, populateActiveDms, createAlertMessage } from '../../../redux/reducer';
import axios from 'axios';
import Popup from 'reactjs-popup'
import Transition from 'react-addons-css-transition-group';

class NavBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchInput: "",
            channel_name: "",
            channels: [],
            subbedChannels: [],
            open: false,
            channel_description: '',
            showSubs: true,
            showDms: true,
            showAllChannels: true,
            channelFilter: ''
        };
        this.props.socket.on('new direct message', newMessage => {
            if (newMessage.sender === this.props.user.user.username)
                return;
            let activeDms = [...this.props.activeDms];
            let sender = {
                username: newMessage.sender,
                id: newMessage.id
            }
            if (activeDms.findIndex(user => user.username === sender.username) === -1) {
                activeDms.push(sender);
                activeDms.sort((a, b) => a.username < b.username ? -1 : 1);
                this.props.populateActiveDms(activeDms);
            }
        });
        this.props.socket.on('successfully subbed to channel', channelId => {
            let { channels, subbedChannels } = this.state;
            const channelIndex = channels.findIndex(channel => channel.id === channelId);
            subbedChannels.push(channels[channelIndex]);
            subbedChannels.sort((a, b) => a.channel_name < b.channel_name ? -1 : 1)
            channels = channels.filter(channel => channel.id !== channelId)
            this.setState({channels, subbedChannels});
        });
        this.props.socket.on('successfully unsubbed to channel', channelId => {
            let { channels, subbedChannels } = this.state;
            const channelIndex = subbedChannels.findIndex(channel => channel.id === channelId);
            channels.push(subbedChannels[channelIndex]);
            channels.sort((a, b) => a.channel_name < b.channel_name ? -1 : 1)
            subbedChannels = subbedChannels.filter(channel => channel.id !== channelId);
            this.setState({channels, subbedChannels});
        });
        this.props.socket.on('channel creation error', error => {
            this.props.createAlertMessage(error)
        });
        this.props.socket.on('new channel created', newChannel => {
            let { channels } = this.state;
            newChannel.subbed = false;
            channels.push(newChannel);
            channels.sort((a, b) => a.channel_name < b.channel_name ? -1 : 1);
            this.setState({channels});
        });
    }

    componentDidMount() {
        axios.get('/api/channel/getChannels').then(res => {
            let channels = res.data.map(channel => {
                return {
                    id: channel.id,
                    channel_name: channel.channel_name,
                    channel_url: channel.channel_url,
                    channel_description: channel.channel_description,
                    last_view_time: channel.last_view_time,
                    creator_id: channel.creator_id,
                    user_id: channel.user_id
                    // subbed: channel.user_id ? true : false
                }
            });
            let subbedChannels = channels.filter(channel => channel.user_id);
            channels = channels.filter(channel => !channel.user_id);
            subbedChannels.sort((a, b) => a.channel_name < b.channel_name ? -1 : 1)
            channels.sort((a, b) => a.channel_name < b.channel_name ? -1 : 1)
            this.setState({channels, subbedChannels});
        }).catch(err => console.error(err));
        axios.get('/api/dm/getActiveDms').then(response => {
            this.props.populateActiveDms(response.data);
        }).catch(err => console.error(err));
    }
    handleChannel = (val) => {
        this.setState({
            channel_name: val
        })
    }
    handleDescription = (val) => {
        this.setState({
            channel_description: val
        })
    }
    handleSubChannel = (channelId) => {
        this.props.socket.emit('subscribe to channel', channelId);
    }
    handleUnSubChannel = (channelId) => {
        this.props.socket.emit('unsubscribe from channel', channelId);
    }
    handleAddChannel = (e) => {
        const { channel_name, channel_description } = this.state;
        if (!channel_name.trim())
            return;
        const newChannel = {
            channel_name,
            channel_description
        }
        this.props.socket.emit('create new channel', newChannel)
    }
    updateInput(e) {
        const { name, value } = e.target;
        this.setState({[name]: value})
    }
    openModal = (e) => {
        e.preventDefault()
        this.setState({ open: true })
    }
    closeModal = () => {
        this.setState({ open: false })
    }
    renderDms() {
        if (this.props.activeDms.length === 0)
            return <div className="channel-list">No Active Conversations</div>
        return this.props.activeDms.map((user, i) =>
            <div key={i} className="channel-list">
                <div className="sub" onClick={e => this.hideConversation(user)}>-</div>
                <Link to={`/dashboard/dm/${user.username}`}>{user.username}</Link>
            </div>
        )
    }
    renderSubbedChannels() {
        if (this.state.subbedChannels.length === 0)
            return <div className="channel-list">No Subscribed Channels</div>
        return this.state.subbedChannels
            .map((channel, i) =>
                <div key={channel.channel_name} className="channel-list">
                    <div className="sub" onClick={e => this.handleUnSubChannel(channel.id)}>-</div>
                    <Link to={`/dashboard/channel/${channel.channel_url}`} className="channel-link">
                        {channel.channel_name}
                            {channel.count > 0 ? 
                                <p className="unseen-channel-messages">{channel.count}</p> 
                            : null}
                    </Link>
                </div>
            )
    }
    renderUnsubbedChannels() {
        let channels = [...this.state.channels]
        if (this.state.channelFilter.trim())
            channels = channels.filter(channel => channel.channel_name.toLowerCase().includes(this.state.channelFilter.trim().toLowerCase()));
        return channels
            .map((channel, i) => 
                <div key={channel.channel_name} className="channel-list">
                    <div className="sub" onClick={e => this.handleSubChannel(channel.id)}>+</div>
                    <Link to={`/dashboard/channel/${channel.channel_url}`} className="channel-link">
                        {channel.channel_name}
                    </Link>
                </div>
            )
    }
    toggleMenu(menuName) {
        this.setState({[menuName]: !this.state[menuName]})
    }
    hideConversation(user) {
        console.log(user);
        let activeDms = [...this.props.activeDms];
        activeDms = activeDms.filter(username => username.username !== user.username);
        this.props.populateActiveDms(activeDms);
        axios.delete('/api/dm/hideDm/' + user.id);
    }
    render() {
        let count = 100;
        count -= this.state.channel_description.length;
        return (
            <div className="NavBar">
                <div className="nav-logo">{this.props.isAuthenticated ? <Link to="/dashboard"><h2>ChatterBlock</h2></Link> : <Link to="/"><h2>ChatterBlock</h2></Link>}</div>
                <div className="nav-channels">
                    {this.props.isAuthenticated ?
                        <div>
                            <div className="subbed-channels">
                                <div className="channels-header" onClick={e => this.toggleMenu('showSubs')}>Subscribed Channels</div>
                                <Transition
                                    transitionName="menu"
                                    transitionEnterTimeout={200}
                                    transitionLeaveTimeout={200}
                                >
                                    {this.state.showSubs ?
                                        <div key="subbedChannels">
                                            <Transition
                                                transitionName="list"
                                                transitionEnterTimeout={200}
                                                transitionLeaveTimeout={200}

                                            >
                                                {this.renderSubbedChannels()}
                                            </Transition>
                                        </div>
                                    : null}
                                </Transition>
                            </div>
                            <div className="direct-messages">
                                <div className="channels-header" onClick={e => this.toggleMenu('showDms')}>Direct Messages</div>
                                <Transition
                                    transitionName="menu"
                                    transitionEnterTimeout={200}
                                    transitionLeaveTimeout={200}
                                >
                                    {this.state.showDms ?
                                        <Transition
                                            transitionName="list"
                                            transitionEnterTimeout={200}
                                            transitionLeaveTimeout={200}
                                        >
                                            {this.renderDms()}
                                        </Transition>
                                    : null}
                                </Transition>
                            </div>
                        </div>
                    : null}
                    <div className="all-channels">
                        <div className="channels-header" onClick={e => this.toggleMenu('showAllChannels')}>All Channels</div>
                        <div className="channels-search-add" style={{display: this.state.showAllChannels ? 'flex': 'none'}}>
                            <Popup
                                trigger={<div className="add-channel-button"> + </div>}
                                modal
                                closeOnDocumentClick
                            >
                                <div>
                                    <h1 style={{ color: "green", textAlign: 'center' }}> Add Channel </h1>
                                    <hr />
                                    <div>
                                        <div className="container">
                                            <div className="row">
                                                <div className="col">
                                                    <label style={{ color: "black", paddingRight: "10px" }}>Channel Name: </label>
                                                    <input className="addChannelBar" value={this.state.channel_name} type="text" placeholder="Channel to be added" onChange={(e) => this.handleChannel(e.target.value)} />
                                                </div>
                                                <div className="col">
                                                    <label style={{ color: "black", paddingRight: "10px" }}>Channel Description: </label>
                                                    <input className="addChannelBar" value={this.state.channel_description} type="text" maxLength="100" placeholder="Channel Description" onChange={(e) => this.handleDescription(e.target.value)} />
                                                    <span style={{ color: "blue", textAlign: "right", paddingRight: "35px" }}>{count}x</span>
                                                </div>
                                                <button onClick={this.handleAddChannel}>Add</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                            <input 
                                type="text"
                                name="channelFilter"
                                className="channel-filter"
                                placeholder="Filter Channels"
                                value={this.state.channelFilter}
                                onChange={e => this.updateInput(e)}
                            />
                        </div>
                        <Transition
                            transitionName="menu"
                            transitionEnterTimeout={200}
                            transitionLeaveTimeout={200}
                        >

                            {this.state.showAllChannels ?
                                <Transition
                                    transitionName="list"
                                    transitionEnterTimeout={200}
                                    transitionLeaveTimeout={200}
                                >
                                    {this.renderUnsubbedChannels()}
                                </Transition>
                            : null}
                        </Transition>
                    </div>
                </div>
                {this.props.isAuthenticated ?
                    <div className="profile-and-settings">
                        <div><Link to={`/dashboard/profile/${this.props.user.user.id}`}>{this.props.user.user.username}</Link></div>
                        <div><Link to="/dashboard/settings" ><i className="fas fa-cog"></i></Link></div>
                    </div>
                :
                    <div className="profile-and-settings">
                        <h3>Guest</h3>
                    </div>
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    let { user, isAuthenticated, activeDms } = state
    return {
        user,
        isAuthenticated,
        activeDms
    }
}

export default connect(mapStateToProps, { userLoggedOut, populateActiveDms, createAlertMessage })(NavBar);