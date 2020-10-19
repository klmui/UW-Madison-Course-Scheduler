import React from 'react';
import './App.css';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class CourseRater extends React.Component {
  constructor(props) {
    super(props);
    this.setRating = this.setRating.bind(this);
  }

  setRating(e) {
    let rating = parseInt(e.target.value);  
    console.log("course1", this.props.course);
    this.props.rateCourse(this.props.course, rating);
    console.log("course2", this.props.course);
  }

 render() {
   console.log("returnProps", this.props);
    return (
      <div className={'ml-3'}>
        <Form.Group controlId="formRating">
          <Form.Label>Rating</Form.Label>
            <Form.Control as="select" ref={this.props.course['rating'].toString()} onChange={this.setRating}>
              <option className={'d-none'} value="0">None</option>
              <option value="1">1 star</option>
              <option value="2">2 stars</option>
              <option value="3">3 stars</option>
              <option value="4">4 stars</option>
              <option value="5">5 stars</option>
          </Form.Control>
        </Form.Group>
      </div>
    )
  }
}

export default CourseRater;