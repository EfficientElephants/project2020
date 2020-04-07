/* eslint-disable react/no-unused-state */
import React, {
  Component
} from 'react';
import {
  Button, Container, Form
} from 'react-bootstrap';
import {
  Link
} from 'react-router-dom';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      showError: false,
      messageFromServer: '',
      confirmation: false,
    };

    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
  }

  onChangeEmail(event) {
    this.setState({
      email: event.target.value,
    });
  }

  sendEmail() {
    const { email } = this.state;

    fetch('api/forgotPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
      }),
    })
      .then((res) =>
        res.json())
      .then((json) => {
        if (json.success) {
          this.setState({
            email: json.email,
            showError: false,
            messageFromServer: json.message,
            confirmation: true,
          });
          // this.props.history.push('/');
        } else {
          this.setState({
            showError: true,
            messageFromServer: '',
            confirmation: false,
          });
        }
      });
  }

  render() {
    const { email, confirmation, showError } = this.state;

    return (
      <div>
        <Container>
          <Form>
            <h1>Forgot Password</h1>
            <Form.Group>
              <Form.Label>Email: </Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={this.onChangeEmail}
              />
            </Form.Group>
            <Form.Group>
              <Button onClick={this.sendEmail}>
                Let&apos;s Go!
              </Button>
            </Form.Group>
            <Link to="/">Go home</Link>
          </Form>
        </Container>

        {showError && (
        <div>
          <p>
            That email address does not exist. Try again or make
            a new account.
          </p>
          <Link to="/signup">Don&apos;t have an account?</Link>
        </div>
        )}

        {confirmation && (
        <div>
          <p>
            Password reset email successfully sent! If you do
            not see it, check your spam folder.
          </p>
          <Link to="/">Sign in</Link>
        </div>
        )}
      </div>
    );
  }
}

export default ForgotPassword;
