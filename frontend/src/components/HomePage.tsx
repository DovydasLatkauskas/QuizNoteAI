export default function HomePage(){
  let firstName = "Schuyler";
  let lastName = "Good";

  return(
    <div className="flex flex-1">
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
        <h2 className="text-2xl font-semibold dark:text-white font-sans">Welcome back, {firstName}</h2>

        <h2 className="mt-8 text-2xl font-semibold dark:text-white font-sans">Recent Quizzes</h2>
        
     </div>
   </div>
  )
}