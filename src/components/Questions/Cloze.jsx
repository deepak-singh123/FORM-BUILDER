import React, { useEffect, useState } from "react";
import "./Cloze.css";
import { RxDragHandleDots2 } from "react-icons/rx";
import { CiCircleRemove } from "react-icons/ci";
import { PiTextUnderlineFill } from "react-icons/pi";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import { addOrUpdateQuestion } from "../../store/quesSlice";
import { FaImage } from "react-icons/fa";
import { RiDeleteBack2Fill } from "react-icons/ri";

const Cloze = ({ Qno, question }) => {
  const [points, setPoints] = useState(null);
  const [sentence, setSentence] = useState("");
  const [underlinedWords, setUnderlinedWords] = useState([]);
  const [previewText, setPreviewText] = useState("");
  const [selectedWords, setSelectedWords] = useState([]);
  const [file, setFile] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (question) {
      setSentence(question.sentence || "");
      setUnderlinedWords(question.options || []);
      setPoints(question.points || null);
      setSelectedImage(question.image || null);
    }
  }, [question]);

  useEffect(() => {
    updatePreview();
  }, [sentence, underlinedWords]);

  const updatePreview = () => {
    let preview = sentence;

    underlinedWords.forEach((word) => {
      if (word.type !== "extra") {
        const regex = new RegExp(`\\b${word.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
        preview = preview.replace(regex, "___");
      }
    });

    setPreviewText(preview);
  };

  const handleSentenceChange = (e) => {
    setSentence(e.target.value);
  };

  const handleMouseUp = () => {
    setTimeout(() => {
      const selection = window.getSelection().toString().trim();
      if (selection) {
        const words = selection.split(/\s+/);
        setSelectedWords(words);
      }
    }, 50);
  };

  useEffect(() => {
    document.addEventListener("touchend", handleMouseUp);
    return () => document.removeEventListener("touchend", handleMouseUp);
  }, []);

  const handleUnderlineWord = () => {
    const newWords = selectedWords.filter(
      (word) =>
        sentence.includes(word) &&
        !underlinedWords.some((w) => w.text === word)
    );

    if (newWords.length > 0) {
      setUnderlinedWords((prev) => [
        ...prev,
        ...newWords.map((word) => ({
          id: uuidv4(),
          text: word,
          isselected: true,
          type: "underlined",
        })),
      ]);
    }

    setSelectedWords([]);
  };

  const handleDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;

    const items = Array.from(underlinedWords);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    setUnderlinedWords(items);
  };

  const saveDataToRedux = () => {
    const questionData = {
      type: "cloze",
      points,
      preview: previewText,
      sentence,
      options: underlinedWords,
      image: selectedImage,
    };
    dispatch(addOrUpdateQuestion({ index: Qno, questionData }));
  };

  useEffect(() => {
    saveDataToRedux();
  }, [points, previewText, underlinedWords, selectedImage]);

  return (
    <div className="cloze-container">
      <div className="cloze-header">
        <div className="cloze-header-title">
          <RxDragHandleDots2 size={30} />
          <h2>Question {Qno + 1}</h2>
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

      <label>Preview:</label>
      <div className="preview-field">
        <input type="text" value={previewText} readOnly placeholder="Preview will update dynamically" />
      </div>

      <div className="underline-btn-container">
        <label>Sentence:</label>
        <button className="underline-btn" onClick={handleUnderlineWord}>
          <PiTextUnderlineFill size={40} />
        </button>
      </div>

      <div className="sentence-input">
        <input
          type="text"
          value={sentence}
          onChange={handleSentenceChange}
          placeholder="Enter the sentence"
          onMouseUp={handleMouseUp}
        />
      </div>

      <div className="underlined-words">
        <label>Underlined Words:</label>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="underlinedWords">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {underlinedWords.map((word, index) => (
                  <Draggable key={word.id} draggableId={word.id} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="underlined-word">
                        <div className="fill-option">
                          <RxDragHandleDots2 size={30} />
                          <input type="text" value={word.text} readOnly className="option-input" />
                          <CiCircleRemove size={30} onClick={() => setUnderlinedWords(underlinedWords.filter((_, i) => i !== index))} />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Cloze;
