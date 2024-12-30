import React, { useEffect } from "react";
import { Categorize } from "./Categorize";
import { useDispatch, useSelector } from "react-redux";
import { fetchquestions } from "../../store/quesSlice";
import Cloze from "./Cloze";
import Mcq from "./mcq";

export const Questionlist = () => {
    const dispatch = useDispatch();
    const uid = useSelector((store) => store.questions.uid);
    // Fetch questions when the component mounts
    useEffect(() => {
        dispatch(fetchquestions(uid));
    }, [dispatch,uid]);

    // Access questions from the Redux store
    const questions = useSelector((store) => store.questions.questions);
console.log("question=",questions);
    return (
        <div className="questions-container">
            <div className="question-list">
                <ul>
                    {questions && questions.length > 0 ? (
                        questions.map((question, index) => (
                            <li key={index}>
                                {question.type === "categorize" && (
                                    <Categorize question={question} Qno={index} />
                                )}
                                {question.type === "cloze" && (
                                    <Cloze question={question} Qno={index} />
                                )}
                                {question.type === "comprehention" && (
                                    <Mcq question={question} Qno={index} />
                                )}

                            </li>
                        ))
                    ) : (
                        <li></li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Questionlist;
