import React, { useState, useEffect } from "react";
import "./fill.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Fillrenderer = ({ data, Qno, answers, index }) => {
  console.log("Qno=", Qno);
  const { image, options, preview, points } = data;

  // Extract words from the sentence & track blank positions
  const words = preview.split(" ").map((word, i) => ({
    id: word.includes("___") ? `blank-${i}` : `word-${i}`,
    content: word.includes("___") ? "___" : word,
    isBlank: word.includes("___"), // Mark blank spaces
  }));

  const [sentenceWords, setSentenceWords] = useState(words);
  const [availableOptions, setAvailableOptions] = useState(
    options.map((opt, i) => ({ id: `option-${i}`, content: opt.text }))
  );

  // Update the answers array whenever sentenceWords changes
  useEffect(() => {
    const filledAnswers = sentenceWords
      .filter(word => word.isBlank && word.content !== "___") // Only selected words
      .map(word => word.content);

    answers[index].questionId = data._id;
    answers[index].response = {
      questionno: Qno,
      description: data.description,
      answers: filledAnswers, // Store only filled blanks
    };
  }, [sentenceWords, answers, index, Qno, data]);
  
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // Dropping a word in a blank space
    if (destination.droppableId === "sentence") {
      setSentenceWords((prev) => {
        const newWords = [...prev];

        // Ensure only blanks get replaced
        if (newWords[destination.index].isBlank) {
          newWords[destination.index] = { ...availableOptions[source.index], isBlank: true };

          // Remove from available options
          setAvailableOptions((prev) => prev.filter((_, i) => i !== source.index));
        }
        return newWords;
      });
    }
  };

  return (
    <div className="fill-container">
      <div className="fill-header">
        <h3>Question {Qno}</h3>
        {points && <span className="points">{points} Points</span>}
      </div>
      {image && <img src={image} alt="Question" className="question-image" />}
      <p className="instruction">Fill in the blanks:</p>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sentence" direction="horizontal">
          {(provided) => (
            <div className="sentence" ref={provided.innerRef} {...provided.droppableProps}>
              {sentenceWords.map((word, index) => (
                <Draggable key={word.id} draggableId={word.id} index={index} isDragDisabled={!word.isBlank}>
                  {(provided) => (
                    <span
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={word.isBlank ? "blank" : "word"}
                    >
                      {word.content}
                    </span>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <h4 className="options-header">Options:</h4>
        <Droppable droppableId="options">
          {(provided) => (
            <div className="options" ref={provided.innerRef} {...provided.droppableProps}>
              {availableOptions.map((opt, index) => (
                <Draggable key={opt.id} draggableId={opt.id} index={index}>
                  {(provided) => (
                    <span
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="option"
                    >
                      {opt.content}
                    </span>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Fillrenderer;
