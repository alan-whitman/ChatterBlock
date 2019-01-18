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
            subChannels: [],
            open: false,
            subChannelIds:[],
            channel_description: ''
        }
        this.props.socket.on('relay direct message', newMessage => {
            let activeDms = [...this.props.activeDms];
            let { sender } = newMessage
            if (activeDms.indexOf(sender) === -1) {
                activeDms.push(sender);
                activeDms.sort();
                this.props.populateActiveDms(activeDms);
            }
        });
    }

    componentDidMount() {

        axios.get('/api/channel/all/subscribed/message/count', this.props.user.id).then(response => {
            let subId = []
            response.data.forEach( data => subId.push(data.id))
            this.setState({
                subChannels: response.data,
                subChannelIds: subId
            })
        }).catch(err => { console.log(`Error! Did not get all Channels! ${err}`) })
        
        axios.get('/api/channel/all').then(response => {
            this.setState({
                channels: response.data
            })
        }).catch(err => { console.log(`Error! Did not get all Channels! ${err}`) })

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
    handleSubChannel = (id,i) =>{
        let channels = this.state.channels
        channels.splice(i,1)
        axios.post(`/api/channel/follow/${id}`).then( () => {axios.get('/api/channel/all/subscribed/message/count', this.props.user.id).then(response => {
            let subId = []
            response.data.forEach( data => subId.push(data.id))
            this.setState({
                subChannels: response.data,
                subChannelIds: subId
            })
        }).catch(err => { console.log(`Error! Did not get all Channels! ${err}`) })})
    }
    handleUnSubChannel = (id,i) => {
        let subChannels = this.state.subChannels
        let subChannelIds = this.state.subChannelIds
        subChannelIds.splice(i,1)
        axios.delete(`/api/channel/unfollow/${id}`).then( () => {axios.get('/api/channel/all').then(response => {
            this.setState({
                channels: response.data,
                subChannelIds: subChannelIds
            })
        }).catch(err => { console.log(`Error! Did not get all Channels! ${err}`) })})
        subChannels.splice(i,1)
        this.setState({
            subChannels
        })
    }
    handleAddChannel = (e) => {
            axios.post('/api/channel/new', this.state).then(response => {
                this.setState({
                    channels: [...this.state.channels, response.data],
                    channel_name: "",
                    channel_description: ""

                })
            })
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


//     render() {
//         const { channels, searchInput, subChannels } = this.state;
//         const channelDisplay = channels.filter(channel => {
//             return channel.channel_name.toLowerCase().includes(searchInput.toLowerCase());
//         }).map((channel, i) => {
// <<<<<<< HEAD
//             return <div key={channel.id} className="channel-list"><Link to={`/dashboard/channel/${channel.channel_name}`} className="channel-link"><h4 className="channel-name"  onContextMenu={(e) => this.openModal(e)}>{channel.channel_name}</h4><Popup
//             open={this.state.open}
//             closeOnDocumentClick
//             onClose={this.closeModal}
//           >
//               <p style={{ color: "purple"}}>{channel.channel_description}</p>

       
//           </Popup></Link></div>
//         })
//         const subChannelsDisplay = subChannels.map(channel => {
//             return <div key={channel.id} className="channel-list"><Link to={`/dashboard/channel/${channel.channel_name}`} className="channel-link"><h4 className="channel-name">{channel.channel_name}</h4> {channel.count > 0 ? <p className="unseen-channel-messages">{channel.count}</p> : false}</Link></div>
// =======
//             return (
//             this.state.subChannelIds.indexOf(channel.id) === -1 ? 
//             <div key={channel.id} className="channel-list"><Link to={`/dashboard/channel/${channel.channel_url}`} className="channel-link"><h4 className="channel-name">{channel.channel_name}</h4></Link>
//             <div className="sub" onClick={e => this.handleSubChannel(channel.id,i)}>+</div>
//             </div> : null
//             )
// >>>>>>> master
//         })

//         const subChannelsDisplay = subChannels.map((channel,i) => {
//             return <div key={channel.id} className="channel-list"><Link to={`/dashboard/channel/${channel.channel_url}`} className="channel-link"><h4 className="channel-name">{channel.channel_name}</h4> {channel.count > 0 ? <p className="unseen-channel-messages">{channel.count}</p> : false}</Link><div className="unSub" onClick={e => this.handleUnSubChannel(channel.id,i)}>-</div></div>
//         })

render() {
    const { channels, searchInput, subChannels } = this.state;
    const channelDisplay = channels.filter(channel => {
        return channel.channel_name.toLowerCase().includes(searchInput.toLowerCase());
    }).map((channel, i) => {
        return (
        this.state.subChannelIds.indexOf(channel.id) === -1 ? 
        <div key={channel.id} className="channel-list"><Link to={`/dashboard/channel/${channel.channel_url}`} className="channel-link"><h4 className="channel-name">{channel.channel_name}</h4></Link>
        <div className="sub" onClick={e => this.handleSubChannel(channel.id,i)}>+</div>
        </div> : null
        )
    })

    const subChannelsDisplay = subChannels.map((channel,i) => {
        return <div key={channel.id} className="channel-list"><Link to={`/dashboard/channel/${channel.channel_url}`} className="channel-link"><h4 className="channel-name">{channel.channel_name}</h4> {channel.count > 0 ? <p className="unseen-channel-messages">{channel.count}</p> : false}</Link><div className="unSub" onClick={e => this.handleUnSubChannel(channel.id,i)}>-</div></div>
    })

        let count = 100;

        count -= this.state.channel_description.length;

     
        return (
            <div className="NavBar" id="NavBar">
                <div className="nav-top">
                    <div className="navLogo">{this.props.isAuthenticated ? <Link to="/dashboard"><h2>Logo Here</h2></Link> : <Link to="/"><h2>Logo Here</h2></Link>}</div>

                    <div className="accordion" id="accordionExample">
                        {this.props.isAuthenticated ?
                            <div className="card">
                                <div className="card-header" id="headingOne">
                                    <h2 className="mb-0">
                                        <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="">
                                            Active Channels
                                </button>
                                    </h2>
                                </div>
                                <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                                    <div className="card-body">
                                        <ul className="leftbarUL">
                                            {subChannelsDisplay}
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
                                        closeOnDocumentClick>
                                        <h1 style={{color: "green", textAlign: 'center'}}> Add Channel </h1>
                                        <hr />
                                        <div>
                                        
                                       <div className="container">
                                        <div className="row">
                                        <div className="col">                                        
                                            <label style={{color: "black", paddingRight: "10px"}}>Channel Name: </label>
                                            <input className="addChannelBar" value={this.state.channel_name} type="text" placeholder="Channel to be added" onChange={(e) => this.handleChannel(e.target.value)}  />
                                        </div>
                                        <div className="col">
                                        
                                            <label style={{color: "black", paddingRight: "10px"}}>Channel Description: </label>
                                            <input className="addChannelBar" value={this.state.channel_description} type="text" maxLength="100" placeholder="Channel Description" onChange={(e) => this.handleDescription(e.target.value)}/>
                                            <span style={{ color: "blue", textAlign: "right", paddingRight: "35px"}}>{count}x</span>
                                        </div>

                                        <button onClick={this.handleAddChannel}>Add</button>
                                        </div>
                                        </div>
                                        </div>

                                    </Popup></span><br /><br />
                                    <ul className="leftbarUL">
                                        {channelDisplay}
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