import React, {
  Component
} from 'react';
import {
  Form, Button, Container, Alert
} from 'react-bootstrap';
import Logo from '../../assets/expense-elephant-logo2.png';

class Reset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: '',
      newPassword: '',
      confirmPassword: '',
      showSuccess: false,
      showError: false,
    };

    this.onChangeNewPassword = this.onChangeNewPassword.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
  }

  componentDidMount() {
    // verify reset token
    const resetToken = this.props.match.params.token;
    fetch(`/api/verifyReset?token=${resetToken}`)
      .then((res) =>
        res.json())
      .then((json) => {
        if (json.success) {
          this.setState({
            token: json.token
          });
        }
      });
  }

  onChangeNewPassword(event) {
    this.setState({
      newPassword: event.target.value,
      showError: false
    });
  }

  onChangeConfirmPassword(event) {
    this.setState({
      confirmPassword: event.target.value,
      showError: false
    });
  }

  onReset() {
    const {
      newPassword,
      token,
      confirmPassword
    } = this.state;

    const valid = this.validatePassword(newPassword, confirmPassword);

    if (valid) {
      fetch('api/resetPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          newPassword,
          token
        }),
      })
        .then((res) =>
          res.json())
        .then((json) => {
          if (json.success) {
            this.setState({
              showSuccess: true,
              showError: false
            });
          } else {
            this.setState({
              showSuccess: false
            });
          }
        });
    } else {
      this.setState({
        showError: true
      });
    }
  }

  validatePassword(newPass, confirmPass) {
    if (newPass === confirmPass) {
      return true;
    }
    return false;
  }


  render() {
    const { showSuccess, showError } = this.state;

    return (
      <div className="row main-row">
        <div className="main-left-side col-4">
          <img className="logo" src={Logo} height="150" width="150" alt="Expense Elephant Logo" />
          <h1>Expense Elephant</h1>
          <p>We&apos;re here to help you manage your money!</p>
        </div>
        <div className="col">
          <Container className="main-form">
            <Form>
              <h1 className="main-header">Reset Password</h1>
              <Form.Group>
                <Form.Label>Enter new password</Form.Label>
                <Form.Control type="password" value={this.newPassword} onChange={this.onChangeNewPassword} id="passwordInput" />
              </Form.Group>
              <Form.Group>
                <Form.Label>Confirm password</Form.Label>
                <Form.Control type="password" value={this.confirmPassword} onChange={this.onChangeConfirmPassword} id="passwordInput2" />
              </Form.Group>
              <Form.Group>
                <Button className="submit-button" onClick={this.onReset}>Reset</Button>
              </Form.Group>
            </Form>
          </Container>
          <div className="error">
            {
                            (showSuccess) ? (
                              <Alert variant="success">
                                {' '}
                                Your password has been reset.
                                <Alert.Link href="/"> Login</Alert.Link>
                              </Alert>
                            ) : (null)
                        }
            {
                            (showError) ? (
                              <Alert variant="danger">
                                {' '}
                                Passwords did not match. Try again.
                              </Alert>
                            ) : (null)
                        }
          </div>
        </div>
      </div>
    );
  }
}

export default Reset;
