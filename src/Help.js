import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';

class Help extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h3 className={'mt-2 mb-3'}>Frequently Asked Questions</h3>
        <ol>
          <li className={'mb-2'}><strong>How do I add a course to my cart?</strong> Go to the search page or recommended courses tab, click a course, and click one of the corresponding "add" buttons.</li>
          <li className={'mb-2'}><strong>How do I add rate a course?</strong> Go to the 'previously taken courses tab', click the rating dropdown, and select a number from 1 to 5.</li>
          <li className={'mb-2'}><strong>How are my recommended courses determined?</strong> They are determined based off of your highest rated course and its subject.</li>
          <li className={'mb-2'}><strong>Which courses saved to my recently viewed courses?</strong> Your last five courses that you viewed (clicked the 'view sections' button) are saved into your recently viewed courses.</li>
        </ol>
      </div>
    )
  }
}

export default Help;
