import React, { useState } from "react";
import { Button } from "./ui/button"
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


export default function ContentPage(){
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  let groups = [
    {
      title: "CISC 454",
      files: [
        {filepath: "lecture_01.mp4", type: "video", content: "0:00 - There was a man named John..."},
        {filepath: "lecture_notes_02.pdf", type: "document", content: "0:00 - There was another man named Eric"},
        {filepath: "lecture_03.mp4", type: "video", content: "0:00 - There "},
      ]
    },
    {
      title: "CISC 454",
      files: [
        {filepath: "lecture_01.mp3", type: "audio", content: "0:00 - some other description example"},
        {filepath: "lecture_02.mp4", type: "video", content: "0:00 - some other description example"},
        {filepath: "lecture_03.mp4", type: "video", content: "0:00 - some other description example"},
      ]
    },
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
        {/* <Button onClick={() => {}} className="w-24">Add Content</Button> */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Input id="picture" type="file" />
        </div>
        
        <h3 className="text-2xl mt-12">Files</h3>
        <div className="flex flex-row gap-4 w-full flex-wrap">
          {groups.map((group, index) => (
            <div>
              <h3 className="text-xl">{group.title}</h3>
              {group.files.map((file, index) => (
                <Content
                  key={index}
                  title={file.filepath}
                  type={file.type}
                  checked={checkedItems.includes(file.filepath)}
                  onChange={handleCheckboxChange(file.filepath)}
                />
              ))}
            </div>
          ))}
        </div>
     </div>
   </div>
  )
}