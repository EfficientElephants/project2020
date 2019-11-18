import React from "react";
import { Link } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';

function Signup() {
  return (
    <Container>
        <h1>Sign Up</h1>
        <Form.Group>
            <Form.Label>Email: </Form.Label>
            <Form.Control type="email" placeholder="email" />
        </Form.Group>
        <Form.Group>
            <Form.Label>Password: </Form.Label>
            <Form.Control type="password" placeholder="password" />
        </Form.Group>
        <Form.Group>
            <Form.Label>Password Again: </Form.Label>
            <Form.Control type="password" placeholder="password" />
        </Form.Group>
        <Form.Group>
            <Button>Sign Up</Button>
        </Form.Group>
      <Link to="/">Already have an account?</Link>
    </Container>
  );
}

export default Signup;