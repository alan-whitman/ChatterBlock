import React, { Component } from 'react';
import './channelview.css';

class ChannelView extends Component {
    render(){
        return (
            <div className="main">
            <div className="header">
                    <div className="header-main">
                        <h2 style={{color: 'white'}}>Channel Name</h2>
                        <div><input className="searchInput" type="text" placeholder="Search Users" /> <span><i className="fas fa-search"></i></span></div>
                    </div>

                </div>
                <div className="textarea container">
                    <div className="user-message">
                            <h6>Username12324 <span className="timestamp"> - 1:30pm</span></h6>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet dicta praesentium quis placeat voluptatem minus quasi omnis repellat accusamus totam voluptate hic, commodi doloremque exercitationem reprehenderit tenetur debitis odio voluptas?</p>
                       
                    </div>
                     </div>
        <div className="message-input">
            
                <input className="main-message" type="text" placeholder="Message Here" />
                
        </div>
        
    </div>
        )
    }
}

export default ChannelView;