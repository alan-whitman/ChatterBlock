import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "./leftnavbar.css";

class NavBar extends Component {
    render(){
        return (
            <div className="nav-container">
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
                        <li>Rocket League</li>
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
                        <li>Brian</li>
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
                    <input type="text" placeholder="Find Channel" />
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
          <div className="settings">
                <Link to="/dashboard/profile" ><h3>Username</h3></Link>
                <Link to="/dashboard/settings" ><i className="fas fa-cog"></i></Link>
          </div>
    </div>
            // <div className="leftBar">
            //     <div className="stillLeftBar">
            //         <div className="navLogo"><Link to="/">Logo Here</Link><Link to="/dashboard">Recent</Link></div>

            //         <div className="activeChannels"><h3>Active channels</h3></div>

            //         <div className="dms"><Link to="/dashboard/dms" ><button>Private Messaging</button></Link></div>

            //         <div className="channels"><Link to="/dashboard/channel" ><button>Channels</button></Link></div>

            //         <div className="profileAndSettings">
            //             <Link to="/dashboard/profile" ><h3>Username</h3></Link>
            //             <Link to="/dashboard/settings" ><i className="fas fa-cog"></i></Link>
            //         </div>
            //     </div>
                
            // </div>
        )
    }
}

export default NavBar;