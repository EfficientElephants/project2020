import React, {Component} from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import auth from './Auth';
import { Link } from 'react-router-dom';
import { getFromStorage, setInStorage } from '../Storage';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            token: '',
            loginError:  '',
            loginEmail: '',
            loginPassword: ''
        }

    this.onLogin = this.onLogin.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
}

    componentDidMount() {
        this.setState({
            isLoading: false,
        })
        const obj = getFromStorage('expense_app');
        if (obj && obj.token) {
            const { token } = obj;
            // Verify token
            fetch('/api/verify?token=' + token)
            .then(res => res.json())
            .then(json => {
                if(json.success){
                    this.setState({
                        token,
                        isLoading: false
                    })
                    this.authenticate();
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
            loginEmail: event.target.value
        });
    }

    onChangePassword(event) {
        this.setState({
            loginPassword: event.target.value
        });
    }

    onLogin() {
        const {
          loginEmail,
          loginPassword,
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
            email: loginEmail,
            password: loginPassword
          }),
        }).then(res => res.json())
        .then(json => {
          if (json.success) {
            setInStorage('expense_app', { token: json.token });
            this.setState({
              loginError: json.message,
              isLoading: false,
              token: json.token
            });
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
            loginError,
            loginEmail,
            loginPassword
        } = this.state;

        if (isLoading) {
            return (<div><p>Loading...</p></div>);
        }

        if (token) {
            return <div></div>
        }

        if (!token) {
            return (
                <div>
                    <Container className="login-form">
                    {
                        (loginError) ? (
                            <p>{loginError}</p>
                            ) : (null)
                    }
                        <Form>
                        <h1>Login Here</h1>
                            <Form.Group>
                                <Form.Label>Email: </Form.Label>
                                <Form.Control type="email" value={loginEmail} onChange={this.onChangeEmail}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Password: </Form.Label>
                                <Form.Control type="password" value={loginPassword} onChange={this.onChangePassword}/>
                            </Form.Group>
                            <Form.Group>
                            <Button onClick={this.onLogin}
                                variant="primary">Login</Button>
                            </Form.Group>
                            <Link to="/signup">Don't have an account?</Link>
                        </Form>
                    </Container>
                </div>
            );
        }
    }
}

export default Login;