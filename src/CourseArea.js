import React from 'react';
import './App.css';
import Course from './Course';
import PreviousCourse from './PreviousCourse';

class CourseArea extends React.Component {
  getCourses() {
    let courses = [];

    if (Array.isArray(this.props.data)){
     for(let i =0; i < this.props.data.length; i++){
      courses.push (
        <Course key={i} data={this.props.data[i]} previouslyTakenCourses={this.props.previouslyTakenCourses} courseKey={this.props.data[i].number} addCartCourse={(data) => this.props.addCartCourse(data)} removeCartCourse={(data) => this.props.removeCartCourse(data)} cartCourses={this.props.cartCourses}/>
      )
    }
  }
  else{
    for(const course of Object.keys(this.props.data)){
      courses.push (
        <Course key={this.props.data[course].number} previouslyTakenCourses={this.props.previouslyTakenCourses} data={this.props.data[course]} courseKey={this.props.data[course].number} addCartCourse={(data) => this.props.addCartCourse(data)} removeCartCourse={(data) => this.props.removeCartCourse(data)} cartCourses={this.props.cartCourses}/>
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
          <div>
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
      return (
        <div style={{margin: 5, marginTop: -5}}>
          {this.getCourses()}
        </div>
      )
    }
  }
}

export default CourseArea;
