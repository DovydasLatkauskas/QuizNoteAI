interface QuizPageProps {
    quiz?: string | string[] | undefined
}

export default function QuizPage({quiz}: QuizPageProps) {

    // fetchQuizData = async () => {
    //     const response = await fetch('https://opentdb.com/api.php?amount=10');
    //     const data = await response.json();
    //     console.log(data);
    // }
    //
    // useEffect(() => {
    //     fetchQuizData();
    // }, []);

    return (
        <div>
            <h1>Quiz Page {quiz}</h1>
        </div>
    )
}