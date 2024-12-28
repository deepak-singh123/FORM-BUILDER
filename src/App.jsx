import { useState } from 'react'
import './App.css'
import Header from './components/Header/Header.jsx'
import { Taskadder } from './components/taskadder.jsx'
import Questionlist from './components/Questions/questionlist.jsx';

function App() {
  const [questions, setQuestions] = useState([]);

  const handleTaskAdd = (task) => {
      console.log("Adding task:", task);
      setQuestions((prevQuestions) => [...prevQuestions, { type: task }]);
  };
 
  return (
    <>
    <div className="form-builder-container">
    <div className="form-builder">
      <Header />
      <Questionlist questions={questions} />
      </div>
      <div className="task-adder-container">
      <Taskadder handleTaskAdd={handleTaskAdd}/>
      </div>
      </div>
    </>
   
  )
}

export default App
