import { Button } from "./ui/button"
import { motion } from "framer-motion"
import ExpandableCardDemo from "@/components/ExpandableCardDemo"

export default function QuizzesPage(){
  const colorBank = ["bg-blue-200", "bg-green-200", "bg-yellow-200", "bg-red-200", "bg-purple-200", "bg-pink-200", "bg-indigo-200", "bg-gray-200", "bg-orange-200"]

  // Load all quizzes in this format:
  type QuizContent = {
    quizID: number;
    title: string;
    description: string; // For the card
    ctaText: string; // For the card
    ctaLink: string; // For the card
    imageNumber: number; // For the card image
    sources: string[];
    questions: {
      question: string;
      answers: string[];
      correctAnswer: string;
      source: string;
    }[];
  };

  // Gemini Input parsing
  // let string = "{\n  \"quiz\": {\n    \"title\": \"Whale Biology Quiz\",\n    \"questions\": [\n      {\n        \"question\": \"To which order do whales, dolphins, and porpoises belong?\",\n        \"answers\": [\n          \"Artiodactyla\",\n          \"Cetacea\",\n          \"Cetartiodactyla\",\n          \"Perissodactyla\"\n        ],\n        \"correctAnswer\": \"Cetartiodactyla\",\n        \"source\": \"1\"\n      },\n      {\n        \"question\": \"Approximately how many million years ago did whales diverge from their closest living relatives, the hippos?\",\n        \"answers\": [\n          \"20 million years ago\",\n          \"34 million years ago\",\n          \"54 million years ago\",\n          \"100 million years ago\"\n        ],\n        \"correctAnswer\": \"54 million years ago\",\n        \"source\": \"1\"\n      },\n      {\n        \"question\": \"Which of the following is NOT a family of baleen whales?\",\n        \"answers\": [\n          \"Balaenopteridae\",\n          \"Physeteridae\",\n          \"Balaenidae\",\n          \"Eschrichtiidae\"\n        ],\n        \"correctAnswer\": \"Physeteridae\",\n        \"source\": \"1\"\n      },\n      {\n        \"question\": \"What is the largest known animal that has ever lived?\",\n        \"answers\": [\n          \"Sperm Whale\",\n          \"Blue Whale\",\n          \"Antarctic Blue Whale\",\n          \"Fin Whale\"\n        ],\n        \"correctAnswer\": \"Blue Whale\",\n        \"source\": \"2\"\n      },\n      {\n        \"question\": \"How do baleen whales feed?\",\n        \"answers\": [\n          \"Using conical teeth to catch fish\",\n          \"Using baleen plates to filter krill and plankton\",\n          \"Using echolocation to find prey\",\n          \"By ambushing prey from below\"\n        ],\n        \"correctAnswer\": \"Using baleen plates to filter krill and plankton\",\n        \"source\": \"2\"\n      }\n    ]\n  }\n}"
  // string = string.replace(/\n/g, "")
  // let json = JSON.parse(string)
  // console.log(json)

  let quizzes: QuizContent[] = [
    {
      quizID: 1,
      title:"Capitals and Countries",
      description: "Test your knowledge of world capitals!",
      ctaText: "Start Quiz",
      ctaLink: `/Dashboard/Quizzes/${1}`,
      imageNumber: 1,
      sources: ["slides-week-1.pdf"],
      questions: [
        {
          question: "What is the capital of France?",
          answers: ["Paris", "Berlin", "London", "Madrid"],
          correctAnswer: "Paris",
          source:"slides-week-1.pdf"
        },
        {
          question: "What is the capital of Germany?",
          answers: ["Paris", "Berlin", "London", "Madrid"],
          correctAnswer: "Berlin",
          source:"slides-week-1.pdf"
        },
        {
          question: "What is the capital of the UK?",
          answers: ["Paris", "Berlin", "London", "Madrid"],
          correctAnswer: "London",
          source:"slides-week-1.pdf"
        },
        {
          question: "What is the capital of Spain?",
          answers: ["Paris", "Berlin", "London", "Madrid"],
          correctAnswer: "Madrid",
          source:"slides-week-1.pdf"
        }
      ],
    },
    {
      quizID: 2,
      title:"Star Wars Trivia",
      description: "Test your knowledge of Star Wars!",
      ctaText: "Start Quiz",
      ctaLink: `/Dashboard/Quizzes/${2}`,
      imageNumber: 2,
      sources: ["star-wars-info.pdf"],
      questions: [
        {
          question: "Who is Luke Skywalker's father?",
          answers: ["Darth Vader", "Obi-Wan Kenobi", "Han Solo", "Yoda"],
          correctAnswer: "Darth Vader",
          source:"star-wars-info.pdf"
        },
        {
          question: "What is the name of the planet that is home to Wookies?",
          answers: ["Tatooine", "Hoth", "Endor", "Kashyyyk"],
          correctAnswer: "Kashyyyk",
          source:"star-wars-info.pdf"
        },
      ],
    }
  ]


  return(
    <div className="flex flex-1">
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 
      bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full overflow-y-auto">
        <h2 className="text-2xl font-semibold dark:text-white font-sans">Quizzes</h2>
        <p className="font-sans">Head to the <strong>content</strong> panel to make a new quiz!</p>
        {/* <Button onClick={() => {}} className="w-24">New Quiz</Button> */}

        <ExpandableCardDemo quizzes={quizzes}/>
     </div>
   </div>
  )
}