import React, {
  Component
} from 'react';
import {
  Button, Container, Form, Alert
} from 'react-bootstrap';
import {
  Link
} from 'react-router-dom';
import Logo from '../../assets/expense-elephant-logo2.png';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      showError: false,
      confirmation: false
    };

    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
  }

  onChangeEmail(event) {
    this.setState({
      email: event.target.value
    });
  }

  sendEmail() {
    const {
      email
    } = this.state;

    fetch('api/forgotPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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
            confirmation: true
          });
          // this.props.history.push('/');
        } else {
          this.setState({
            showError: true,
            confirmation: false
          });
        }
      });
  }

  render() {
    const { email, confirmation, showError } = this.state;

    return (
      <div className="row main-row">
        <div className="main-left-side col-4">
          <img className="logo" src={Logo} height="150" width="150" alt="Expense Elephant Logo" />
          <h1>Expense Elephant</h1>
          <p>We are here to help you manage your money!</p>

        </div>
        <div className="col">
          <Link className="link" to="/">Login</Link>
          <Container className="main-form">
            <Form>
              <h1 className="main-header">Forgot Password</h1>
              <Form.Group>
                <Form.Label>Email </Form.Label>
                <Form.Control type="email" value={email} onChange={this.onChangeEmail} id="emailInput" />
              </Form.Group>
              <Form.Group>
                <Button className="submit-button" onClick={this.sendEmail}>Let&apos;s Go!</Button>
              </Form.Group>
            </Form>
          </Container>

          {showError && (
          <div className="error">
            <Alert variant="danger">
              <p>That email address does not exist. Try again or make a new account.</p>
              <Alert.Link href="/#/signup">Don&apos;t have an account?</Alert.Link>
            </Alert>
          </div>
          )}

          {confirmation && (
          <div className="error">
            <Alert variant="success">
              <p>
                Password reset email successfully sent!
                If you do not see it, check your spam folder.
              </p>
              <Alert.Link href="/">Sign In</Alert.Link>
            </Alert>
          </div>
          )}
        </div>
      </div>
    );
  }
}

export default ForgotPassword;
