import React, { Component } from 'react';
import { connect } from 'react-redux'
import './channelview.css';

class ChannelView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            channelId: -1,
            messageInput: ''
        }
        this.messageWindowRef = React.createRef();
        this.props.socket.on('send initial response', initialResponse => {
            this.setState({ messages: initialResponse.existingMessages, channelId: initialResponse.channelId });
        });
        this.props.socket.on('new message', newMessage => {
            let { messages } = this.state
            messages.push(newMessage);
            this.setState({ messages });
        })
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
    updateInput(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });

    }
    sendMessage() {
        if (this.state.messageInput.trim()) {
            let { messages } = this.state;
            const message = {
                contentText: this.state.messageInput,
                channelId: this.state.channelId
            }
            this.props.socket.emit('create message', message);
            const localMessage = {
                content_text: this.state.messageInput,
                content_image: null,
                time_stamp: Date.now(),
                username: this.props.user.user.username,
                user_image: null

            }
            messages.push(localMessage);
            this.setState({ messageInput: '', messages })
        }
    }
    render() {
        return (
            <div className="ChannelView">
                <div className="header">
                    <div className="header-main">
                        <h2 style={{ color: 'white' }}>{this.props.match.params.channelName}</h2>
                        <div><input className="searchInput" type="text" placeholder="Search Users" /> <span><i className="fas fa-search"></i></span></div>
                    </div>
                </div>
                <div className="textarea container" ref={this.messageWindowRef}>
                    {this.renderMessages()}
                </div>
                <div className="message-input">
                    {/* {this.props.isAuthenticated ? */}
                    <input
                        className="main-message"
                        type="text"
                        placeholder="New Message"
                        name="messageInput"
                        value={this.state.messageInput}
                        onChange={e => this.updateInput(e)}
                        onKeyPress={e => { if (e.key === 'Enter') this.sendMessage() }}
                    />
                    {/* : null} */}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    let { isAuthenticated, user } = state;
    return {
        user,
        isAuthenticated
    }
}


export default connect(mapStateToProps)(ChannelView);