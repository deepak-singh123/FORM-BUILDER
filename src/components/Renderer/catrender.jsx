import React, { useEffect, useState } from "react";
import "./catrenderer.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Catrender = ({ data, Qno ,answers ,index}) => {
  const { description, points, image, items, categories } = data;
  const colors = ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff"];
console.log(data);
  const [categoriesState, setCategoriesState] = useState(
    categories.map((category) => ({
      ...category,
      items: [], // Initialize empty array for items
    }))
  );
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    console.log(result);


    // If dropped outside a valid droppable area
    if (!destination) {
      console.warn("Dropped outside any droppable!");
      return;
    }

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId
    ) {
      console.warn("Dropped in the same place!");
      return;
    }

    // Handle item movement
    if (source.droppableId === "items"  && destination.droppableId.startsWith("category")) {
     
        const [movedItem] = items.splice(source.index, 1);
        const categoryIndex = parseInt(destination.droppableId.replace("category", ""), 10);
        const updatedCategories = [...categoriesState];
        updatedCategories[categoryIndex].items.push(movedItem);
        setCategoriesState(updatedCategories);
    }
    else if (source.droppableId.startsWith("category") && destination.droppableId === "items") {
        const categoryIndex = parseInt(source.droppableId.replace("category", ""), 10);
        const updatedCategories = [...categoriesState];
        const [movedItem] = updatedCategories[categoryIndex].items.splice(source.index, 1);
        
        // Push movedItem to the main items list (if items is a state)
        items.push(movedItem);
        setCategoriesState(updatedCategories);
      }
      
  };

useEffect(()=>{
    answers[index].questionId=data._id;
    answers[index].response={questionno:Qno,description,answers:categoriesState}
},[categoriesState])



  return (
    <div className="categorize-component">
      <div className="header">
        <h2>Q{Qno}</h2>
        <h3>{description}</h3>
        {points && <p>Points: {points}</p>}
      </div>

      {image && <img src={image} alt="Category Image" className="category-image" />}

      <DragDropContext onDragEnd={handleDragEnd}>
        {/* Draggable Items */}
        <div className="items-container">
          <h3>Items:</h3>
          <Droppable droppableId="items">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="items-droppable-container"
              >
                {items.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={`item-${item.id}`}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="item-check-list"
                      >
                       <div className="item-content">
                    <div className="item-name">{item.text}</div>
                   </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        {/* Categories */}
        <h3>Categories:</h3>
        <div className="Categories-containers">
          {categoriesState.map((category, index) => (
            <Droppable key={category.id} droppableId={"category"+index}  >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="categories-droppable-container"
                  
                >
                <div className="category-container">
                <div style={{
          backgroundColor: colors[index % colors.length],
           }} className="category-name">{category.name}</div>
                <div className="empty-sapce"></div>
                <div className="category-item"  style={{
          backgroundColor: colors[index % colors.length],
           }}>
            
                  <div className="category-items">
                    {category.items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={`item-${item.id}`}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="category-to-items"
                          >
                            {item.text}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                  </div>
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Catrender;
