import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "./leftnavbar.css";
import { connect } from 'react-redux';
import { userLoggedOut } from '../../../redux/reducer';

class NavBar extends Component {
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
                    <input class="searchInput" type="text" placeholder="Find Channel" />
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
  
export default connect(mapStateToProps, { userLoggedOut })(NavBar);