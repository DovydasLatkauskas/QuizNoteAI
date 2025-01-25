import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import { getQuiz } from "../../api/backend";
import { Button } from "./ui/button";
import { useRouter } from 'next/router';


interface QuizPageProps {
    quiz?: string | string[] | undefined;
}

const QuizQuestions: React.FC<{
    questions: {
        question: string;
        answers: string[];
        correctAnswer: string;
        source: string;
    }[];
    }> = ({ questions }) => {
    const [scores, setScores] = useState<{ [key: number]: boolean | null }>({});
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question
    const [isQuizComplete, setIsQuizComplete] = useState(false); // Track quiz completion
    const [isSubmitted, setIsSubmitted] = useState(false); // Track if the current question was submitted

    const router = useRouter();

    const handleReturnClick = () => {
        router.push('/Dashboard/Quizzes');
      };

    const handleAnswerClick = (answerIndex: number) => {
        if (!isSubmitted) {
            setSelectedAnswers((prevSelectedAnswers) => ({
                ...prevSelectedAnswers,
                [currentQuestionIndex]: answerIndex,
            }));
        }
    };

    const handleSubmitQuestion = () => {
        if (selectedAnswers[currentQuestionIndex] !== undefined) {
            const isCorrect =
                questions[currentQuestionIndex].answers[selectedAnswers[currentQuestionIndex]] ===
                questions[currentQuestionIndex].correctAnswer;
            setScores((prevScores) => ({
                ...prevScores,
                [currentQuestionIndex]: isCorrect,
            }));
            setIsSubmitted(true); // Mark question as submitted
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
            setIsSubmitted(false); // Reset submission status for the next question
        } else {
            setIsQuizComplete(true); // Mark the quiz as complete
        }
    };

    const totalScore = Object.values(scores).filter((score) => score === true).length;

    return (
        <div className="flex items-center justify-center ">
            <AnimatePresence mode="wait">
                {!isQuizComplete && currentQuestionIndex < questions.length && (
                    <motion.div
                        key={currentQuestionIndex}
                        className="p-4 border-2 rounded-xl w-[800px] flex flex-col"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Progress Tracker */}
                        <div className="mb-4 text-sm font-medium font-sans text-gray-700">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </div>

                        <h2 className="mb-16 text-4xl font-semibold font-sans">{questions[currentQuestionIndex].question}</h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {questions[currentQuestionIndex].answers.map((answer, i) => {
                                let bgColor = "bg-gray-200 hover:bg-gray-300";
                                if (isSubmitted) {
                                    if (selectedAnswers[currentQuestionIndex] === i) {
                                        bgColor =
                                            answer ===
                                            questions[currentQuestionIndex].correctAnswer
                                                ? "bg-green-500 text-white" // Correct
                                                : "bg-red-500 text-white"; // Wrong
                                    } else if (
                                        answer ===
                                        questions[currentQuestionIndex].correctAnswer
                                    ) {
                                        bgColor = "bg-green-500 text-white"; // Highlight correct
                                    }
                                } else if (selectedAnswers[currentQuestionIndex] === i) {
                                    bgColor = "bg-blue-500 text-white"; // Selected answer
                                }

                                return (
                                    <motion.li
                                        key={i}
                                        className={`cursor-pointer p-2 font-sans rounded ${bgColor}`}
                                        whileHover={{ 
                                            scale: 1.025
                                            
                                        }}
                                        onClick={() => handleAnswerClick(i)}
                                    >
                                        {answer}
                                    </motion.li>
                                );
                            })}
                        </ul>
                        <Button className="mt-6 w-fit self-center font-sans" onClick={handleSubmitQuestion} disabled={isSubmitted}>
                            Submit
                        </Button>
                        {isSubmitted && (
                            <p className="mt-2">
                                {scores[currentQuestionIndex]
                                    ? "Correct! 🎉"
                                    : `Wrong. The correct answer is: ${
                                        questions[currentQuestionIndex].correctAnswer
                                    }`}
                            </p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* "Next Question" button */}
            {!isQuizComplete && isSubmitted && (
                <button
                    className="p-2 bg-blue-500 text-white rounded"
                    onClick={handleNextQuestion}
                >
                    {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                </button>
            )}

            {/* Completion message */}
            {isQuizComplete && (
                <motion.div
                    key="completion"
                    className="text-center"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="text-xl font-bold">Quiz Complete! 🎉</p>
                    <p className="text-lg mt-4">You scored {totalScore} out of {questions.length}.</p>
                    <Button className="mt-4 bg-blue-500 " onClick={handleReturnClick}>Return</Button>
                </motion.div>
            )}
        </div>
    );
};

export default function QuizPage({ quiz }: QuizPageProps) {
    const sampleQuestions = [
        {
            question: "What is the capital of France?",
            answers: ["Paris", "Blah", "Bleh", "Blue"],
            correctAnswer: "Paris",
            source: "slides-week-1.pdf",
        },
        {
            question: "What is the capital of Germany?",
            answers: ["Blah", "Berlin", "Bleh", "Blue"],
            correctAnswer: "Berlin",
            source: "slides-week-1.pdf",
        },
    ];

    const fetchQuiz = async () => {
        const quizData = await getQuiz(quiz);
        console.log(quiz);
    };

    return (
        <div className="flex flex-1 justify-center">
            <QuizQuestions questions={sampleQuestions} />
        </div>
    );
}
