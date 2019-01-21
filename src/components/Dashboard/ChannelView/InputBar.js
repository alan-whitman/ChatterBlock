import React, { Component } from 'react';
import { connect } from 'react-redux';

class InputBar extends Component {
    state = {
        messageInput: ''
    }
    updateInput(e) {
        const { name, value } = e.target;
        this.setState({[name]: value});
    }
    clearInput() {
        this.setState({messageInput: ''});
    }
    render() {
        return (
            <input
                className="input-bar"
                type="text"
                placeholder={this.props.isAuthenticated ? 'New Message' : 'Please log in or register to send messages'}
                name="messageInput"
                value={this.props.isAuthenticated ? this.state.messageInput : ''}
                onChange={e => this.updateInput(e)}
                maxLength="400"
                onKeyPress={
                    e => {
                        if (e.key === 'Enter') {
                            this.props.sendMessage(this.state.messageInput);
                            this.clearInput();
                        }
                    }
                }
            />
        )
    }
}

const mapStateToProps = state => {
    const { isAuthenticated } = state;
    return {
        isAuthenticated
    }
}

export default connect(mapStateToProps)(InputBar);