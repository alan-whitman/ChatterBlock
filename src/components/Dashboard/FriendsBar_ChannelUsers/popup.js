import React, { Component } from 'react';
import './popup.css';

class FriendsPopup extends Component {
    constructor(props){
        super(props);

        this.state = {
            show: false
        }
    }
    deleteFriend(user) {
        this.props.socket.emit('delete friend', user);
    }
    handleClick = (event) => {
        event.preventDefault();
        if (event.type === 'contextmenu') {
            this.setState({ show: true }, () => {
                document.addEventListener('click', this.closeMenu);
                document.addEventListener('contextmenu', this.closeMenu);
            });
        }
    }

    closeMenu = () => {
        this.setState({ show: false }, () => {
          document.removeEventListener('click', this.closeMenu);
          document.removeEventListener('contextmenu', this.closeMenu);
        });
    }

    render(){
        const { friend } = this.props;
        return (
            <div style={{position: 'relative', height: '30px', marginLeft: '15px'}}>
                <h3 onContextMenu={this.handleClick}>{friend.username}</h3><br />
                {this.state.show && <div className="popupmenu">
                    <div className="popup-sections" onClick={() => {this.props.history.push(`/dashboard/profile/${friend.id}`)}}>Profile</div>
                    <div className="popup-sections" onClick={() => {this.props.history.push(`/dashboard/dms/${friend.id}`)}}>Send Message</div>
                    <span onClick={e => this.deleteFriend({id: friend.id, username: friend.username})} className="accept-reject">Remove Friend</span>

                </div>}
            </div>
        )
    }
}

export default FriendsPopup;