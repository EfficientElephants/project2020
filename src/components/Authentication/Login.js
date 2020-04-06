import React, {Component} from 'react';
import { Button, Container, Form, Alert } from 'react-bootstrap';
import auth from './Auth';
import { Link } from 'react-router-dom';
import { getFromStorage, setInStorage } from '../Storage';
import Logo from '../../assets/expense-elephant-logo2.png';

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
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
}

    componentDidMount() {
        this.setState({
            isLoading: true,
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
                    auth.login(() => {
                        if (this.props.location.state) {
                            this.props.history.push(this.props.location.state);
                        } else {
                            this.props.history.push('/dashboard')
                        }
                        
                    })
                    // this.authenticate();
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
        // if (auth.isAuthenticated()){
        //     const obj = getFromStorage('expense_app');
        //     const { token } = obj;
        //     this.authenticate();
        //     this.setState({
        //         token,
        //         isLoading: false
        //     })
        // } else {
        //     this.setState({
        //         isLoading: false,
        //     })
        // }
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
            auth.login(() => {
                this.props.history.push('/dashboard');
            })
          } else {
            this.setState({
              loginError: json.message,
              isLoading: false,
            });
          }
        });
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
                <div className="row main-row">
                    <div className="main-left-side col-4"> 
                        <img className="logo" src={Logo} height="150" width="150" alt="Expense Elephant Logo" />
                        <h1>Expense Elephant</h1>
                        <p>We are here to help you manage your money!</p>
                    </div>
                    <div className="col">
                        <Link className="link" to="/signup">Sign Up</Link>
                        <div className="error">
                            {
                                (loginError) ? (
                                    <Alert variant="danger">{loginError}</Alert>
                                    ) : (null)
                            }
                        </div>
                        <Container className="main-form">
                            <Form>
                            <h1 className="main-header">Log In</h1>
                                <Form.Group>
                                    <Form.Label>Email </Form.Label>
                                    <Form.Control id="emailInput" type="email" value={loginEmail} onChange={this.onChangeEmail}/>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Password </Form.Label>
                                    <Form.Control id="passwordInput" type="password" value={loginPassword} onChange={this.onChangePassword}/>
                                </Form.Group>
                                <Link className="link" to="/forgotPassword">Forgot password?</Link>
                                <Form.Group>
                                    <Button className="submit-button" onClick={this.onLogin}
                                        id="login">Login
                                    </Button>
                                </Form.Group>
                               
                            </Form>
                        </Container>
                    </div>
                </div>
            );
        }
    }
}

export default Login;