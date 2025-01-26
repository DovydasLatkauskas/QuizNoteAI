import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import { getQuizzes } from "../../api/backend";

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
                        className="p-4 w-[800px] flex flex-col"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Progress Tracker */}
                        <div className="mb-4 text-sm font-medium font-sans text-gray-700">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </div>

                        <h2 className="mb-8 text-4xl font-semibold font-sans">{questions[currentQuestionIndex].questionText}</h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {questions[currentQuestionIndex].answers.map((answer, i) => {
                                let bgColor = "bg-none";
                                if (isSubmitted) {
                                    if (selectedAnswers[currentQuestionIndex] === i) {
                                        bgColor = answer === questions[currentQuestionIndex].correctAnswer
                                            ? "bg-green-500 text-white border-none" // Correct
                                            : "bg-red-500 text-white border-none"; // Wrong
                                    } else if (
                                        answer === questions[currentQuestionIndex].correctAnswer
                                    ) {
                                        bgColor = "bg-green-400 text-white border-none"; // Highlight correct
                                    }
                                } else if (selectedAnswers[currentQuestionIndex] === i) {
                                    bgColor = "bg-blue-300 text-white border-none"; // Selected answer
                                }

                                return (
                                    <motion.li
                                        key={i}
                                        className={`cursor-pointer p-4 font-sans border-2 border-gray-300 rounded text-lg ${bgColor}`}
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
                        <div className="flex flex-row items-center justify-center mt-6 gap-4">
                            {!isSubmitted && (
                                <Button className="w-fit self-center font-sans" onClick={handleSubmitQuestion} disabled={isSubmitted}>
                                    Submit
                                </Button>
                            )}
                            {!isQuizComplete && isSubmitted && (
                                <Button
                                    className="p-2 bg-blue-500 text-white rounded font-sans  w-fit"
                                    onClick={handleNextQuestion}
                                >
                                    {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                                </Button>
                            )}
                        </div>
                        <div className="flex flex-col items-center justify-center mt-4">
                            {isSubmitted && (
                                <p className="mt-2">
                                    {scores[currentQuestionIndex]
                                        ? "Correct! 🎉"
                                        : `Wrong. The correct answer is: ${
                                            questions[currentQuestionIndex].correctAnswer
                                        }`}
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
    const [quizData, setQuizData] = useState<any | null>(null); // Start with null
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { id } = router.query;
  
    useEffect(() => {
      const fetchQuizzes = async () => {
        try {
          const data = await getQuizzes();
          const groupQuizzes = data["groupQuizzesDtos"];
          console.log("Fetched Quizzes:", groupQuizzes);
  
          if (Array.isArray(groupQuizzes)) {
            // Flatten the quizzes, find the matching quiz by ID
            const allQuizzes = groupQuizzes.flatMap((item) => item.quizzes);
            const matchedQuiz = allQuizzes.find((quiz) => quiz.id == id);
  
            if (matchedQuiz) {
              console.log("Matched Quiz:", matchedQuiz);
              setQuizData(matchedQuiz); // Save the full quiz object
            } else {
              console.error("Quiz not found for ID:", id);
              setQuizData(null);
            }
          } else {
            console.error("Unexpected data format for quizzes:", groupQuizzes);
            setQuizData(null);
          }
        } catch (error) {
          console.error("Error fetching Quizzes:", error);
          setQuizData(null);
        } finally {
          setLoading(false); // Loading complete
        }
      };
  
      if (id) {
        fetchQuizzes(); // Fetch quizzes when ID is available
      }
    }, [id]);
  
    // Wait to render until questions are loaded
    if (loading || !quizData) {
      return <div className="flex flex-1 justify-center items-center">Loading...</div>;
    }
  
    return (
      <div className="flex flex-1 justify-center">
        {quizData.questions ? (
          <QuizQuestions questions={quizData.questions} />
        ) : (
          <div className="text-center">No questions found for this quiz.</div>
        )}
      </div>
    );
  }
  