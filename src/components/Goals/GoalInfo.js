/* eslint-disable no-unused-vars */
import React, {
  Component
} from 'react';
import {
  Col, Button, ProgressBar, Card
} from 'react-bootstrap';
import housingPhoto from '../../assets/housing-photo.jpg';
import foodPhoto from '../../assets/food-photo.jpg';
import socialPhoto from '../../assets/social-photo.jpg';
import healthcarePhoto from '../../assets/healthcare-photo.jpg';
import transportPhoto from '../../assets/transportation-photo.jpg';
import personalPhoto from '../../assets/personal-photo.jpg';
import educationPhoto from '../../assets/education-photo.jpg';
import utilitiesPhoto from '../../assets/utilities-photo.jpg';
import miscPhoto from '../../assets/misc-photo.jpg';

class GoalInfo extends Component {
  constructor() {
    super();
    this.state = {
      gradient: '',
      percent: '',
    };

    this.percent = this.percent.bind(this);
    this.gradient = this.gradient.bind(this);
    this.remaining = this.remaining.bind(this);
  }

  componentDidMount() {
    const per = this.percent();
    const grad = this.gradient(per);
    this.setState({ percent: per, gradient: grad });
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(rerender) {
    if (this.props.rerender) {
      this.componentDidMount();
    }
  }

  percent() {
    const { goalAmount } = this.props.goal;
    const { spentAmount } = this.props.goal;
    const percent = 100 * (spentAmount / goalAmount);
    return percent.toFixed(0);
  }

  gradient(percent) {
    if (percent >= 75) {
      return 'danger';
    } if (percent >= 50) {
      return 'warning';
    }
    return 'success';
  }

  remaining() {
    const remains = (this.props.goal.goalAmount - this.props.goal.spentAmount);
    return remains.toFixed(2);
  }

  goalPicture() {
    if (this.props.goal.category === 'Housing') {
      return { src: housingPhoto,
        alt: 'Picture of an apartment',
        credit: 'Photo by Brandon Griggs on Unsplash' };
    } if (this.props.goal.category === 'Food') {
      return { src: foodPhoto,
        alt: 'Picture of food',
        credit: 'Photo by Brooke Lark on Unsplash' };
    } if (this.props.goal.category === 'Social') {
      return { src: socialPhoto,
        alt: 'Picture of people drinking wine',
        credit: 'Photo by Kelsey Chance on Unsplash' };
    } if (this.props.goal.category === 'Healthcare') {
      return { src: healthcarePhoto,
        alt: 'Picture of doctor with stethoscope',
        credit: 'Photo by Online Marketing on Unsplash' };
    } if (this.props.goal.category === 'Transportation') {
      return { src: transportPhoto,
        alt: 'Picture of bikes',
        credit: 'Photo by Markus Winkler on Unsplash' };
    } if (this.props.goal.category === 'Personal Spending') {
      return { src: personalPhoto,
        alt: 'Picture of q-tips',
        credit: 'Photo by Sharon McCutcheon on Unsplash' };
    } if (this.props.goal.category === 'Education') {
      return { src: educationPhoto,
        alt: 'Picture of food',
        credit: 'Photo by Kimberly Farmer on Unsplash' };
    } if (this.props.goal.category === 'Utilities') {
      return { src: utilitiesPhoto,
        alt: 'Picture of a power line',
        credit: 'Photo by Oxana Lyashenko on Unsplash' };
    } if (this.props.goal.category === 'Misc.') {
      return { src: miscPhoto,
        alt: 'Picture of tiled wall',
        credit: 'Photo by Andrew Ridley on Unsplash' };
    }
  }


  render() {
    return (
      <Col>
        <Card>
          <Card.Img height="auto" width="100%" variant="top" src={this.goalPicture().src} alt={this.goalPicture().alt} />
          <Card.Body>
            <Card.Title className="text-center" as="h5">{this.props.goal.category}</Card.Title>
            <ProgressBar striped variant={this.state.gradient} now={this.state.percent} label={`${this.state.percent}%`} />
            <Card.Text>
              <br />
              <b>Goal Amount:</b>
              {' '}
              $
              {this.props.goal.goalAmount}
              <br />
              <b>Amount Spent:</b>
              {' '}
              $
              {this.props.goal.spentAmount}
              <br />
              <b>Amount remaining:</b>
              {' '}
              $
              {this.remaining()}
            </Card.Text>
            <div>
              <span>
                <Button
                  variant="info"
                  onClick={() =>
                    this.props.onSelect(this.props.goal)}
                >
                  Edit Goal
                </Button>
              </span>
              &nbsp;
              <span>
                <Button
                  variant="danger"
                  onClick={(e) =>
                    this.props.onDelete(e, this.props.goal)}
                >
                  Delete Goal
                </Button>
              </span>
            </div>
          </Card.Body>
          <Card.Footer>
            <small className="text-muted">
              {' '}
              {this.goalPicture().credit}
              {' '}
            </small>
          </Card.Footer>
        </Card>
      </Col>
    );
  }
}
export default GoalInfo;
