import React, {Component} from 'react';
import { Button, ButtonToolbar, Container } from 'react-bootstrap';
import auth from './Auth';

class Login extends Component {
    render() {
        return (
            <div>
                <Container>
                <h1>Login Here</h1>
                <ButtonToolbar>
                    <Button onClick={
                        () => 
                        auth.login(() => {
                            this.props.history.push("/home");
                        })
                    }
                    variant="primary">Login</Button>
                    {/* <Button variant="outline-secondary">Sign Up</Button> */}
                </ButtonToolbar>
                </Container>
            </div>
        );
    }
}

export default Login;