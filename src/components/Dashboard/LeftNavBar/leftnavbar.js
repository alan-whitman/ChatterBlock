import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "./leftnavbar.css";
import { connect } from 'react-redux';
import { userLoggedOut } from '../../../redux/reducer';

class NavBar extends Component {
    render(){
        console.log(this.props.user)
        return (
            <div className="leftBar">
                <div className="stillLeftBar">
                    <div className="navLogo"><Link to="/">Logo Here</Link><Link to="/dashboard">Recent</Link></div>

                    <div className="activeChannels"><h3>Active channels</h3></div>

                    <div className="dms"><Link to="/dashboard/dms" ><button>Private Messaging</button></Link></div>

                    <div className="channels"><Link to="/dashboard/channel" ><button>Channels</button></Link></div>

                    <div className="profileAndSettings">
                        <Link to="/dashboard/profile" >{this.props.user.username}</Link>
                        <Link to="/dashboard/settings" ><i className="fas fa-cog"></i></Link>
                    </div>
                </div>
                
            </div>
        )
    }
}

function mapStateToProps(state) {
    let { user } = state
    return {
      user
    }
  }
  
export default connect(mapStateToProps, { userLoggedOut })(NavBar);