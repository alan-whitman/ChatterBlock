import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import './landing.css';

class Landing extends Component {
    constructor(){
        super()

        this.state ={ 
            isAuthenticated: false
        }
    }

    render(){
        return (
            <div>
                {this.state.isAuthenticated ? <Redirect to="/dashboard" /> : <div>
                <header className="landingHeader">
                    <h1>Logo Here</h1>
                    <section className="LoginBar">
                        <h1>Login: </h1>
                        <input type="text" placeholder="email" />
                        <input type="password" placeholder="password" />
                        <button>submit</button>
                    </section>
                </header>

                <div className="landingBody">
                    <h2>Title Here</h2>
                    <div className="sideways">
                        <div className="registrationForm">
                            <h2>Registration</h2>
                            <input placeholder="username" />
                            <input placeholder="email" />
                            <input placeholder="password" />
                            <input placeholder="confirm password" />
                            <button>submit</button>
                        </div>

                        <div className="divider"/>

                        <div className="whyRegister">
                            <p>
                                You should register because...
                            </p>
                            <Link to="/dashboard"><h1>Continue as Guest</h1></Link>
                        </div>
                    </div>

                </div></div>}
            </div>
        )
    }
}

export default Landing;