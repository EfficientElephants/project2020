import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const EditExpense = props => {
  if (props.selectedExpense) {
    return (
      <Container>
          <Form.Group>
            <Form.Label>Item: </Form.Label>
            <Form.Control
                type="string"
                name="item"
                // placeholder="example@test.com"
                value={props.selectedExpense.item}
                onChange={props.onChange}
              />
          </Form.Group>
          <Form.Group>
            <Form.Label>Price: </Form.Label>
            <Form.Control 
              type="string"
              name="price"
              value={props.selectedExpense.price}
              placeholder="$5.00"
              onChange={props.onChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Category: </Form.Label>
            <Form.Control as="select" 
                          name="category" 
                          value = {props.selectedExpense.category.value}
                          defaultValue = {props.test}
                          onChange={props.onChange}>
                <option value="Housing">Housing</option>
                <option value="Food">Food</option>
                <option value="Social">Social</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Transportation">Transportation</option>
                <option value="Personal Spending">Personal Spending</option>
                <option value="Education">Education</option>
                <option value="Utilities">Utilities</option>
                <option value="Misc.">Misc</option>
            </Form.Control>
          </Form.Group>
        <Button variant="outline-danger" onClick={props.onCancel}>Cancel</Button>&nbsp;
        <Button variant="success" onClick={props.onSave}>Save</Button>        
        <br />
        <br />
      </Container>
    );
  } else {
    return <div />;
  }
};

export default EditExpense;