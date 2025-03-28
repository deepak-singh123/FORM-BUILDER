import { useSelector } from "react-redux";
import "./renderer.css"
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Catrender from "./catrender";
import { IoMdCloudDone } from "react-icons/io";
import Fillrenderer from "./fill";

const Renderinglist = () => {
 const { id } = useParams();
    
const data=useSelector((store) => store.questions);
const [form, setForm] = useState(null);
const [answers, setAnswers] = useState([{}]);
const [active, setActive] = useState(false);
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

  const handlesave=async()=>{
    const data = {
      answers:answers
    }
    try{
    const response = await fetch(`http://localhost:3000/submit-form/${id}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if(!response.ok){
      throw new Error("Network response was not ok");
    }
    const message = await response.json();
    console.log("Success:", message);
    setActive(true);
  }
  catch(error){
    console.error(error);
  }
}
if(form) console.log(form.questions);

console.log("Questions:", form?.questions);



    return (
      <>
      <div className="renderer">


        <div className="rendering-header">
         {active && <div className="Submitted-container">Submitted Successfully <IoMdCloudDone size={60} />
          </div>}
         <div className="title-container">
            <h2>{form?.title || "Untitled Form"}</h2>
            <button className="save-button" onClick={handlesave}>Submit</button>
          </div>
          {form?.headerImage && (
            <img
              src={form?.headerImage}
              alt="Header"
              className="renderer-header-image"
            />
          )}
          </div>

          { !active && form?.questions && form?.questions.length > 0 ? (
                        form?.questions?.map((question, index) => (
                            <div key={index}>
                                {question.type === "categorize" && (
                                    <Catrender data={question} Qno={index+1} index={index} answers={answers}/>
                                )}
                               {question.type === "cloze" && question.preview && (
                                    <Fillrenderer data={question} Qno={index+1} index={index} answers={answers}/>
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