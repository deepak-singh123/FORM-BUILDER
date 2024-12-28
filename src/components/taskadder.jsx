import { useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
import "./taskadder.css";

export const Taskadder = ({ handleTaskAdd }) => {
  const [selectedTask, setSelectedTask] = useState("");

  const handleSelectChange = (e) => {
    const value = e.target.value;
    setSelectedTask(value);

   
  };

  const handleAddClick = () => {
    if (selectedTask) {
      console.log("Selected Task:", selectedTask);
      handleTaskAdd(selectedTask);
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
          <option value="Categorize">Categorize</option>
        </select>
      </div>
    </>
  );
};
