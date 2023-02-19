import React, { Component } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import styles from "./index.module.css";

class Question extends Component {
    state = {
        question: '',
        correctAnswer: '',
        studentAnswer: '',
        result:'',
        loading: false

      };
    

  componentDidMount() {
   
  }

  
  generateQuestion = () => {
    this.setState({result:'',question: '', correctAnswer: '', studentAnswer: '',loading: true })
    axios
      .post('/api/generate',  {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        let output = response.data.result;
        output = output.replace(/(\r\n|\n|\r)/gm, '');
        const match = output.match(/(\d+)\+(\d+)=(\d+)/);
        if (match) {
          const question = `${match[1]}+${match[2]}`;
          const answer = match[3];
          this.setState({ question: question, correctAnswer: answer});
        }else {
          console.log("unable to parse question ${output}");
          this.setState({result: "Unable to generate the question, please try again"});
        }
        this.setState({loading: false});

      })
      .catch(error => {
        this.setState({loading: false});
        console.log(error);
      });
  }

  handleChange = event => {
    this.setState({ studentAnswer: event.target.value });
  }

  handleSubmit = event => {
    event.preventDefault();
    if (this.state.studentAnswer === this.state.correctAnswer) {
      this.setState({ result: "Correct! You are so smart!" });
    } else {
      this.setState({ result: "Incorrect, try again!" });
    }
  }


  render() {
    return (
      <div className="container">
        <img src="/learningBuddy.png" className={styles.icon} width="200x" />
        <h1>Math Practice App</h1>
        <Form onSubmit={this.handleSubmit}>
          <Button variant="" onClick={this.generateQuestion} disabled={this.state.loading}>
            {this.state.loading ? <Spinner animation="grow" size="lg" /> : 'Generate new question'}
          </Button>
          
          {this.state.question &&
          <div> 
          <Form.Group>
            <Form.Label>{this.state.question}=</Form.Label>
            <Form.Control name="answer" type="text" placeholder="Enter your answer" required onChange={this.handleChange} />
          </Form.Group> 
          <Button variant="primary" type="submit">
            Check Answer
          </Button> 
          </div>
          }
        </Form>
         <Alert>{this.state.result}</Alert>
      </div>
    );
  }
}

export default Question;
