import { useSelector } from "react-redux";
import "./renderer.css"
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Catrender from "./catrender";

const Renderinglist = () => {
 const { id } = useParams();
    
const data=useSelector((store) => store.questions);
const [form, setForm] = useState(null);
const [answers, setAnswers] = useState([{}]);
console.log("answers=",answers);
useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`http://localhost:3000/getform/${id}`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch form");
        }

        const data = await response.json();
        setForm(data);
      } catch (error) {
        console.error("Error fetching form:", error);
      }
    };

    fetchForm();
  }, [id]);
  console.log("form =",form);
    return (
      <>
      <div className="renderer">


        <div className="rendering-header">
         <div className="title-container">
            <h2>{form?.title || "Untitled Form"}</h2>
            <button className="save-button">Submit</button>
          </div>
          {form?.headerImage && (
            <img
              src={form?.headerImage}
              alt="Header"
              className="renderer-header-image"
            />
          )}
          </div>

          {form?.questions && form?.questions.length > 0 ? (
                        form?.questions?.map((question, index) => (
                            <div key={index}>
                                {question.type === "categorize" && (
                                    <Catrender data={question} Qno={index+1} index={index} answers={answers}/>
                                )}
                                

                            </div>
                        ))
                    ) : (
                        <></>
                    )}





            </div>
      </>


    )

}

export default Renderinglist