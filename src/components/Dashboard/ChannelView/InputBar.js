import React, { Component } from 'react';

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
                placeholder="New Message"
                name="messageInput"
                value={this.state.messageInput}
                onChange={e => this.updateInput(e)}
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

export default InputBar;