import React from "react";
import { Categorize } from "./Categorize";

export const Questionlist = ({ questions }) => {
    return (
        <div className="questions-container">
            <div className="question-list">
                
                <ul>
                    { questions && questions.map((question, index) => (
                        <li key={index}><Categorize  Qno={index}/></li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Questionlist;
