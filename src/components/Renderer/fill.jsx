import React, { useEffect, useState } from "react";
import "./Catrenderer.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Fillrenderer = ({ data, Qno ,answers ,index}) => {
  const {image,options,preview,sentence,points } = data;
console.log("data=",data);

for (let word of preview.split(' ')) {
  console.log(word);
}


   const handleDragEnd = (result) => {
    console.log(result);
  
      
  };




  return (
    <>
    this i sfillup
    </>
  );
};

export default Fillrenderer;
