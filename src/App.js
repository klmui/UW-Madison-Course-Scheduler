import React from 'react';
import './App.css';
import Sidebar from './Sidebar';
import CourseArea from './CourseArea';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Help from './Help';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: [],
      filteredCourses: [],
      subjects: [],
      cartCourses: {},
      previouslyTakenCourses: [],
      recommendedCourses: [],
      subject: "Any",
      recentlyViewedCourses: []
    };

    this.rateCourse = this.rateCourse.bind(this);
    this.setSubject = this.setSubject.bind(this);
    this.addToRecentlyViewedCourses = this.addToRecentlyViewedCourses.bind(this);
    this.viewRecentlyViewedCourses = this.viewRecentlyViewedCourses.bind(this);
  }

  componentDidMount() {
   this.loadInitialState()
  }

  async loadInitialState(){
    let courseURL = "http://mysqlcs639.cs.wisc.edu:53706/api/react/classes";
    let courseData = await (await fetch(courseURL)).json()
  
    const completedCoursesURL = "http://mysqlcs639.cs.wisc.edu:53706/api/react/students/5022025924/classes/completed";
    const completedCoursesData = await (await fetch(completedCoursesURL)).json();

    this.setState((state, props) => ({
      previouslyTakenCourseNames: completedCoursesData,
      allCourses: courseData,
      filteredCourses: courseData,
      subjects: this.getSubjects(courseData),
    }));

    this.setState(
      {
        previouslyTakenCourses: this.getPreviouslyTakenCourses(),
        interestAreas: this.getInterestAreas()
      }
    );

    this.setState({
      recommendedCourses: this.recommendedCourses()
    });
  }


  getSubjects(data) {
    let subjects = [];
    subjects.push("All");

    for(let i = 0; i < data.length; i++) {
      if(subjects.indexOf(data[i].subject) === -1)
        subjects.push(data[i].subject);
    }

    return subjects;
  }

  setCourses(courses) {
    this.setState({filteredCourses: courses});
  }

  addCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses))// I think this is a hack to deepcopy
    let courseIndex = this.state.allCourses.findIndex((x) => {return x.number===data.course})
    if (courseIndex === -1)
    {
      return 
    }

    if('subsection' in data) {
      if(data.course in this.state.cartCourses) {
        if(data.section in this.state.cartCourses[data.course]) {
          newCartCourses[data.course][data.section].push(data.subsection);
        }
        else {
          newCartCourses[data.course][data.section] = [];
          newCartCourses[data.course][data.section].push(data.subsection);
        }
      }
      else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        newCartCourses[data.course][data.section].push(data.subsection);
      }
    }
    else if('section' in data) {
      if(data.course in this.state.cartCourses) {
        newCartCourses[data.course][data.section] = [];

        for(let i = 0; i < this.state.allCourses[courseIndex].sections[data.section].subsections.length; i++) {
          newCartCourses[data.course][data.section].push(this.state.allCourses[courseIndex].sections[data.section].subsections[i]);
        }
      
      
      }
      else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        for(let i = 0; i < this.state.allCourses[courseIndex].sections[data.section].subsections.length; i++) { 
          newCartCourses[data.course][data.section].push(this.state.allCourses[courseIndex].sections[data.section].subsections[i]);
        }
      }
    }
    else {
      newCartCourses[data.course] = {};


      for (let i = 0; i < this.state.allCourses[courseIndex].sections.length; i++){
        newCartCourses[data.course][i] = [];

         for(let c= 0; c < this.state.allCourses[courseIndex].sections[i].subsections.length; c ++){
          newCartCourses[data.course][i].push(this.state.allCourses[courseIndex].sections[i].subsections[c]);
        }

      }


    }
    this.setState({cartCourses: newCartCourses});
  }

  removeCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses))

    if('subsection' in data) {
      newCartCourses[data.course][data.section].splice(newCartCourses[data.course][data.section].indexOf(data.subsection), 1);
      if(newCartCourses[data.course][data.section].length === 0) {
        delete newCartCourses[data.course][data.section];
      }
      if(Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    }
    else if('section' in data) {
      delete newCartCourses[data.course][data.section];
      if(Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    }
    else {
      delete newCartCourses[data.course];
    }
    this.setState({cartCourses: newCartCourses});
  }

  getCartData() {
    let cartData = [];

    for(const courseKey of Object.keys(this.state.cartCourses)) {
      let course = this.state.allCourses.find((x) => {return x.number === courseKey})

      cartData.push(course);
    }
    return cartData;
  }

  getPreviouslyTakenCourses() {
    let completedCoursesData = [];
    let courseNames = this.state.previouslyTakenCourseNames['data'];
    console.log("cn", courseNames);

    for (const [key, value] of Object.entries(this.state.allCourses)) {
      if (courseNames.includes(value.number)) {
        completedCoursesData.push(value);
      }
    }

    Object.keys(completedCoursesData).forEach(course => {
      completedCoursesData[course]['rating'] = 0;
    });

    return completedCoursesData;
    
  }

  rateCourse(course, rating) {
    let key = -1;

    Object.keys(this.state.previouslyTakenCourses).forEach(i => {
      if (JSON.stringify(this.state.previouslyTakenCourses[i]) === JSON.stringify(course)) {
        key = i;
      }
    });

    let newPrevCourses = Object.assign({}, this.state.previouslyTakenCourses);
    newPrevCourses[key]['rating'] = rating;
    this.setState({
      previouslyTakenCourses: newPrevCourses
    });
    this.recommendedCourses();
  }

  getInterestAreas() {
    let keywords = []
    Object.keys(this.state.allCourses).forEach(i => {
      for (let j = 0; j < this.state.allCourses[i]['keywords'].length; j++) {
        keywords.push(this.state.allCourses[i]['keywords'][j]);
      }
    });

    this.recommendedCourses();
    return [...new Set(keywords)]
  }

  setSubject(subject) {
    this.setState({subject: subject});
  }

  getInterestAreasOfRatedCourses() {
    const courses = this.state.previouslyTakenCourses;
    let keywords = [];
    
    for (let course in courses) {
      if (courses[course]['rating'] !== 0) {
        for (let keyword in courses[course]['keywords']) {
          keywords.push(courses[course]['keywords'][keyword]);
        }
      } 
    }
    
    return [...new Set(keywords)];
  }

  recommendedCourses() {
    const interestAreas = this.getInterestAreasOfRatedCourses();
    let previouslyTakenCourses = [];
    let previouslyTakenCoursesWithRatings = [];
    for (let i in this.state.previouslyTakenCourses) {
      previouslyTakenCourses.push(this.state.previouslyTakenCourses[i]);
      previouslyTakenCoursesWithRatings.push([this.state.previouslyTakenCourses[i]['rating'], this.state.previouslyTakenCourses[i]]);
    }

    // Sort courses by rating
    previouslyTakenCoursesWithRatings.sort((a, b) => {
      return a[0] - b[0];
    })

    // Assign subject to the subject of the highest rated course
    let subject = "";
    if (typeof previouslyTakenCoursesWithRatings[previouslyTakenCoursesWithRatings.length - 1] !== typeof undefined) {
      if (previouslyTakenCoursesWithRatings[previouslyTakenCoursesWithRatings.length - 1][1]['rating'] !== 0) {
        subject = previouslyTakenCoursesWithRatings[previouslyTakenCoursesWithRatings.length - 1][1]['subject'];
      }
    }    

    console.log("interest", interestAreas);
    console.log("subject", subject);

    let recommendedCourses = [];

    // Filter by interest
    Object.keys(this.state.allCourses).forEach(course => {
      for (let keyword in this.state.allCourses[course]['keywords']) {
        if (interestAreas.includes(this.state.allCourses[course]['keywords'][keyword])) {
          recommendedCourses.push(this.state.allCourses[course]);
          break;
        }
      }
    });

    // Filter by subject
    let tempRecommendedCourses = [];
    for (let i = 0; i < recommendedCourses.length; i++) {
      if (recommendedCourses[i]['subject'] === subject) {
        tempRecommendedCourses.push(recommendedCourses[i]);
      }
    }
    recommendedCourses = tempRecommendedCourses

    // Filter by courses not yet taken
    tempRecommendedCourses = [];
    for (let i = 0; i < recommendedCourses.length; i++) {
      if (!previouslyTakenCourses.includes(recommendedCourses[i])) {
        tempRecommendedCourses.push(recommendedCourses[i]);
      }
    }
    recommendedCourses = tempRecommendedCourses;

    this.setState({recommendedCourses: recommendedCourses});

    console.log("recommended", recommendedCourses);
    return recommendedCourses;
  }

  addToRecentlyViewedCourses(course) {
    let newRecentlyViewedCourses = [];
    newRecentlyViewedCourses.push(course);
    for (let i = 0; i < this.state.recentlyViewedCourses.length; i++) {
      if (!newRecentlyViewedCourses.includes(this.state.recentlyViewedCourses[i])) {
        newRecentlyViewedCourses.push(this.state.recentlyViewedCourses[i]);
      }
    }
    this.setState({ recentlyViewedCourses: newRecentlyViewedCourses });
  }

  viewRecentlyViewedCourses() {
    let recentlyViewed = [];
    for (let i = 0; i < this.state.recentlyViewedCourses.length; i++) {
      if (i < 5) {
        recentlyViewed.push(this.state.recentlyViewedCourses[i]);
      } else {
        break;
      }
    }
    this.setState({filteredCourses: recentlyViewed});
  }

  render() {
    console.log("courses", this.state.allCourses);
    return (
      <>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />

        <Tabs defaultActiveKey="search" style={{position: 'fixed', zIndex: 1, width: '100%', backgroundColor: 'white'}}>
          <Tab eventKey="search" title="Search" style={{paddingTop: '5vh'}}>
            <Sidebar setCourses={(courses) => this.setCourses(courses)} courses={this.state.allCourses} subjects={this.state.subjects} setSubject={(subject) => this.setSubject(subject)}/>
            <div style={{marginLeft: '20vw'}}>
              <CourseArea viewRecentlyViewedCourses={() => this.viewRecentlyViewedCourses()} recentlyViewedCourses={this.state.recentlyViewedCourses} addToRecentlyViewedCourses={(course) => this.addToRecentlyViewedCourses(course)} previouslyTakenCourses={this.state.previouslyTakenCourses} data={this.state.filteredCourses} addCartCourse={(data) => this.addCartCourse(data)} removeCartCourse={(data) => this.removeCartCourse(data)} cartCourses={this.state.cartCourses}/>
            </div>
          </Tab>
          <Tab eventKey="cart" title="Cart" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '20vw'}}>
              <CourseArea previouslyTakenCourses={this.state.previouslyTakenCourses} data={this.getCartData()} addCartCourse={(data) => this.addCartCourse(data)} removeCartCourse={(data) => this.removeCartCourse(data)} cartCourses={this.state.cartCourses}/>
            </div>
          </Tab>
          <Tab eventKey="previouslyTakenCourses" title="Previously Taken Courses" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '20vw'}}>
              <CourseArea data={this.state.previouslyTakenCourses} previousCoursesMode={true} rateCourse={(course, rating) => this.rateCourse(course, rating)}></CourseArea>
            </div>
          </Tab>
          <Tab eventKey="recommendedCourses" title="Recommended Courses" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '20vw'}}>
              <CourseArea previouslyTakenCourses={this.state.previouslyTakenCourses} data={this.state.recommendedCourses} recommendedCoursesMode={true} addCartCourse={(data) => this.addCartCourse(data)} removeCartCourse={(data) => this.removeCartCourse(data)} cartCourses={this.state.cartCourses}></CourseArea>
            </div>
          </Tab>
          <Tab eventKey="Help" title="Help" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '20vw'}}>
              <Help></Help>
            </div>
          </Tab>
        </Tabs>
      </>
    )
  }
}

export default App;
