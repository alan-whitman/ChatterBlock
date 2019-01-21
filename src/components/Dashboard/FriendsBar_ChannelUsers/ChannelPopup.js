import React, { Component } from 'react';
import './ChannelPopup.css';

class FriendsPopup extends Component {
    constructor(props){
        super(props);

        this.state = {
            show: false,
            x: 0,
            y: 0
        }
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

    handleMouse = e => {
        
        this.setState({ x: e.pageX, y: e.pageY })
    }

    render(){
        const { user } = this.props;
        return (
            <div style={{position: 'relative', height: '30px', marginLeft: '15px'}}>
                <h3 style={{fontSize: '15px'}} onMouseDown={e=>this.handleMouse(e)} onContextMenu={this.handleClick}>{user.username}</h3><br />
                {this.state.show && <div className="channel-popupmenu" style={{top: this.state.y, left: `calc(${this.state.x}px - 200px`}}>
                    <div className="channel-popup-sections" onClick={() => {this.props.history.push(`/dashboard/profile/${user.id}`)}}>Profile</div>
                    <div className="channel-popup-sections" onClick={() => {this.props.history.push(`/dashboard/dm/${user.username}`)}}>Send Message</div>
                    <div className="channel-popup-sections" style={{height: '34%'}} onClick={()=> {this.props.socket.emit('request friend', user.username);}} >Send Friend Request</div>
                </div>}
            </div>
        )
    }
}

export default FriendsPopup;