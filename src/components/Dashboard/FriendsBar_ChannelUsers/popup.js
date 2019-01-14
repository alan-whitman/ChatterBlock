import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Popup extends Component {
    constructor(){
        super()

        this.state = {
            show: false
        }
    }

    handleClick = (event) => {
        event.preventDefault();
        if (event.type === 'click') {
            this.props.history.push('/dashboard/profile')
        } else if (event.type === 'contextmenu') {
            
            this.setState({ show: true }, () => {
                document.addEventListener('click', this.closeMenu);
            });
        }
    }

    closeMenu = () => {
        this.setState({ show: false }, () => {
          document.removeEventListener('click', this.closeMenu);
        });
    }

    render(){
        const { friend } = this.props;
        return (
            <div style={{position: 'relative'}}>
                <h3 onContextMenu={this.handleClick}>{friend.username}</h3><br />
                {this.state.show && <div className="popupmenu"><Link to={`/dashboard/profile/${friend.id}`}>{friend.username}</Link>
                <br /><span onClick={e => this.props.deleteFriend({id: friend.id, username: friend.username})} className="accept-reject">Delete</span></div>}
            </div>
        )
    }
}

export default Popup;