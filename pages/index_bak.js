import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [numberOfQuestions, setNumberOfQuestions] = useState("");
  const [grade, setGrade] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ numberOfQuestions: numberOfQuestions, grade: grade }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setNumberOfQuestions("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>E-Learning Buddy</title>
        <link rel="icon" href="/learningBuddy.png" />
      </Head>

      <main className={styles.main}>
        <img src="/learningBuddy.png" className={styles.icon} />
        <h3>Generate Questions</h3>
        <form onSubmit={onSubmit}>
          <div className={styles.label}>Grade</div>
          <select name="grade" 
          id="grade"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            </select>
          <div className={styles.label}>Number of Questions</div>


          <input
            type="text"
            name="numberOfQuestions"
            placeholder="Enter Number of Questions"
            value={numberOfQuestions}
            onChange={(e) => setNumberOfQuestions(e.target.value)}
            
          />
          <input type="submit" value="Generate Questions" />
        </form>
        {result && (
        <div dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, "<br>") }}></div>
      )}

      </main>
    </div>
  );
}
