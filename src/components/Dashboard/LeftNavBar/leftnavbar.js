import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "./leftnavbar.css";
import { connect } from 'react-redux';
import { userLoggedOut, populateActiveDms } from '../../../redux/reducer';
import axios from 'axios';
import Popup from 'reactjs-popup'

class NavBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchInput: "",
            channel_name: "",
            channels: [],
            open: false,
            channel_description: ''
        };
        this.props.socket.on('relay direct message', newMessage => {
            let activeDms = [...this.props.activeDms];
            let { sender } = newMessage
            if (activeDms.indexOf(sender) === -1) {
                activeDms.push(sender);
                activeDms.sort();
                this.props.populateActiveDms(activeDms);
            }
        });
        this.props.socket.on('successfully subbed to channel', channelId => {
           let { channels } = this.state;
           const channelIndex = channels.findIndex(channel => channel.id === channelId);
           if (channelIndex !== -1) {
                channels[channelIndex].subbed = true;
                this.setState({channels});
           }
        });
        this.props.socket.on('successfully unsubbed to channel', channelId => {
            let { channels } = this.state;
            const channelIndex = channels.findIndex(channel => channel.id === channelId);
            if (channelIndex !== -1) {
                 channels[channelIndex].subbed = false;
                 this.setState({channels});
            }
        });
        this.props.socket.on('channel creation error', error => {
            console.log(error);
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
            const channels = res.data.map(channel => {
                return {
                    id: channel.id,
                    channel_name: channel.channel_name,
                    channel_url: channel.channel_url,
                    channel_description: channel.channel_description,
                    last_view_time: channel.last_view_time,
                    creator_id: channel.creator_id,
                    subbed: channel.user_id ? true : false
                }
            });
            this.setState({channels});
        }).catch(err => console.error(err));
        axios.get('/api/dm/getActiveDms').then(response => {
            this.props.populateActiveDms(response.data.map(user => user.username));
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
        // axios.post('/api/channel/new', this.state).then(response => {
        //     this.setState({
        //         channels: [...this.state.channels, response.data],
        //         channel_name: "",
        //         channel_description: ""

        //     })
        // })
    }
    handleSearch = (val) => {
        this.setState({
            searchInput: val
        })
    }
    renderDms() {
        return this.props.activeDms.map((user, i) =>
            <li key={i}><Link to={`/dashboard/dm/${user}`}>{user}</Link></li>
        )
    }
    openModal = (e) => {
        e.preventDefault()
        this.setState({ open: true })
    }
    closeModal = () => {
        this.setState({ open: false })
    }
    renderSubbedChannels() {
        return this.state.channels
            .filter(channel => channel.subbed)
            .sort ((a, b) => a.channel_name < b.channel_name ? -1 : 1)
            .map((channel, i) =>
                <div key={i} className="channel-list">
                    <Link to={`/dashboard/channel/${channel.channel_url}`} className="channel-link">
                        <h4 className="channel-name">{channel.channel_name}</h4> 
                            {channel.count > 0 ? 
                                <p className="unseen-channel-messages">{channel.count}</p> 
                            : null}
                    </Link>
                    <div className="unSub" onClick={e => this.handleUnSubChannel(channel.id)}>-</div>
                </div>
            )
    }
    renderUnsubbedChannels() {
        return this.state.channels
            .filter(channel => !channel.subbed)
            .sort ((a, b) => a.channel_name < b.channel_name ? -1 : 1)
            .map((channel, i) => 
                <div key={i} className="channel-list">
                    <Link to={`/dashboard/channel/${channel.channel_url}`} className="channel-link">
                        <h4 className="channel-name">{channel.channel_name}</h4>
                    </Link>
                    <div className="sub" onClick={e => this.handleSubChannel(channel.id)}>+</div>
                </div>
            )
    }
    render() {
        let count = 100;
        count -= this.state.channel_description.length;
        return (
            <div className="NavBar" id="NavBar">
                <div className="nav-top">
                    <div className="navLogo">{this.props.isAuthenticated ? <Link to="/dashboard"><h2>ChatterBlock</h2></Link> : <Link to="/"><h2>ChatterBlock</h2></Link>}</div>
                    <div className="accordion" id="accordionExample">
                        {this.props.isAuthenticated ?
                            <div className="card">
                                <div className="card-header" id="headingOne">
                                    <h2 className="mb-0">
                                        <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="">
                                            Subscribed Channels
                                        </button>
                                    </h2>
                                </div>
                                <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                                    <div className="card-body">
                                        <ul className="leftbarUL">
                                            {this.renderSubbedChannels()}
                                        </ul>
                                    </div>
                                </div>
                            </div> : <div></div>}
                        {this.props.isAuthenticated ?
                            <div className="card">
                                <div className="card-header" id="headingTwo">
                                    <h2 className="mb-0">
                                        <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                            Direct Messages
                                </button>
                                    </h2>
                                </div>
                                <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                                    <div className="card-body">
                                        <ul className="leftbarUL">
                                            {this.renderDms()}
                                        </ul>
                                    </div>
                                </div>
                            </div> : <div></div>}

                        <div className="card">
                            <div className="card-header" id="headingThree">
                                <h2 className="mb-0">
                                    <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                        Channels
                                </button>
                                </h2>
                            </div>
                            <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
                                <div className="card-body">
                                    <input className="searchInput" type="text" value={this.state.searchInput} onChange={(e) => this.handleSearch(e.target.value)} placeholder="Find Channel" />

                                    <span className="addChannel">
                                        <Popup
                                            trigger={<button className="button"> + </button>}
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
                                    </span>
                                    <br /><br />
                                    <ul className="leftbarUL">
                                        {this.renderUnsubbedChannels()}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.props.isAuthenticated ?
                    <div className="profileAndSettings">
                        <Link to={`/dashboard/profile/${this.props.user.user.id}`} >{this.props.user.user.username}</Link>
                        <Link to="/dashboard/settings" ><i className="fas fa-cog"></i></Link>
                    </div> :
                    <div className="profileAndSettings">
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

export default connect(mapStateToProps, { userLoggedOut, populateActiveDms })(NavBar);