import React, { useEffect, useState } from "react";
import "./Categorize.css";
import { RxDragHandleDots2 } from "react-icons/rx";
import { CiCircleRemove } from "react-icons/ci";
import { FaImage } from "react-icons/fa";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";
import { addOrUpdateQuestion } from "../../store/quesSlice";

export const Categorize = ({ Qno ,question}) => {
  const [categories, setCategories] = useState([{ id: uuidv4(), name: "" }]);
  const [items, setItems] = useState([
    { id: uuidv4(), text: "", category: "" },
  ]);
  const [points, setPoints] = useState(null);
  const [catdescription, setcatdescription] = useState("");
  let [file, setfile] = useState(null);
  const [descimageloading,setdescimageloading]= useState(false);
  const [selecteddescImage, setSelecteddescImage] = useState(null);
  const dispatch = useDispatch();
  
  useEffect(() => {
  if(question){
    if(question.image){
      setSelecteddescImage(question.image);
    }
    if(question.description){
      setcatdescription(question.description);
    }
    if(question.points){
      setPoints(question.points);
    }
    if(question.categories){
      setCategories(question.categories);
    }
    if(question.items){
      setItems(question.items);
    }
  }
},[])

  const handleCategoryChange = (index, value) => {
    const updatedCategories = [...categories];

    updatedCategories[index] = { ...updatedCategories[index], name: value };

    setCategories(updatedCategories);
  };

  const handleItemChange = (index, value) => {
    const updatedItems = [...items];

    updatedItems[index] = { ...updatedItems[index], text: value };

    setItems(updatedItems);
   
  };

  const handleremove = (index, type) => {
    if (type === "category") {
      const updatedCategories = [...categories];
      updatedCategories.splice(index, 1);
      setCategories(updatedCategories);
    } else {
      const updatedItems = [...items];
      updatedItems.splice(index, 1);
      setItems(updatedItems);
    }
  };
  const addCategory = () => {
    setCategories([...categories, { id: uuidv4(), name: "" }]);
  };

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
  const handleItemCategoryChange = (index, category) => {
    const updatedItems = items.map((item, idx) =>
      idx === index ? { ...item, category } : item
    );
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { id: uuidv4(), text: "", category: "" }]);
  };

  const handleDragEnd = (result) => {
    console.log(result);
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }
    if (type === "items") {
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        console.log("no change in place");
        return;
      } else {
        console.log("change in place");
        const updatedItems = [...items];
        const [removed] = updatedItems.splice(source.index, 1);
        updatedItems.splice(destination.index, 0, removed);
        setItems(updatedItems);
        return;
      }
    } else if (type === "category") {
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        console.log("no change in place");
        return;
      } else {
        console.log("change in place");
        const updatedCategories = [...categories];
        const [removed] = updatedCategories.splice(source.index, 1);
        updatedCategories.splice(destination.index, 0, removed);
        setCategories(updatedCategories);
        return;
      }
    }
  };

  const saveDataToRedux = () => {
    const questionData = {
      type: "categorize",
      points,
      description: catdescription,
      categories,
      items,
      image: selecteddescImage,
    };
    dispatch(addOrUpdateQuestion({ index: Qno, questionData }));
  };


  useEffect(() => {
    saveDataToRedux();
  }, [categories, items, points, catdescription, selecteddescImage]);

  return (
    <div className="categorize-container">
      <DragDropContext onDragEnd={handleDragEnd}>
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
              placeholder="Description(Optional)"
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
          <label>Categories:</label>
          <Droppable droppableId="categories" type="category">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="categories-section"
              >
                {categories.map((category, index) => (
                  <Draggable
                    key={category.id}
                    draggableId={category.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="category-input-draggable"
                      >
                        <div key={index} className="category-input">
                          <div className="drag-icon">
                            {" "}
                            <RxDragHandleDots2 size={30} />
                          </div>
                          <input
                            type="text"
                            placeholder={`Category ${index + 1}`}
                            value={category.name}
                            onChange={(e) =>
                              handleCategoryChange(index, e.target.value)
                            }
                          />
                          <CiCircleRemove
                            size={40}
                            onClick={() => handleremove(index, "category")}
                          />
                        </div>
                        {provided.placeholder}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <button className="add-btn" onClick={addCategory}>
            Add Category
          </button>
        </div>

        <div className="field">
          <div className="field-titles">
            <label>Items:</label>
            <label>Belongs To:</label>
          </div>
          <Droppable droppableId="items" type="items">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="categories-section"
              >
                {items.map((item, index) => (
                  <div key={index} className="item-input ">
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="item-input-draggable"
                        >
                          <div className="categorise-header-title">
                            <div className="drag-icon">
                              {" "}
                              <RxDragHandleDots2 size={30} />
                            </div>
                            <input
                              type="text"
                              placeholder={`Item ${index + 1}`}
                              value={item.text}
                              onChange={(e) =>
                                handleItemChange(index, e.target.value)
                              }
                            />
                            <CiCircleRemove
                              size={40}
                              onClick={() => handleremove(index, "item")}
                            />
                          </div>
                          {provided.placeholder}
                        </div>
                      )}
                    </Draggable>

                    <div className="Category-match">
                      <select
                        value={item.category}
                        onChange={(e) =>
                          handleItemCategoryChange(index, e.target.value)
                        }
                      >
                        <option value="">Select Category</option>
                        {categories.map((category, catIndex) => (
                          <option key={catIndex} value={category.name}>
                            {category.name || `Category ${catIndex + 1}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <button className="add-btn" onClick={addItem}>
            Add Item
          </button>
        </div>
      </DragDropContext>
    </div>
  );
};
