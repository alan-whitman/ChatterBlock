import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "./leftnavbar.css";
import { connect } from 'react-redux';
import { userLoggedOut } from '../../../redux/reducer';
import { setChannels } from '../../../redux/reducer';
import axios from 'axios';
import Popup from 'reactjs-popup'

class NavBar extends Component {
  constructor() {
    super()

    this.state = {
      searchInput: "",
      channel_name: ""
    }
  }

  componentDidMount() {
    axios.get('/api/channel/all').then(response => {
      console.log(response.data);
      this.props.setChannels(response.data)
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
        this.props.setChannels(response.data)

        this.setState({
          channel_name: ""
        })
      })
    }
  }

    render(){
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
                    <ul>
                        <Link to="/dashboard/channel" ><li>Rocket League</li></Link>
                        <li>Bumble Bees</li>
                        <li>Why am I coding?</li>
                        <li>Pizza for breakfast</li>
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
                    <ul>
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
                    <input className="searchInput" type="text" placeholder="Find Channel" />    <Popup trigger={<button>Add a Channel</button>} position="bottom left">
      <input type="text" placeholder="Channel to be added" onChange={(e) => this.handleChannel(e.target.value)} onKeyUp={this.handleAddChannel} />
    </Popup>
                    <ul>
                        <li>Bullying</li>
                        <li>Dogs</li>
                        <li>Vacation Destinations</li>
                        <li>Wasp Stings</li>
                        <li>Disney Movies</li>
                        <li>Pubg</li>
                        <li>Fencing</li>
                        <li>Ice Hockey</li>
                        <li>Boating</li>
                        <li>Fine Dining</li>
                    </ul>
                </div>
              </div>
            </div>
          </div>
                {this.props.isAuthenticated ? <div className="profileAndSettings">
                    <Link to="/dashboard/profile" >{this.props.user.username}</Link>
                    <Link to="/dashboard/settings" ><i className="fas fa-cog"></i></Link>
                </div>: <div className="profileAndSettings">
                    <h3>Guest</h3>
                </div>}
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
  
export default connect(mapStateToProps, { userLoggedOut, setChannels })(NavBar);