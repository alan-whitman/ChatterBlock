import React, { Component } from 'react';
import { connect } from 'react-redux'
import './channelview.css';

class ChannelView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            channelId: -1
        }
        this.messageWindowRef = React.createRef();
        this.props.socket.on('send initial response', initialResponse => {
            console.log(initialResponse);
            this.setState({messages: initialResponse.existingMessages, channelId: initialResponse.channelId});
        });
    }
    componentWillMount() {
        const { channelName } = this.props.match.params;
        this.props.socket.emit('join channel', channelName);
    }
    componentDidUpdate() {
        // scroll message window to bottom
        this.messageWindowRef.current.scrollTop = this.messageWindowRef.current.scrollHeight;
    }
    renderMessages() {
        return this.state.messages.map((message, i) =>
            <div className="user-message" key={i}>
                <h6>{message.username} <span className="timestamp"> - {message.time_stamp}</span></h6>
                <p>{message.content_text}</p>
            </div>
        );
    }
    render(){
        return (
            <div className="main">
                <div className="header">
                    <div className="header-main">
                        <h2 style={{color: 'white'}}>{this.props.match.params.channelName}</h2>
                        <div><input className="searchInput" type="text" placeholder="Search Users" /> <span><i className="fas fa-search"></i></span></div>
                    </div>
                </div>
                <div className="textarea container" ref={this.messageWindowRef}>
                    {this.renderMessages()}
                </div>
                <div className="message-input">
                    {/* {this.props.isAuthenticated ? */}
                        <input className="main-message" type="text" placeholder="Message Here" />
                    {/* : null} */}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    let { isAuthenticated } = state;
    return {
        isAuthenticated
    }
}


export default connect(mapStateToProps)(ChannelView);