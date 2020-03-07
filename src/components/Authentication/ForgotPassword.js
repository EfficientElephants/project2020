import React, { Component } from "react";
import { Button, Container, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';


class ForgotPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            showError: false,
            messageFromServer: '',
        }

        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.sendEmail = this.sendEmail.bind(this);
    }

    onChangeEmail(event) {
        this.setState({
            email: event.target.value
        });
    }

    sendEmail() {
        let {
            email
        } = this.state

        fetch('api/forgotPassword', {
            method: 'POST',
            headers: {
                // 'Accept': 'application/json',
                'Content-Type': 'application/json'
            },    
            body: JSON.stringify({
                email: email,
            }),
        })
        // .then(res => res.text())
        // .then(text => console.log(text))
        .then(res => res.json())
        .then(json => {
            console.log('forgotPassword: ', json.email)
            if (json.success) {
                this.setState({
                    email: json.email,
                    showError: false,
                    messageFromServer: json.message
                });
            } else {
                this.setState({
                    showError: true,
                    messageFromServer: ''
                });
            }
        });
    }

    render() {
        const { email, messageFromServer, showError } = this.state;
    
        return (
            <div>
            <Container>
                <Form>
                    <h1>Forgot Password</h1>
                    <Form.Group>
                        <Form.Label>Email: </Form.Label>
                        <Form.Control type="email" value={email} onChange={this.onChangeEmail}/>
                    </Form.Group>
                    <Form.Group>
                        <Button onClick={this.sendEmail}>Let's Go!</Button>
                    </Form.Group>
                </Form>
            </Container>

            {showError && (
                <div>
                    <p>That email address does not exist. Try again or make a new account.</p>
                    <Link to="/signup">Don't have an account?</Link>
                </div>
                )
            }
            {
                (messageFromServer) ? (
                    <p>Password reset email successfully sent!</p>
                ) : (null)
            }
            </div>
        )
    }
}

export default ForgotPassword;