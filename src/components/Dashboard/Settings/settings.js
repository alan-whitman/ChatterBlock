import React, { Component } from 'react';
import { connect } from 'react-redux';
import { userLoggedOut, userEdit } from '../../../redux/reducer';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

class Settings extends Component {
    constructor(){
        super()

        this.state = {
            edit: false,
            username: '',
            email: '',
            about_text: '',
            user_image: ''
        }
    }

    componentDidMount(){
        const { username, email, about_text, user_image} = this.props.user
        this.setState({
            username,
            email,
            about_text,
            user_image
        })
    }

    handleClickLogout = () => {
        axios.get('/auth/logout').then(response => {
            this.props.userLoggedOut()
        })
    }

    handleClickUpdate = () => {
        axios.put(`/auth/update/${this.props.user.id}`, this.state).then(response => {
            this.props.userEdit(response.data)
        })
    }

    toggleEdit = () => {
        this.setState({
            edit: !this.state.edit
        })
    }

    handleChange = e => {
        let { name, value } = e.target
    
        this.setState({
          [name]: value
        })
    }

    render(){
        return (
            <div className="main">
                {this.props.isAuthenticated ? <div>
                    <h1>Settings</h1>
                    <button onClick={this.handleClickLogout}>Logout</button>

                    <button onClick={this.toggleEdit}>Edit Profile</button>
                    {this.state.edit && <div>
                        <input name="username" onChange={this.handleChange} value={this.state.username}></input>
                        <input name="email" onChange={this.handleChange} value={this.state.email}></input>
                        <input name="about_text" onChange={this.handleChange} value={this.state.about_text} placeholder="About you"></input>
                        <input name="user_image" onChange={this.handleChange} value={this.state.user_image} placeholder="Profile Picture Url"></input>
                        <button onClick={this.handleClickUpdate}>Save Changes</button>
                    </div>}
                </div> : <Redirect to="/" /> }
            </div>
        )
    }
}

function mapStateToProps(state) {
    let { user, isAuthenticated } = state
    return {
      user, isAuthenticated
    }
  }
  
export default connect(mapStateToProps, { userLoggedOut, userEdit })(Settings);