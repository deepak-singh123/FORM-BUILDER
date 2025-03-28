import React, { useEffect, useState } from "react";
import "./Categorize.css";
import "./mcq.css";
import { RxDragHandleDots2 } from "react-icons/rx";
import { FaImage } from "react-icons/fa";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { v4 as uuidv4 } from "uuid";
import Submcq from "./Submcq";
import { addOrUpdateQuestion } from "../../store/quesSlice";
import { useDispatch } from "react-redux";

const Mcq = ({ Qno,question }) => {
  const [points, setPoints] = useState(null);
  const [catdescription, setCatDescription] = useState("");
  const [file, setFile] = useState(null);
  const [descImageLoading, setDescImageLoading] = useState(false);
  const [selectedDescImage, setSelectedDescImage] = useState(null);
  const [subquestions, setSubquestions] = useState([{ id: uuidv4(), question: "" }]);
  const dispatch = useDispatch();

  useEffect(() => {
    if(question){
      if(question.image){
        setSelectedDescImage(question.image);
      }
      if(question.passage){
        setCatDescription(question.passage);
      }
      if(question.points){
        setPoints(question.points);
      }
      if(question.subquestions){
        setSubquestions(question.subquestions);
      }
      
    }
  },[])

  const handleDescImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedDescImage(reader.result);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("file", file);

      try {
        setDescImageLoading(true);
        const response = await fetch("https://quizzit.onrender.com/image-upload", {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          setDescImageLoading(false);
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setDescImageLoading(false);
        setSelectedDescImage(data.url);
      } catch (error) {
        console.error(error);
        setSelectedDescImage(null);
        setDescImageLoading(false);
      }
    } else {
      console.log("No file selected");
    }
  };
 console.log(subquestions);
  const handleDescription = (e) => {
    setCatDescription(e.target.value);
  };

  const saveDataToRedux = () => {
    const questionData = {
      type: "comprehention",
      passage: catdescription,
      subquestions,
      image: selectedDescImage,
    };
    dispatch(addOrUpdateQuestion({ index: Qno, questionData }));
  };
  useEffect(() => {
    saveDataToRedux();
  }, [subquestions, points, catdescription, selectedDescImage]);
  return (
    <div className="categorize-container">
      <div className="categorize-header">
        <div className="categorize-header-title">
          <div className="drag-icon">
            <RxDragHandleDots2 size={30} />
          </div>
          <h2>Question {Qno + 1}</h2>
        </div>
        <div className="points-input">
          <label>Points:</label>
          <input
            type="number"
            value={points || ""}
            onChange={(e) => setPoints(e.target.value)}
            placeholder="Enter points"
          />
        </div>
      </div>

      <div className="field">
        <div className="description-input">
          <input
            type="text"
            placeholder="Passage"
            value={catdescription}
            onChange={handleDescription}
          />
          <button className="option-btn">
            <input
              className="postinputimage"
              type="file"
              accept="image/*,video/*"
              onChange={handleDescImage}
            />
            <FaImage size={40} />
          </button>
        </div>

        {selectedDescImage && (
          <div className="description-image">
            <img
              src={selectedDescImage}
              alt="Selected"
              className="selected-image"
            />
            <div
              className="header-delete-button"
              onClick={() => setSelectedDescImage(null)}
            >
              <RiDeleteBack2Fill size={30} />
            </div>
          </div>
        )}

        {subquestions.map((ques, index) => (
          <Submcq
            key={ques.id}
            Qno={Qno}
            question={ques.question}
            index={index}
            subquestions={subquestions}
            setSubquestions={setSubquestions}
          />
        ))}

        <button
          className="add-option"
          onClick={() =>
            setSubquestions([...subquestions, { id: uuidv4(), question: "" }])
          }
        >
          Add Question
        </button>
      </div>
    </div>
  );
};

export default Mcq;
