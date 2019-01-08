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
                    <div>Title Here</div>
                    <Link to="/dashboard"><h1>Continue as Guest</h1></Link>
                </div></div>}
            </div>
        )
    }
}

export default Landing;