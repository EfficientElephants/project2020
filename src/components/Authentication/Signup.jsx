import React, {
  Component
} from 'react';
import {
  Link
} from 'react-router-dom';
import {
  Form, Button, Container, Alert
} from 'react-bootstrap';
import auth from './Auth';
import {
  getFromStorage,
  setInStorage
} from '../Storage';

import Logo from '../../assets/expense-elephant-logo2.png';

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: '',
      signupError: '',
      signupEmail: '',
      signupPassword: '',
      firstName: '',
      lastName: '',
    };

    this.onSignup = this.onSignup.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeFirstName = this.onChangeFirstName.bind(this);
    this.onChangeLastName = this.onChangeLastName.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.login = this.login.bind(this);
  }

  componentDidMount() {
    const obj = getFromStorage('expense_app');
    if (obj && obj.token) {
      const { token } = obj;
      // Verify token
      fetch(`/api/verify?token=${token}`)
        .then((res) =>
          res.json())
        .then((json) => {
          if (json.succces) {
            this.setState({
              token,
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  onChangeEmail(event) {
    this.setState({
      signupEmail: event.target.value
    });
  }

  onChangePassword(event) {
    this.setState({
      signupPassword: event.target.value
    });
  }

  onChangeFirstName(event) {
    this.setState({
      firstName: event.target.value
    });
  }

  onChangeLastName(event) {
    this.setState({
      lastName: event.target.value
    });
  }

  onSignup() {
    const {
      signupEmail,
      signupPassword,
      firstName,
      lastName
    } = this.state;

    this.setState({
      isLoading: true
    });

    fetch('api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email: signupEmail,
        password: signupPassword
      }),
    }).then((res) =>
      res.json())
      .then((json) => {
        if (json.success) {
          this.setState({
            signupError: json.message,
            isLoading: false,
          });
          // login immediately after signup
          this.login();
        } else {
          this.setState({
            signupError: json.message,
            isLoading: false,
          });
        }
      });
  }

  login() {
    const {
      signupEmail,
      signupPassword
    } = this.state;

    this.setState({
      isLoading: true
    });

    fetch('api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: signupEmail,
        password: signupPassword
      }),
    }).then((res) =>
      res.json())
      .then((json) => {
        if (json.success) {
          setInStorage('expense_app', { token: json.token });
          // this.setState({
          //   loginError: json.message,
          //   isLoading: false,
          //   token: json.token
          // });
          this.authenticate();
        } else {
          this.setState({
            isLoading: false,
          });
        }
      });
  }

  authenticate() {
    const { history } = this.props;
    auth.login(() => {
      history.push('/dashboard');
    });
  }


  render() {
    const {
      isLoading,
      token,
      signupError,
      signupEmail,
      signupPassword,
      firstName,
      lastName,
    } = this.state;

    if (isLoading) {
      return (<div><p>Loading...</p></div>);
    }

    if (!token) {
      return (
        <div className="row main-row">
          <div className="main-left-side col-4">
            <img className="logo" src={Logo} height="150" width="150" alt="Expense Elephant Logo" />
            <h1>Expense Elephant</h1>
            <p>We are here to help you manage your money!</p>
          </div>
          <div className="col">
            <Link className="link" to="/">Login</Link>
            <div className="error">
              {
                    (signupError) ? (
                      <Alert variant="danger">{signupError}</Alert>
                    ) : (null)
                    }
            </div>
            <Container className="main-form">

              <Form>
                <h1 className="main-header">Sign Up</h1>
                <Form.Group>
                  <Form.Label>First Name </Form.Label>
                  <Form.Control type="text" value={firstName} onChange={this.onChangeFirstName} id="firstNameInput" />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Last Name </Form.Label>
                  <Form.Control type="text" value={lastName} onChange={this.onChangeLastName} id="lastNameInput" />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Email </Form.Label>
                  <Form.Control type="email" value={signupEmail} onChange={this.onChangeEmail} id="emailInput" />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Password </Form.Label>
                  <Form.Control type="password" value={signupPassword} onChange={this.onChangePassword} id="passwordInput" />
                </Form.Group>
                {/* <Form.Group>
                  <Form.Label>Password Again: </Form.Label>
                  <Form.Control type="password" placeholder="password" value={signupPassword}/>
                  </Form.Group> */}
                <Form.Group>
                  <Button className="submit-button" onClick={this.onSignup}>Sign Up</Button>
                </Form.Group>

              </Form>
            </Container>
          </div>
        </div>
      );
    }
    return <div />;
  }
}

export default Signup;
