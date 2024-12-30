import { useEffect, useState } from 'react'
import './App.css'
import Header from './components/Header/Header.jsx'
import { Taskadder } from './components/taskadder.jsx'
import Questionlist from './components/Questions/Questionlist.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { addOrUpdateQuestion, fetchquestions } from './store/quesSlice.jsx';
import { Outlet } from 'react-router-dom';

function App() {
   
  return (
    <>
    <div className="form-builder-container">
    <div className="form-builder">
      <Header />
      <Questionlist/>
      </div>
      <div className="task-adder-container">
      <Taskadder/>
      </div>
    
      </div>
      
    </>
   
  )
}

export default App
