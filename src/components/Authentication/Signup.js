import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import auth from './Auth';
import { getFromStorage } from '../Storage';
import { setInStorage } from '../Storage';

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
        isLoading: true,
        token: '',
        signupError:  '',
        signupEmail: '',
        signupPassword: '',
        firstName: '',
        lastName: '',
        loginError: ''
    }

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
      fetch('/api/verify?token=' + token)
      .then(res => res.json())
      .then(json => {
          if(json.succces){
              this.setState({
                  token,
                  isLoading: false
              })
          } else {
              this.setState({
                  isLoading: false,
              })
          }
      })
  } else {
    this.setState({
        isLoading: false,
    })
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
  } = this.state

  this.setState({
    isLoading: true
  });

  fetch('api/signup', {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      firstName: firstName,
      lastName: lastName,
      email: signupEmail,
      password: signupPassword
    }),
  }).then(res => res.json())
  .then(json => {
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
  } = this.state

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
  }).then(res => res.json())
  .then(json => {
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
        loginError: json.message,
        isLoading: false,
      });
    }
  });
}

authenticate() {
  auth.login(() => {
      this.props.history.push('/dashboard');
  })
}


render () {
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
      <Container className="signup-form">
        {
        (signupError) ? (
            <p>{signupError}</p>
            ) : (null)
        }
        <Form>
          <h1>Sign Up</h1>
          <Form.Group>
              <Form.Label>First Name: </Form.Label>
              <Form.Control type="text" value={firstName} onChange={this.onChangeFirstName}/>
          </Form.Group>
          <Form.Group>
              <Form.Label>Last Name: </Form.Label>
              <Form.Control type="text" value={lastName} onChange={this.onChangeLastName}/>
          </Form.Group>
          <Form.Group>
              <Form.Label>Email: </Form.Label>
              <Form.Control type="email" value={signupEmail} onChange={this.onChangeEmail}/>
          </Form.Group>
          <Form.Group>
              <Form.Label>Password: </Form.Label>
              <Form.Control type="password" value={signupPassword} onChange={this.onChangePassword}/>
          </Form.Group>
          {/* <Form.Group>
              <Form.Label>Password Again: </Form.Label>
              <Form.Control type="password" placeholder="password" value={signupPassword}/>
          </Form.Group> */}
          <Form.Group>
              <Button onClick={this.onSignup}>Sign Up</Button>
          </Form.Group>
          <Link to="/">Already have an account?</Link>
        </Form>
      </Container>
      );
    }
  }
}

export default Signup;