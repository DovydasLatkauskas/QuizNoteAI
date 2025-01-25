"use client"
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconPlus,
} from "@tabler/icons-react"; 
import { CirclePlus } from "lucide-react"


// Form controlling
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"

// UI Components
import { Button } from "./ui/button"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { insertFile, createGroup } from "../../api/backend";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"




// TODO: Backend:
// - Get the users groups
// - Get the files in each group
// - Get the content of each file
// - CRUD operations on Groups

// TODO: Frontend:
// - Select all button for each group


export function SelectGroupMenu({ control } : { control: any }) {
  return (
    <Controller
      name="selectGroup"
      control={control}
      render={({ field }) => (
        <Select onValueChange={field.onChange} value={field.value}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CISC 454">CISC 454</SelectItem>
            <SelectItem value="CISC 121">CISC 121</SelectItem>
            <SelectItem value="CISC 486">CISC 486</SelectItem>
          </SelectContent>
        </Select>

      )}
    />
  )
}

export default function ContentPage(){
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [groupName, setGroupName] = useState<string>("");

  const handleCreateGroup = async () => {
    console.log("Creating group: ", groupName);
    const data = ({'groupName': groupName});
    try {
      const response = await createGroup(data);
      console.log("Group created successfully", response);    
    }  
    catch (error) {
      console.error('Failed to create group:', error);
      alert('Failed to create group');
    }
  }
  const [activeTab, setActiveTab] = useState<string>("All"); 
  const [contentModalOpen, setContentModalOpen] = useState<boolean>(true);

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
      title: "CISC 372",
      files: [
        {filepath: "lecture_01.mp3", type: "audio", content: "0:00 - some other description example"},
        {filepath: "lecture_02.mp4", type: "video", content: "0:00 - some other description example"},
      ]
    },
    {
      title: "CISC 235",
      files: [
        {filepath: "lecture_01.pdf", type: "audio", content: "0:00 - some other description example"},
        {filepath: "content_lecture.pdf", type: "document", content: "0:00 - some other description example"},
      ]
    },
  ]

  const handleCheckboxChange = (filePath: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setCheckedItems((prev) => [...prev, filePath]);
    } else {
      setCheckedItems((prev) => prev.filter((item) => item !== filePath));
    }
  };

  interface ContentProps {
    index: number;
    filePath: string;
    content: string;
    type: string;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }

  const formSchema = z.object({
    file: z
      .any()
      .refine((file) => file?.[0], "File is required") // Ensure a file is selected
      .transform((file) => file?.[0]), // Take the first file from FileList
    selectGroup: z.string().nonempty("Group is required"),
  });

  function InputContentForm() {
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        file: null,
        selectGroup: "",
      },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
      const formData = new FormData();
      formData.append("file", values.file); // `values.file` now contains the actual `File` object
      console.log("File: ", formData.get("file"));
      
      const file = formData.get("file") as File | null;
      if (file) {
        console.log("File Name: ", file.name);
      
      console.log("File Group: ", values.selectGroup);
      // Perform your API call with `formData`
        insertFile(formData, file.name, values.selectGroup)
          .then((response) => {
            console.log("File uploaded successfully", response);
          })
          .catch((error) => {
            console.error("Failed to upload file", error);
          });
      }    
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 border border-neutral-200 dark:border-neutral-700 p-4 rounded-md">
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <div className="flex flex-row gap-4">
              {/* Group? */}
              <FormItem className="w-64">
                <FormLabel>Course:</FormLabel>
                <FormControl>
                  <SelectGroupMenu control={form.control} />
                </FormControl>
                <FormDescription>
                  Where would you like to save this under?
                </FormDescription>
                <FormMessage />
              </FormItem>

              {/* File Upload */}
              <FormItem className="w-64">
                <FormLabel>Upload File:</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".pdf,.mp4,.mp3" // Restrict file types if needed
                    onChange={(e) => {
                      field.onChange(e.target.files); // Pass the `FileList` to react-hook-form
                    }}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  />
                </FormControl>
                <FormDescription>
                  This can be a document, video, or audio file.
                </FormDescription>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

function UploadContentDialog({ contentModalOpen, setContentModalOpen }: { 
  contentModalOpen: boolean,
  setContentModalOpen: React.Dispatch<React.SetStateAction<boolean>> 
}) {
  return (
    <Dialog >
      <DialogTrigger asChild>
        <Button onClick={() => {
          setContentModalOpen(true);
        }} className="w-fit bg-blue-500 text-white">
          <CirclePlus/> Add Content
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-fit">
        <DialogHeader >
          <DialogTitle>Add Content</DialogTitle>
          <DialogDescription>
            Upload PDF's, Video lectures, Audio files and more.
          </DialogDescription>
        </DialogHeader>
        <div>
          <InputContentForm></InputContentForm>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const Content: React.FC<ContentProps> = ({ index, filePath, content, type, checked, onChange }) => {
  return (
    <AnimatePresence>
      <motion.div
        whileHover={{
          scale: 1.05, // Slightly increase size on hover
          cursor: "pointer", // Change cursor to pointer
        }}
        animate={{
          scale: checked ? 1.03 : 1, // Increase size if checked
        }}
        transition={{
          duration: 0.2, // Animation duration
          ease: "easeInOut", // Smooth easing
        }}
      >
        <Card key={index} className={`w-72 ${checked ? "bg-blue-100" : ""}`}>
          <CardHeader className="flex flex-row items-center gap-2">
            <input
              type="checkbox"
              checked={checked}
              onChange={onChange}
              className="h-4 w-4 rounded"
            />
            <CardTitle>{filePath}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{content.substring(0, 30)}...</CardDescription>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

  function GroupTabsMenu({ groups } : { groups: any }) {

    let allFiles = groups.map((group: any) => group.files).flat();
    groups.unshift({title: "All", files: allFiles});
    let numOfCols = "grid-cols-" + groups.length;
    const defaultGroup = groups.length > 0 ? groups[0].title : "";
    
    return(
      <Tabs defaultValue={defaultGroup} className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className={` gap-4`}>
          {groups.map((group: any, index: number) => (
            <TabsTrigger key={index} value={group.title}>{group.title}</TabsTrigger>
          ))}
        </TabsList>
  
        {groups.map((group: any, index: number) => (
          <TabsContent key={index} value={group.title}>
            <Card className="">
              <CardHeader>
                <CardTitle>{group.title}</CardTitle>
                <CardDescription>
                  All your files associated with {group.title}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-row gap-4 flex-wrap">
                {group.files.map((file: any, index: number) => (
                  <Content
                    key={index}
                    index={index}
                    filePath={file.filepath}
                    content={file.content}
                    type={file.type}
                    checked={checkedItems.includes(file.filepath)}
                    onChange={handleCheckboxChange(file.filepath)}
                  />
                ))}
              </CardContent>
              <CardFooter>
                {/* <Button className="bg-red-500" onClick={() => {}}>Delete Group</Button> */}
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    )
  }

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
          <InputContentForm />
        </div>
        
        <h3 className="text-2xl mt-12">Files</h3>
        <div>
          <input
            type="text"
            placeholder="Enter Group Name"
            onChange={(e) => setGroupName(e.target.value)}
            value={groupName}
          />
          <Button onClick={handleCreateGroup}>Create Group</Button>
        </div>
        <div className="flex flex-row gap-4 w-full flex-wrap">
          {groups.map((group, index) => (
            <div key={index}>
              <h3 className="text-xl">{group.title}</h3>
              {group.files.map((file, index) => (
                <Content
                  content={file.content}
                  key={index}
                  index={index}
                  filePath={file.filepath}
                  type={file.type}
                  checked={checkedItems.includes(file.filepath)}
                  onChange={handleCheckboxChange(file.filepath)}
                />
              ))}
            </div>
          ))}
        </div>
        <h2 className="text-3xl font-semibold dark:text-white">Content</h2>
        { contentModalOpen ? 
          <UploadContentDialog contentModalOpen={contentModalOpen} setContentModalOpen={setContentModalOpen}/>
          : 
          null
        }
        <GroupTabsMenu groups={groups} />
     </div>
   </div>
  )
}