import React, {Component} from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';
import auth from './Auth';


class Login extends Component {
    render() {
        return (
            <div>
                <h1>Login Here</h1>
                <ButtonToolbar>
                    <Button onClick={
                        () => 
                        auth.login(() => {
                            this.props.history.push("/navbar");
                        })
                    }
                    variant="primary">Login</Button>
                    {/* <Button variant="outline-secondary">Sign Up</Button> */}
                </ButtonToolbar>
            </div>
        );
    }
}

export default Login;