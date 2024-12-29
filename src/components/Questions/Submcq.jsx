import { useState } from "react";
import { CiCircleRemove } from "react-icons/ci";
import { v4 as uuidv4 } from "uuid";


const Submcq = ({ Qno, question ,index,subquestions}) => {
const [options, setOptions] = useState([{id: uuidv4() ,value:"" ,answer:false}]);



const handleRemoveOption = (index) => {
        const updatedOptions = [...options];
        updatedOptions.splice(index, 1);
        setOptions(updatedOptions);
    };

const handleCheckboxChange = (index) => {
        const updatedOptions = [...options];
        updatedOptions[index].answer = !updatedOptions[index].answer;
        setOptions(updatedOptions);
    };

const handlequestionChange = (index, value) => {
        const updatedquestion = [...question];
        updatedquestion[index].question = value;
        setOptions(updatedquestion);
    };
return(
    <div className="submcq-container">
        <div className="mcq">
            <div className="mcq-header">
                <p>{`Q${Qno+1+`.${index+1}`}`}</p>
            
            <input type="text" value={question} onChange={(e) => handlequestionChange(index, e.target.value)} placeholder="Question"/></div>
             <div className="options">
                {options.map((option,index)=>{
                    return(
                        <div className="option">
                            <input type="checkbox" onClick={() => handleCheckboxChange(index)} value={option.answer} className="option-checkbox"/>
                            <input type="text"  value={option.value} placeholder="Option" className="option-input"/>
                            <CiCircleRemove size={30} onClick={() => handleRemoveOption(index)}/>
                        </div>
                    )
                })}
                 <button className="add-option" onClick={() => setOptions([...options, {id: uuidv4() ,value:"" ,answer:false}])}>
            Add Option
        </button>
             </div>
        </div>
       
    </div>
)

}
export default Submcq