import React, { Component } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Reset extends Component {
    constructor(props) {
        super(props);

        this.state = {
            token: '',
            newPassword: '',
            showSuccess: false,
            message: '',
        };

        this.onChangeNewPassword = this.onChangeNewPassword.bind(this);
        this.onReset = this.onReset.bind(this);
    }

    componentDidMount() {
        //verify reset token
        const resetToken = this.props.match.params.token;
        fetch('/api/verifyReset?token=' + resetToken)
            .then((res) => res.json())
            .then((json) => {
                if (json.success) {
                    this.setState({
                        message: json.message,
                        token: json.token,
                    });
                }
            });
    }

    onChangeNewPassword(event) {
        this.setState({
            newPassword: event.target.value,
        });
    }

    onReset() {
        const { newPassword, token } = this.state;

        fetch('api/resetPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                newPassword: newPassword,
                token: token,
            }),
        })
            .then((res) => res.json())
            .then((json) => {
                if (json.success) {
                    this.setState({
                        showSuccess: true,
                    });
                } else {
                    this.setState({
                        showSuccess: false,
                    });
                }
            });
    }

    render() {
        const { showSuccess } = this.state;

        return (
            <div>
                <Container className="reset-form">
                    <Form>
                        <Form.Group>
                            <Form.Label>Enter new password:</Form.Label>
                            <Form.Control
                                type="password"
                                value={this.newPassword}
                                onChange={this.onChangeNewPassword}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Button onClick={this.onReset}>
                                Reset Password
                            </Button>
                        </Form.Group>
                    </Form>
                </Container>
                {showSuccess && (
                    <div>
                        <p>
                            Your password has been reset. Go to home page to
                            login.
                        </p>
                        <Link to="/">Go Home</Link>
                    </div>
                )}
            </div>
        );
    }
}
Reset.propTypes = {
    match: PropTypes.string.isRequired,
};
export default Reset;
