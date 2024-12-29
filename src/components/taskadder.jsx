import { useEffect, useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
import "./taskadder.css";
import { useDispatch, useSelector } from "react-redux";
import { addOrUpdateQuestion, fetchquestions } from "../store/quesSlice";

export const Taskadder = () => {
  const [selectedTask, setSelectedTask] = useState("");
  const dispatch= useDispatch();
  const questions = useSelector((store)=>store.questions.questions);


  useEffect(() => {
    dispatch(fetchquestions()).unwrap();
   },[dispatch])


  const handleSelectChange = (e) => {
    const value = e.target.value;
    setSelectedTask(value);
   console.log(selectedTask);
   
  };

  const handleAddClick = () => {
    if (selectedTask) {
      console.log("Selected Task:", selectedTask);
      dispatch(
        addOrUpdateQuestion({
          index: questions.length, // Index of the new question
          questionData: { type: selectedTask }, // Ensure questionData is properly structured
        })
      );
    }
  };
  
  return (
    <>
      <div className="task-adder">
        <button
          className="add-icon"
          onClick={handleAddClick}
          disabled={!selectedTask} // Disable button if no task is selected
        >
          <IoIosAddCircle />
        </button>
        <select
          className="task-type"
          name="task-type"
          value={selectedTask}
          onChange={handleSelectChange}
        >
          <option value="" disabled>  
            Question Type
          </option>
          <option value="categorize">Categorize</option>
          <option value="cloze">Cloze</option>
          <option value="comprehention">Comprehention</option>
        </select>
      </div>
    </>
  );
};
