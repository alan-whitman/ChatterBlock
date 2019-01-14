import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "./leftnavbar.css";
import { connect } from 'react-redux';
import { userLoggedOut } from '../../../redux/reducer';
import axios from 'axios';
import Popup from 'reactjs-popup'

class NavBar extends Component {
  constructor() {
    super()

    this.state = {
      searchInput: "",
      channel_name: "",
      channels: [],
      subChannels: []
    }
  }

  componentDidMount() {

    axios.get('/api/channel/all/subscribed/message/count',this.props.user.id).then(response => {
      console.log(response.data);
      this.setState({
        subChannels: response.data
      })
    }).catch(err => {console.log(`Error! Did not get all Channels! ${err}`)})

    axios.get('/api/channel/all').then(response => {
      console.log(response.data);
      this.setState({
        channels: response.data
      })
    }).catch(err => {console.log(`Error! Did not get all Channels! ${err}`)})
  }

  handleChannel = (val) => {
    this.setState({
      channel_name: val
    })
  }


 

  

  handleAddChannel = (e) => {

    if(e.keyCode === 13){
      axios.post('/api/channel/new', this.state).then(response => {

        this.setState({
          channels: [...this.state.channels, response.data],
          channel_name: ""
        })
      })
    }
  }

  handleSearch = (val) => {
    this.setState({
      searchInput: val
    })
  }





    render(){
      const { channels, searchInput, subChannels } = this.state;
      
      const channelDisplay = channels.filter(channel => {
        return channel.channel_name.toLowerCase().includes(searchInput.toLowerCase());
      }).map((channel, i) => {
        return <li key={i}>{channel.channel_name}</li>
      })
      const subChannelsDisplay = subChannels.map(channel => {
        return <li>{channel.channel_name} {channel.count}</li>
      })
        return (
            <div className="nav-container">
            <div className="navLogo"><h2>Logo Here</h2>{this.props.isAuthenticated ? <Link to="/dashboard">Recent</Link> : <Link to="/">Home</Link>}</div>
        <div className="accordion" id="accordionExample">
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
            </div>
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
                        <Link to="/dashboard/dms"><li>Brian</li></Link>
                        <li>Alan</li>
                        <li>Heather</li>
                        <li>Jack</li>
                    </ul>
                </div>
              </div>
            </div>
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
                    <span className="addChannel"><Popup trigger={<button>+</button>} position="top left">
                    <input value={this.state.channel_name} type="text" placeholder="Channel to be added" onChange={(e) => this.handleChannel(e.target.value)} onKeyUp={this.handleAddChannel} />
                     </Popup></span>
    <br />
    <br />
                    <ul className="leftbarUL">
                        {channelDisplay}
                    </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="settings">
                {this.props.isAuthenticated ? <div className="profileAndSettings">
                    <Link to={`/dashboard/profile/${this.props.user.id}`} >{this.props.user.username}</Link>
                    <Link to="/dashboard/settings" ><i className="fas fa-cog"></i></Link>
                </div>: <div className="profileAndSettings">
                    <h3>Guest</h3>
                </div>}
          </div>    
          </div>
        )
    }
}

function mapStateToProps(state) {
    let { user, isAuthenticated } = state
    return {
      user, isAuthenticated
    }
  }
  
export default connect(mapStateToProps, { userLoggedOut })(NavBar);