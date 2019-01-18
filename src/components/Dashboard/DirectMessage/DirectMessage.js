import React, { Component } from 'react';
import { connect } from 'react-redux';
import { populateActiveDms } from '../../../redux/reducer';
import './DirectMessage.css';
import axios from 'axios';

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
    componentDidUpdate(prevProps) {
        if (prevProps.match.params.username !== this.props.match.params.username) {
            this.props.socket.emit('join direct message', this.props.match.params.username);
        }
        this.messageWindowRef.current.scrollTop = this.messageWindowRef.current.scrollHeight;
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
        });
        let activeDms = [...this.props.activeDms];
        if (activeDms.indexOf(this.state.dmPartner.username) === -1) {
            activeDms.push(this.state.dmPartner.username);
            activeDms.sort();
            this.props.populateActiveDms(activeDms);
        }
        this.setState({ messageInput: '', messages });
    }
    hideConversation() {
        let activeDms = [...this.props.activeDms];
        activeDms = activeDms.filter(username => username !== this.props.match.params.username);
        this.props.populateActiveDms(activeDms);
        axios.delete('/api/dm/hideDm/' + this.state.dmPartner.id);

    }
    updateInput(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
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
    render() {
        const friendIndex = this.props.friends.findIndex(friend => friend.username === this.props.match.params.username);
        let indicatorColor
        if (friendIndex !== -1)
            indicatorColor = this.props.friends[friendIndex].online ? 'green' : 'red';
        return (
            <div className="DirectMessage">
                <div className="header">
                    <h2 style={{ color: 'white' }}>{this.props.match.params.username}</h2>
                    <div>
                        {/* <input className="searchInput" type="text" placeholder="Search Users" />  */}
                        {/* <span><i className="fas fa-search"></i></span> */}
                    </div>
                    {this.props.activeDms.indexOf(this.props.match.params.username) !== -1 ?
                        <button onClick={e => this.hideConversation()}>Hide</button>
                    : null}
                    {friendIndex !== -1 ?
                        <div className="online-indicator" style={{backgroundColor: indicatorColor}} />
                    : null}
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
    const { user, isAuthenticated, activeDms, friends } = state;
    return {
        user,
        isAuthenticated,
        activeDms,
        friends
    }
}

export default connect(mapStateToProps, {populateActiveDms})(DirectMessage);