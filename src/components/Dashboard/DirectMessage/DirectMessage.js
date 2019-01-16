import React, { Component } from 'react';
import { connect } from 'react-redux';
import './DirectMessage.css';

class DirectMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            messageInput: '',
            dmPartner: {}
        }
        this.props.socket.on('send initial dm response', initialResponse => {
            if (initialResponse === -1) {
                this.setState({messages: [{sender: 'no one', content_text: 'user does not exist'}]})
            } else
                this.setState({ messages: initialResponse.existingMessages, dmPartner: initialResponse.dmPartner });
        });
        this.props.socket.on('relay direct message', newMessage => {
            let { messages } = this.state;
            messages.push(newMessage);
            this.setState({ messages });
        });
        this.messageWindowRef = React.createRef();
    }
    componentDidMount() {
        this.props.socket.emit('join direct message', this.props.match.params.username);
    }
    renderMessages() {
        return this.state.messages[0] ?
            this.state.messages.map((message, i) =>
                <div key={i} className="user-message">
                    <h6 style={{ fontWeight: 'bold' }}>
                        <span>Sender: {message.sender}</span><br />
                        {message.content_text}
                    </h6>
                </div>
            )
        :
            <p>No direct messages to show</p>
    }
    sendMessage() {
        const { messageInput, messages } = this.state;
        if (messageInput.trim() === '')
            return;
        if (!this.state.dmPartner.id)
            return;
        this.props.socket.emit('send direct message', messageInput, this.state.dmPartner.id);
        messages.push({
            content_text: messageInput,
            sender: this.props.user.user.username
        })
        this.setState({ messageInput: '', messages });
    }
    updateInput(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }
    componentDidUpdate() {
        this.messageWindowRef.current.scrollTop = this.messageWindowRef.current.scrollHeight;
    }
    render() {
        return (
            <div className="DirectMessage">
                <div className="header">
                    <h2 style={{ color: 'white' }}>{this.props.match.params.channelName}</h2>
                    <div><input className="searchInput" type="text" placeholder="Search Users" /> <span><i className="fas fa-search"></i></span></div>
                </div>
                <div className="messages" ref={this.messageWindowRef}>
                    {!this.props.isAuthenticated ?
                        <p>You must be logged in to send and receive direct messages</p>
                        :
                        this.renderMessages()
                    }
                </div>
                <div className="input-holder">
                    <input
                        className="input-bar"
                        type="text"
                        placeholder="New Message"
                        name="messageInput"
                        value={this.state.messageInput}
                        onChange={e => this.updateInput(e)}
                        onKeyPress={e => { if (e.key === 'Enter') this.sendMessage() }}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { user, isAuthenticated } = state;
    return {
        user,
        isAuthenticated
    }
}

export default connect(mapStateToProps)(DirectMessage);