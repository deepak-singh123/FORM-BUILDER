import React, { useEffect, useState } from "react";
import { CiCircleRemove } from "react-icons/ci";
import { v4 as uuidv4 } from "uuid";

const Submcq = ({ Qno, question, index, subquestions, setSubquestions }) => {
  const [options, setOptions] = useState([]);
  const [currquestion, setCurrQuestion] = useState(question || "");


  useEffect(() => {
    if (subquestions[index]) {
      setCurrQuestion(subquestions[index].question || "");
      setOptions(subquestions[index].options || []);
    }
  }, [question]);
  const handleRemoveOption = (optionIndex) => {
    const updatedOptions = [...options];
    updatedOptions.splice(optionIndex, 1);
    setOptions(updatedOptions);
  };

  const handleCheckboxChange = (optionIndex) => {
    setOptions((prevOptions) =>
      prevOptions.map((option, index) =>
        index === optionIndex
          ? { ...option, isanswer: !option.isanswer } // Toggle `isanswer` for the specified index
          : option // Keep other options unchanged
      )
    );
  };
  

  const handleQuestionChange = (value) => {
    setCurrQuestion(value);
  };

  const manageData = () => {
    const data = [...subquestions];
    data[index] = {
      ...data[index],
      question: currquestion,
      options: options,
    };
    setSubquestions(data);
  };

  useEffect(() => {
    manageData();
  }, [currquestion, options]);

  const handleOptionChange = (optionIndex, value) => {
    const updatedOptions = [...options];
    updatedOptions[optionIndex] = { ...updatedOptions[optionIndex], value };
    setOptions(updatedOptions);
  };

  return (
    <div className="submcq-container">
      <div className="mcq">
        <div className="mcq-header">
          <p>{`Q${Qno + 1}.${index + 1}`}</p>
          <input
            type="text"
            value={currquestion}
            onChange={(e) => handleQuestionChange(e.target.value)}
            placeholder="Question"
          />
        </div>
        <div className="options">
          {options.map((option, optionIndex) => (
            <div className="option" key={option.id}>
              <input
                type="checkbox"
                onChange={() => handleCheckboxChange(optionIndex)}
                checked={option.isanswer}
                className="option-checkbox"
              />
              <input
                type="text"
                value={option.value}
                onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
                placeholder="Option"
                className="option-input"
              />
              <CiCircleRemove size={30} onClick={() => handleRemoveOption(optionIndex)} />
            </div>
          ))}
          <button
            className="add-option"
            onClick={() =>
              setOptions([...options, { id: uuidv4(), value: "", isanswer: false }])
            }
          >
            Add Option
          </button>
        </div>
      </div>
    </div>
  );
};

export default Submcq;
