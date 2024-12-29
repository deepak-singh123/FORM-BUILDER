
import React, { useEffect, useState } from "react";
import "./Categorize.css";
import "./mcq.css"
import { RxDragHandleDots2 } from "react-icons/rx";
import { CiCircleRemove } from "react-icons/ci";
import { FaImage } from "react-icons/fa";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";
import { addOrUpdateQuestion } from "../../store/quesSlice";
import Submcq from "./Submcq";



const Mcq = ({ Qno, question }) => {

    
  const [points, setPoints] = useState(null);
  const [catdescription, setcatdescription] = useState("");
  let [file, setfile] = useState(null);
  const [descimageloading,setdescimageloading]= useState(false);
  const [selecteddescImage, setSelecteddescImage] = useState(null);
  const [subquestions, setSubquestions] = useState([{id:uuidv4(),question:""}]);
  const dispatch = useDispatch();
  


  const handledescimage = async (e) => {
    file = e.target.files[0];
        if (file) {
            setfile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setSelecteddescImage(reader.result);
            }
            reader.readAsDataURL(file);
            const formData = new FormData();
            formData.append("file", file);

            try{
                setdescimageloading(true);
                const response = await fetch("http://localhost:3000/image-upload", {
                  method: "POST",
                  body: formData,
                });
                if (!response.ok) {
                    setdescimageloading(false);
                  throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setdescimageloading(false);

                setSelecteddescImage(data.url);
            }
            catch(error){
                console.error(error);
                setSelecteddescImage(null);
                setdescimageloading(false);
            }
        }
        else { console.log("No file selected"); }
  };


  const handledescription = (e) => {
    setcatdescription(e.target.value);
  };



    return (
        <>
        <div className="categorize-container">
             <div className="categorize-header">
             <div className="categorise-header-title">
             <div className="drag-icon">
              <RxDragHandleDots2 size={30} />
            </div>
            <h2> Question {Qno + 1} </h2>
          </div>
          <div className="points-input">
            <label>Points:</label>
            <input
              type="number"
              value={points}
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
              onChange={(e) => handledescription(e)}
            />
            
            <button className="option-btn">
              <input
                className="postinputimage"
                type="file"
                accept="image/*,video/*"
                onChange={handledescimage}
              />
              <FaImage size={40} />
            </button>
          </div>

          {selecteddescImage && (
            <div className="description-image">
              <img
                src={selecteddescImage}
                alt="Selected Image"
                className="selected-image"
              />
              <div
                className="header-delete-button"
                onClick={() => setSelecteddescImage(null)}
              >
                <RiDeleteBack2Fill size={30} />
              </div>
            </div>
          )}

          {subquestions && subquestions.map((ques,index)=>{
            return(
              <>
                <Submcq key={ques.id} Qno={Qno} ques={ques} subquestions={subquestions} index={index}/>
              </>)
          })}

<button className="add-option" onClick={() => setSubquestions([...subquestions, {id:uuidv4(),question:" "}])}>
            Add Question
        </button>
        
        </div>
        
        </div>
        </>
    )
};



export default Mcq