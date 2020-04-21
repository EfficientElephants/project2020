import React, {
  Component
} from 'react';
import {
  Container,
  Card,
  Row,
  Col
} from 'react-bootstrap';
import NavBar from '../Navbar';
import AddGoal from '../Goals/AddGoal';
import Goals from '../Goals/Goals';

class GoalManager extends Component {
  constructor() {
    super();
    this.state = {
      render: '',
    };
    this.rerender = this.rerender.bind(this);
  }

  rerender(val) {
    this.setState({ render: val });
    this.forceUpdate();
  }

  render() {
    return (
      <div>
        <NavBar />
        <Container>
        <Row>
            <Col>
              <h1 className="header">
                Goals
              </h1>
            </Col>
          </Row>
          <Row>
            <Card style={{ width: '100%' }}>
              <Card.Body>
                <Row>
                  <Col>
                    <Card.Title>Financial goals are personal objectives you can set for saving and spending money.
                    </Card.Title>
                    <Card.Text>By organizing your money now, you&apos;ll have more for later!</Card.Text>

                  </Col>
                  <Col xs lg="2">
                    <AddGoal
                      stateChange={this.rerender}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Row>
          
          <br />
          <Goals
            render={this.state.render}
          />

        </Container>
      </div>
    );
  }
}

export default GoalManager;
