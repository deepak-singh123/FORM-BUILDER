import { useEffect, useState } from "react";
import { RiDeleteBack2Fill } from "react-icons/ri";
import "./Header.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchquestions, resetQuestions } from "../../store/quesSlice";
import { RiResetLeftFill } from "react-icons/ri";

const Header = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [quizTitle, setQuizTitle] = useState("");
  let [file, setfile] = useState(null);
  const [loading, setloading] = useState(false);
  const [savestatus, setsavestatus] = useState("Save");
  const form = useSelector((store) => store.questions);
  const dispatch = useDispatch();
  const questions= form.questions;

  useEffect(() => {
   dispatch(fetchquestions()).unwrap();
  },[dispatch])

  useEffect(() => {
  if(form){
    if(form.headerImage){
    setSelectedImage(form.headerImage);

    if(form.title){
      setQuizTitle(form.title);
    }
    }
  }
},[form])


  const handleTitleChange = (e) => {
    setQuizTitle(e.target.value);
  };



 
 const handleImageUpload = async(e) => {
  setloading(false);
       file = e.target.files[0];
        if (file) {
            setfile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImage(reader.result);
            }
            reader.readAsDataURL(file);
            const formData = new FormData();
            formData.append("file", file);

            try{
              setloading(true);
                const response = await fetch("http://localhost:3000/image-upload", {
                  method: "POST",
                  body: formData,
                });
                if (!response.ok) {
                  throw new Error("Network response was not ok");
                  setloading(false);
                }
                const data = await response.json();
                console.log(data); 
                setSelectedImage(data.url);
                setloading(false);
            }
            catch(error){
                console.error(error);
                setSelectedImage(null);
                setloading(false);
            }
        }
        else { console.log("No file selected"); }
    };

const handleReset = () => {
  setSelectedImage(null);
  setQuizTitle("");
  dispatch(resetQuestions());
};

console.log(questions);

 const handlesave =async ()=>{
  if(!loading){
    setsavestatus("Saving...");
    const data = {
    title:quizTitle,
    headerImage:selectedImage,
    questions:questions
  }
 try{
  const response = await fetch("http://localhost:3000/save-form", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
    if(!response.ok){
      setloading(false);
      throw new Error("Network response was not ok");
      setsavestatus("Save");
    }
  const message = await response.json();
  console.log("Success:", message);
  setsavestatus("Saved");
  }
  catch(error){
    console.error(error);
    setsavestatus("Save");
  }
}
}
  return (
    <div className="header-container">
      <input
        type="text"
        value={quizTitle}
        onChange={handleTitleChange}
        placeholder="Untitled Quiz"
        className="quiz-title-input"
      />


      <div className="header-buttons">
        <button className="reset-button" onClick={handleReset}>
          <RiResetLeftFill size={30}/>
        </button>
      {selectedImage && 
        <div className="header-image-container">
            <img src={selectedImage} alt="Selected" className="selected-image" />
            <div className="header-delete-button" onClick={() => setSelectedImage(null)}><RiDeleteBack2Fill />
            </div>
        </div>
        }
        <label htmlFor="image-upload" className="image-upload-label">
          Add Image
          <input
            type="file"
            id="image-upload"
            className="image-upload-input"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </label>

        <button onClick={handlesave} className="preview-button">
          {savestatus}
        </button>

        <button className="save-button">
          Save & next
        </button>
      </div>
    </div>
  );
};

export default Header;
