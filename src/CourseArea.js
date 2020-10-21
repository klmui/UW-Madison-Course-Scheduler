import React from 'react';
import './App.css';
import Course from './Course';
import PreviousCourse from './PreviousCourse';
import Button from 'react-bootstrap/Button';

class CourseArea extends React.Component {
  getCourses() {
    let courses = [];

    if (Array.isArray(this.props.data)){
     for(let i =0; i < this.props.data.length; i++){
      courses.push (
        <Course addToRecentlyViewedCourses={(course) => this.props.addToRecentlyViewedCourses(course)} key={i} data={this.props.data[i]} previouslyTakenCourses={this.props.previouslyTakenCourses} courseKey={this.props.data[i].number} addCartCourse={(data) => this.props.addCartCourse(data)} removeCartCourse={(data) => this.props.removeCartCourse(data)} cartCourses={this.props.cartCourses}/>
      )
    }
  }
  else{
    for(const course of Object.keys(this.props.data)){
      courses.push (
        <Course addToRecentlyViewedCourses={(course) => this.props.addToRecentlyViewedCourses(course)} key={this.props.data[course].number} previouslyTakenCourses={this.props.previouslyTakenCourses} data={this.props.data[course]} courseKey={this.props.data[course].number} addCartCourse={(data) => this.props.addCartCourse(data)} removeCartCourse={(data) => this.props.removeCartCourse(data)} cartCourses={this.props.cartCourses}/>
      )
    }
  }

    return courses;
  }

  shouldComponentUpdate(nextProps) {
    return (JSON.stringify(this.props) !== JSON.stringify(nextProps))
  }

  getPreviouslyTakenCourses() {
    let courses = [];

    Object.keys(this.props.data).forEach((course) => {
      courses.push(
        <PreviousCourse key={this.props.data[course].number} data={this.props.data[course]} rateCourse={this.props.rateCourse}></PreviousCourse>
      )
    });

    return courses;
  }

  getRecentlyViewedCourses() {
    this.props.viewRecentlyViewedCourses();
  }

  getRecommendedCourses() {
    let courses = [];

    for (let i = 0; i < this.props.data.length; i++) {
      courses.push(
        <Course key={this.props.data[i].number} previouslyTakenCourses={this.props.previouslyTakenCourses} data={this.props.data[i]} courseKey={this.props.data[i].number} addCartCourse={(data) => this.props.addCartCourse(data)} removeCartCourse={(data) => this.props.removeCartCourse(data)} cartCourses={this.props.cartCourses}/>
      )
    }

    return courses;
  }

  render() {
    if (typeof this.props.previousCoursesMode !== typeof undefined) {
      // Completed courses
      return (
        <div style={{margin: 5, marginTop: -5}}>
          {this.getPreviouslyTakenCourses()}
        </div>
      )
    } else if (typeof this.props.recommendedCoursesMode !== typeof undefined) {
      // Recommended Courses Mode
      if (this.props.data.length === 0) {
        return (
          <div className={'mt-4'}>
            There are no recommended courses at this time. Please try rating a course from your previously taken courses.
          </div>
        )
      } else {
        return (
          <div>
            {this.getRecommendedCourses()}
          </div>
        )
      }
    } else {
      // Search for courses or look at cart
      if (this.props.data.length === 0) {
        return (
          <div className={'mt-4 ml-4'}>
            <Button variant='dark' onClick={() => this.getRecentlyViewedCourses()}>View Recently Viewed Courses</Button>
            No courses were found. Please try again.
          </div>
        )
      }
      return (
        <div style={{margin: 5, marginTop: -5}}>
          <Button variant='dark' onClick={() => this.getRecentlyViewedCourses()}>View Recently Viewed Courses</Button>
          {this.getCourses()}
        </div>
      )
    }
  }
}

export default CourseArea;
