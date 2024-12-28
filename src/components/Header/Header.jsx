import { useState } from "react";
import { RiDeleteBack2Fill } from "react-icons/ri";
import "./Header.css";

const Header = ({ onSave, onPreview, onImageUpload }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [quizTitle, setQuizTitle] = useState("");
  let [file, setfile] = useState(null);
  const handleTitleChange = (e) => {
    setQuizTitle(e.target.value);
  };



 

    const handleImageUpload = (e) => {
       file = e.target.files[0];
        if (file) {
            setfile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImage(reader.result);
            }
            reader.readAsDataURL(file);
        }
        else { console.log("No file selected"); }
    };
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

        <button onClick={onPreview} className="preview-button">
          Save
        </button>

        <button onClick={onSave} className="save-button">
          Save & next
        </button>
      </div>
    </div>
  );
};

export default Header;
