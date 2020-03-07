import React, {Component} from 'react';
// import { Button, Container, Form } from 'react-bootstrap';
import auth from './Auth';
// import { Link } from 'react-router-dom';
import { setInStorage } from '../Storage';
import GoogleLogin from 'react-google-login';


class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // isLoading: true,
            // token: '',
            // loginError:  '',
            // loginEmail: '',
            // loginPassword: ''
        }

    this.responseGoogle = this.responseGoogle.bind(this);
    this.oauthGoogle = this.oauthGoogle.bind(this);

    // this.onLogin = this.onLogin.bind(this);
    // this.onChangeEmail = this.onChangeEmail.bind(this);
    // this.onChangePassword = this.onChangePassword.bind(this);
}

    // componentDidMount() {
    //     this.setState({
    //         isLoading: true,
    //     })
    //     const obj = getFromStorage('expense_app');
    //     if (obj && obj.token) {
    //         const { token } = obj;
    //         // Verify token
    //         fetch('/api/verify?token=' + token)
    //         .then(res => res.json())
    //         .then(json => {
    //             if(json.success){
    //                 this.setState({
    //                     token,
    //                     isLoading: false
    //                 })
    //                 auth.login(() => {
    //                     if (this.props.location.state) {
    //                         this.props.history.push(this.props.location.state);
    //                     } else {
    //                         this.props.history.push('/dashboard')
    //                     }
                        
    //                 })
    //                 // this.authenticate();
    //             } else {
    //                 this.setState({
    //                     isLoading: false,
    //                 })
    //             }
    //         })
    //     } else {
    //         this.setState({
    //             isLoading: false,
    //         })
    //     }
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
    // }

    // onChangeEmail(event) {
    //     this.setState({
    //         loginEmail: event.target.value
    //     });
    // }

    // onChangePassword(event) {
    //     this.setState({
    //         loginPassword: event.target.value
    //     });
    // }

    // onLogin() {
    //     const {
    //       loginEmail,
    //       loginPassword,
    //     } = this.state
      
    //     this.setState({
    //       isLoading: true
    //     });
      
    //     fetch('api/login', {
    //       method: 'POST', 
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify({
    //         email: loginEmail,
    //         password: loginPassword
    //       }),
    //     }).then(res => res.json())
    //     .then(json => {
    //       if (json.success) {
    //         setInStorage('expense_app', { token: json.token });
    //         this.setState({
    //           loginError: json.message,
    //           isLoading: false,
    //           token: json.token
    //         });
    //         auth.login(() => {
    //             this.props.history.push('/dashboard');
    //         })
    //       } else {
    //         this.setState({
    //           loginError: json.message,
    //           isLoading: false,
    //         });
    //       }
    //     });
    //   }

    async responseGoogle(res) {
        console.log('resonseGoogle', res);
        await this.oauthGoogle(res.profileObj)
    }

    async oauthGoogle(data) {
        console.log('here:', data.email)

        // const {
        //     loginEmail,
        //     loginPassword,
        // } = this.state

        fetch('api/login', {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: data.email,
            googleId: data.googleId,
            firstName: data.giveName,
            lastName: data.familyName
          }),
        }).then(res => res.json())
        .then(json => {
          if (json.success) {
              console.log('success')
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
        return (
            <div>
                <GoogleLogin
                    clientId="477867082908-vktv6mdclisbivl921gdje29kv2bec07.apps.googleusercontent.com"
                    redirect_uri="http://localhost:3000/auth/google/callback"
                    buttonText="Google"
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseGoogle}
                ></GoogleLogin>
            </div>
        )

    //     const {
    //         isLoading, 
    //         token,
    //         loginError,
    //         loginEmail,
    //         loginPassword
    //     } = this.state;

    //     if (isLoading) {
    //         return (<div><p>Loading...</p></div>);
    //     }

    //     if (token) {
    //         return <div></div>
    //     }

    //     if (!token) {
    //         return (
    //             <div>
    //                 <Container className="login-form">
    //                 {
    //                     (loginError) ? (
    //                         <p>{loginError}</p>
    //                         ) : (null)
    //                 }
    //                     <Form>
    //                     <h1>Login Here</h1>
    //                         <Form.Group>
    //                             <Form.Label>Email: </Form.Label>
    //                             <Form.Control type="email" value={loginEmail} onChange={this.onChangeEmail}/>
    //                         </Form.Group>
    //                         <Form.Group>
    //                             <Form.Label>Password: </Form.Label>
    //                             <Form.Control type="password" value={loginPassword} onChange={this.onChangePassword}/>
    //                         </Form.Group>
    //                         <Link to="/forgotPassword">Forgot password?</Link>
    //                         <Form.Group>
    //                         <Button onClick={this.onLogin}
    //                             variant="primary">Login</Button>
    //                         </Form.Group>
    //                         <Link to="/signup">Don't have an account?</Link>
    //                     </Form>
    //                 </Container>
    //             </div>
    //         );
    //     }
    }
}

export default Login;