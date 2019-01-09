import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "./leftnavbar.css";
import { connect } from 'react-redux';
import { userLoggedOut } from '../../../redux/reducer';

class NavBar extends Component {
    render(){
        return (
            <div className="leftBar">
                <div className="stillLeftBar">
                    <div className="navLogo"><h2>Logo Here</h2>{this.props.isAuthenticated ? <Link to="/dashboard">Recent</Link> : <Link to="/">Home</Link>}</div>

                    <div className="activeChannels"><h3>Active channels</h3></div>

                    <div className="dms"><Link to="/dashboard/dms" ><button>Private Messaging</button></Link></div>

                    <div className="channels"><Link to="/dashboard/channel" ><button>Channels</button></Link></div>

                    {this.props.isAuthenticated ? <div className="profileAndSettings">
                        <Link to="/dashboard/profile" >{this.props.user.username}</Link>
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