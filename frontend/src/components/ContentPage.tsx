"use client"
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconBolt,
  IconSquareRoundedX,
  IconPlus
} from "@tabler/icons-react"; 
import { CirclePlus } from "lucide-react"
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";

// Form controlling
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"

// UI Components
import { Button } from "./ui/button"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const loadingStates = [
  {
    text: "Sending data to server",
  },
  {
    text: "Parsing files",
  },
  {
    text: "Generating transcripts",
  },
  {
    text: "Analyzing data",
  },
  {
    text: "Creating Quiz",
  },
  {
    text: "Done!",
  },
];

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
    try {
      const response = await createGroup(groupName);
      console.log("Group created successfully", response);    
    }  
    catch (error) {
      console.error('Failed to create group:', error);
      alert('Failed to create group');
    }
  }
  const [activeTab, setActiveTab] = useState<string>("All"); 
  const [contentModalOpen, setContentModalOpen] = useState<boolean>(true);
  const [quizModalOpen, setQuizModalOpen] = useState<boolean>(false);
  const [createQuizLoading, setCreateQuizLoading] = useState(false);

  useEffect(() => {
    if (createQuizLoading) {
      const timer = setTimeout(() => {
        setCreateQuizLoading(false);
      }, 5000); // Set the duration to 5 seconds

      return () => clearTimeout(timer);
    }
  }, [createQuizLoading]);

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

  // Schemas
  const formSchema = z.object({
    file: z
      .any()
      .refine((file) => file?.[0], "File is required") // Ensure a file is selected
      .transform((file) => file?.[0]), // Take the first file from FileList
    selectGroup: z.string().nonempty("Group is required"),
  });

  const createQuizSchema = z.object({
    specifications: z.string(),
  });

  // Forms
  function CreateQuizForm() {
    const form = useForm<z.infer<typeof createQuizSchema>>({
      resolver: zodResolver(createQuizSchema),
      defaultValues: {
        specifications: "",
      },
    });
    function onQuizSubmit(values: z.infer<typeof createQuizSchema>) {
      const formData = new FormData();
      formData.append("specifications", values.specifications);
      // console.log("Checked Items: ", checkedItems);
      // console.log("On Submit Create Quiz Form Data: ", formData.get("specifications"));
      
      // PERFORM API CALL WITH THIS DATA
      let dataSendingToAPI = {
        specifications: formData.get("specifications"),
        checkedItems: checkedItems
      }
    }
    return (
      <div>
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onQuizSubmit)} 
            className="space-y-8 border border-neutral-200 dark:border-neutral-700 p-4 rounded-md"
          >
            <FormField
              control={form.control}
              name="specifications"
              render={({ field }) => (
                <div className="flex flex-col gap-4">
                  <h3 className="font-sans font-semibold text-lg">Drawing material from:</h3>
                  <div className="flex flex-row gap-4 flex-wrap">
                    {checkedItems.map((item, index) => {
                      return (
                        <div key={index}>
                          <Badge>{item}</Badge>
                        </div>
                      )
                    })}
                  </div>
                  <FormItem className="mt-6">
                    <FormLabel className="font-sans font-semibold text-lg">Additional Specifications:</FormLabel>
                    <FormControl>
                      <Textarea
                        className="w-full"
                        placeholder="Focus on questions from the 18th century of France..." 

                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                        onBlur={field.onBlur}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />
            <Button type="submit" className="w-full bg-blue-500 text-white" onClick={() => {
              setCreateQuizLoading(true);
              // CALL API HERE
            }}>
              <IconBolt/>Generate Quiz
            </Button>
          </form>
        </Form>
      </div>
    );
  }

  function InputContentForm() {
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        file: null,
        selectGroup: "",
      },
    })
    function onSubmit(values: z.infer<typeof formSchema>) {
      const formData = new FormData();
      formData.append("file", values.file); // `values.file` now contains the actual `File` object
      console.log("File: ", formData.get("file"));
      console.log(values)
      console.log(values.file);
      const file = formData.get("file") as File | null;
      if (file) {
        console.log("File Name: ", file.name);
        console.log(file);
      
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
      console.log("File Group: ", values.selectGroup);
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
          <Button onClick={() => {setContentModalOpen(true)}} variant={"secondary"} className="w-fit border-2 border-blue-500 bg-transparent text-blue-500 hover:bg-blue-500 hover:text-white">
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

function CreateQuizDialog({ buttonDisabled, quizModalOpen, setQuizModalOpen }: {
    buttonDisabled: boolean,
    quizModalOpen: boolean,
    setQuizModalOpen: React.Dispatch<React.SetStateAction<boolean>> 
  }){
  return (
    <Dialog>
      {!buttonDisabled ? (
        <DialogTrigger asChild>
          <Button 
            onClick={() => {
              setQuizModalOpen(true);
          }} className="w-fit bg-blue-500 text-white">
            <CirclePlus/> Create Quiz
          </Button>
        </DialogTrigger>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button 
                  disabled={buttonDisabled}
                  onClick={() => {}} 
                  className="w-fit bg-blue-500 text-white">
                  <CirclePlus/> Create Quiz
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Try adding then selecting some content</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <DialogContent className="max-w-fit">
        <DialogHeader >
          <DialogTitle>Create Quiz</DialogTitle>
          <DialogDescription>
            Create quiz based on course material you've uploaded.
          </DialogDescription>
        </DialogHeader>
        <div>
          <CreateQuizForm></CreateQuizForm>
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
        <div className="flex flex-row gap-2 items-center">
          <TabsList className={` gap-4`}>
            {groups.map((group: any, index: number) => (
              <TabsTrigger key={index} value={group.title}>{group.title}</TabsTrigger>
            ))}
          </TabsList>
          <Button 
            className="h-7 bg-blue-500"
            onClick={() => {
              // Create a new group
              // TODO: API Call
            }}
          >
            <IconPlus/>
          </Button>
        </div>

  
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
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 
      bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full overflow-y-auto">

        <h2 className="mb-4 text-3xl font-semibold dark:text-white">Content</h2>
        <div className="flex flex-row gap-4 mb-4">
          { contentModalOpen ? <CreateQuizDialog buttonDisabled={checkedItems.length == 0 ? true : false} quizModalOpen={quizModalOpen} setQuizModalOpen={setQuizModalOpen}/> 
            : 
            null
          }
          { contentModalOpen ? <UploadContentDialog contentModalOpen={contentModalOpen} setContentModalOpen={setContentModalOpen}/>
            : 
            null
          }
        </div>
        <GroupTabsMenu groups={groups} />
        
        {/* LOADING MECHANISM */}
        {quizModalOpen && (
            <div className="w-full h-[60vh] flex items-center justify-center">
              <Loader loadingStates={loadingStates} loading={createQuizLoading} duration={1000} loop={false}/>
              {createQuizLoading && (
                <button
                  className="fixed top-4 right-4 text-black dark:text-white z-[120]"
                  onClick={() => {setCreateQuizLoading(false)}}
                >
                  <IconSquareRoundedX className="h-10 w-10" />
                </button>
              )}
            </div>
          )
        }
     </div>
   </div>
  )
}