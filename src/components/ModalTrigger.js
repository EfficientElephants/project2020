import React, { Component } from 'react';
import {Button, ButtonToolbar} from 'react-bootstrap';

class ModalTrigger extends Component {
    render() {
      return (
        <ButtonToolbar>
          <Button variant="primary">
            {this.props.triggerText}
          </Button>
        </ButtonToolbar>
      );
    }
  }

export default ModalTrigger;
