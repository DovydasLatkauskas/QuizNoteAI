import { Button } from "./ui/button"

export default function QuizzesPage(){
  return(
    <div className="flex flex-1">
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 
      bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full overflow-y-auto">
        <h2 className="text-2xl font-semibold dark:text-white">Quizzes</h2>
        <p>Head to the <strong>content</strong> panel to make a new quiz!</p>
        {/* <Button onClick={() => {}} className="w-24">New Quiz</Button> */}

        {/* New stuff */}
        


     </div>
   </div>
  )
}