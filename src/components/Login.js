import React, {Component} from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import auth from './Auth';
import { Link } from 'react-router-dom';

// import 'whatwg-fetch';
// import { getFromStorage } from './Storage';

class Login extends Component {
    constructor(props) {
        super(props);

        this.super = {
            // isLoading: true,
            // token: '',
            // loginError:  '',
            // masterError: ''
        }
    }

    componentDidMount() {
        // const token = getFromStorage('expense_app');
        // if (token) {
        //     // Verify token
        //     fetch('/api/verify?token=' + token)
        //     .then(res => res.json())
        //     .then(json => {
        //         if(json.succces){
        //             this.setState({
        //                 token,
        //                 isLoading: false
        //             })
        //         }
        //     })
        // } else {
        //     this.state({
        //         isLoading: false,
        //     })
        // }
    }

    render() {
        // const {
        //     isLoading, 
        // } = this.state;

        // if (isLoading) {
        //     return (<div><p>Loading...</p></div>);
        // }

        return (
            <div>
                <Container>
                <h1>Login Here</h1>
                    <Form.Group>
                        <Form.Label>Email: </Form.Label>
                        <Form.Control type="email" placeholder="email" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password: </Form.Label>
                        <Form.Control type="password" placeholder="password" />
                    </Form.Group>
                    <Form.Group>
                    <Button onClick={
                        () => 
                        auth.login(() => {
                            this.props.history.push("/dashboard");
                        })
                    } variant="primary">Login</Button>
                    </Form.Group>
                    <Link to="/signup">Don't have an account?</Link>
                
                </Container>
            </div>
        );
    }
}

export default Login;