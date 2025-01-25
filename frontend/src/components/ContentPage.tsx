import React, { useState } from "react";
import { Button } from "./ui/button"
import { motion, AnimatePresence } from "framer-motion";



export default function ContentPage(){
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  let videos: any[] = [
    { title: "Video 1" },
    { title: "Video 2" },
    { title: "Video 3" }
  ]
  let audios: any[] = [
    { title: "Audio 1" },
    { title: "Audio 2" },
    { title: "Audio 3" }
  ]
  let documents: any[] = [
    { title: "Document 1" },
    { title: "Document 2" },
  ]

  // Content component with a checkbox
  interface ContentProps {
    title: string;
    type: string;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }

  const Content: React.FC<ContentProps> = ({ title, type, checked, onChange }) => {
    return (
      <AnimatePresence>
        <motion.div
          key={title}
          exit={{ opacity: 0 }}
          className="gap-2 rounded-md aspect-square w-32 mb-2 bg-[#e5e7eb]"
          animate={{ backgroundColor: checked ? "rgb(191, 219, 254)" : "rgb(229, 231, 235)" }} // bg-blue-200 and bg-gray-200
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-row items-center gap-2 p-2">
            <input 
              className="peer h-5 w-5 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" 
              type="checkbox" 
              checked={checked} 
              onChange={onChange}
            />
            <p className="font-sans text-lg">{title}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }

  const handleCheckboxChange = (title: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setCheckedItems((prev) => [...prev, title]);
    } else {
      setCheckedItems((prev) => prev.filter((item) => item !== title));
    }
  };

  return(
    <div className="flex flex-1">
      {checkedItems.length > 0 && (
        <div className="absolute bottom-0 right-0 m-4 p-2 md:p-10 rounded-tl-2xl ">
          <Button onClick={() => {}} className="bg-blue-500">Create Quiz</Button>
        </div>
      )}

      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 
      bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full overflow-y-auto">
        <h2 className="text-2xl font-semibold dark:text-white">Content</h2>
        <Button onClick={() => {}} className="w-24">Add Content</Button>
        
        <h3 className="text-2xl mt-12">Videos</h3>
        <div className="flex flex-row gap-4 w-full flex-wrap">
          {videos.map((video, index) => (
            <Content
              key={index}
              title={video.title}
              type="video"
              checked={checkedItems.includes(video.title)}
              onChange={handleCheckboxChange(video.title)}
            />
          ))}
        </div>

        <h3 className="text-2xl mt-12">Audios</h3>
        <div className="flex flex-row gap-4 w-full flex-wrap">
          {audios.map((audio, index) => (
            <Content
              key={index}
              title={audio.title}
              type="audio"
              checked={checkedItems.includes(audio.title)}
              onChange={handleCheckboxChange(audio.title)}
            />
          ))}
        </div>

        <h3 className="text-2xl mt-12">Documents</h3>
        <div className="flex flex-row gap-4 w-full flex-wrap">
          {documents.map((document, index) => (
            <Content
              key={index}
              title={document.title}
              type="document"
              checked={checkedItems.includes(document.title)}
              onChange={handleCheckboxChange(document.title)}
            />
          ))}
        </div>
     </div>
   </div>
  )
}