import React, { Component } from 'react'
import axios from 'axios'
import { Form, Button, Alert, Spinner } from 'react-bootstrap'
import styles from './index.module.css'

class Question extends Component {
  state = {
    question: '',
    studentAnswer: '',
    result: '',
    loading: false
  }

  componentDidMount () {}

  generateQuestion = () => {
    this.setState({
      result: '',
      question: '',
      studentAnswer: '',
      loading: true
    })
    const body = {
      prompt:
        'Generate a math question for a 2rd grade student invovling subtraction without group without the answer. Example 200-100=?'
    }
    axios
      .post('/api/generate', body, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        const question = response.data.result?.replace(/(\r\n|\n|\r)/gm, '')
        this.setState({ question: question, loading: false })
      })
      .catch(error => {
        this.setState({ loading: false })
        console.log(error)
      })
  }

  handleChange = event => {
    this.setState({ studentAnswer: event.target.value })
  }

  checkAnswer = event => {
    event.preventDefault()
    this.setState({ loading: true })
    const body = {
      prompt: `For the math problem ${this.state.question} Answer: ${this.state.studentAnswer}. Is this correct?`
    }
    axios
      .post('/api/generate', body, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        const result = response.data.result?.replace(/(\r\n|\n|\r)/gm, '')
        this.setState({ result: result, loading: false })
      })
      .catch(error => {
        this.setState({ loading: false })
        console.log(error)
      })
  }

  render() {
    return (
      <div className='container'>
        <img src='/learningBuddy.png' className={styles.icon} width='200px' alt='Learning Buddy' />
        <h1>Math Practice App</h1>
  
        <Form onSubmit={this.checkAnswer}>
          <Button
            variant=''
            onClick={this.generateQuestion}
            disabled={this.state.loading}
          >
            {this.state.loading ? (
              <Spinner animation='grow' size='lg' />
            ) : (
              'Generate New Question'
            )}
          </Button>
  
          {this.state.question && (
            <div>
              <Form.Group>
                <Form.Label style={{ display: 'block' }}>
                  Question: {this.state.question}
                </Form.Label>
                <Form.Label>
                  Your Answer:
                </Form.Label>
                <Form.Control
                  name='answer'
                  type='text'
                  placeholder='Enter your answer'
                  required
                  onChange={this.handleChange}
                />
              </Form.Group>
  
              <Button variant='primary' type='submit'>
                Check Answer
              </Button>
            </div>
          )}
  
        </Form>
  
        <Alert>{this.state.result}</Alert>
      </div>
    );
  }
}
export default Question
