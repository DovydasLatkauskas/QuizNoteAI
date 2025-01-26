// @ts-nocheck
"use client"
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconBolt,
  IconSquareRoundedX,
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
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { insertFile, createGroup, showGroups, GeminiQuiz, GeminiSummarize } from "../../api/backend";
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
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"


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




export default function ContentPage(){
  const [checkedItems, setCheckedItems] = useState<any[]>([]); // Files that are checked
  const [activeTab, setActiveTab] = useState<string>("All"); 
  const [createQuizLoading, setCreateQuizLoading] = useState<boolean>(false);
  const [appData, setAppData] = useState<any>([]);
  const [triggerRefresh, setTriggerRefresh] = useState<boolean>(false);

  // Modals 
  const [contentModalOpen, setContentModalOpen] = useState<boolean>(true);
  const [quizModalOpen, setQuizModalOpen] = useState<boolean>(false);
  const [createGroupModalOpen, setCreateGroupModalOpen] = useState<boolean>(false);
  
  function SelectGroupMenu({ control } : { control: any }) {
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
              {appData.map((group: any, index: number) => (
                <SelectItem key={index} value={group.groupName}>{group.groupName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
  
        )}
      />
    )
  }

  // Creating quiz
  const createQuiz = async (numberOfQuestions: number, userPrompt: string) => {
    if (checkedItems.length === 0) {
      alert("Please select some content first");
      return;
    }
    let groupId = checkedItems[0].groupId;
    let idsOfFilesString = checkedItems.map((item) => item.id).join(",");
    
    GeminiQuiz(groupId, idsOfFilesString, numberOfQuestions, userPrompt)
    .then((response) => {
      console.log("Quiz created successfully", response);
      setTriggerRefresh((prev) => !prev);
    })
    .catch((error) => {
      console.error("Failed to create quiz", error);
    });
  }

  const createSummary = async (nameOfSummaryDoc: string, userPrompt: string) => {
    if (checkedItems.length === 0) {
      alert("Please select some content first");
      return;
    }
    let groupId = checkedItems[0].groupId;
    let idsOfFilesString = checkedItems.map((item) => item.id).join(",");
    
    GeminiSummarize(nameOfSummaryDoc,groupId, idsOfFilesString, userPrompt)
    .then((response) => {
      console.log("Summary created successfully", response);
      setTriggerRefresh((prev) => !prev);
    })
    .catch((error) => {
      console.error("Failed to create summary", error);
    });
  
  }

  const handleCreateGroup = async (groupName : string, colour : string) => {
    console.log("Creating group: ", groupName, " With colour: ", colour);
    try {
      const response = await createGroup(groupName, colour)
      .then((response) => {
        console.log("Group created successfully", response);
        setTriggerRefresh((prev) => !prev);
        setCreateGroupModalOpen(false);
        // Refresh the useEffect thingy
      });
    }  
    catch (error) {
      console.error('Failed to create group:', error);
      alert('Failed to create group');
    }
  }

  useEffect(() => {
    if (createQuizLoading) {
      const timer = setTimeout(() => {
        setCreateQuizLoading(false);
      }, 5000); // Set the duration to 5 seconds

      return () => clearTimeout(timer);
    }
  }, [createQuizLoading]);
  
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await showGroups(); // Fetch the groups from your API
        let groupsData = data["gt"];
        console.log("Fetched Groups:", groupsData);
  
        // Ensure the data is an array and update state
        if (Array.isArray(groupsData)) {
          setAppData(groupsData);
        } else {
          console.error("Unexpected data format:", groupsData);
          setAppData([]);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
        setAppData([]); // Set fallback state on error
      }
    };
  
    fetchGroups(); // Call the async function
  }, [triggerRefresh]); // Empty dependency array ensures this runs only once on mount

  const handleCheckboxChange = (file: any) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setCheckedItems((prev) => [...prev, file]); // Add tge full file object
    } else {
      setCheckedItems((prev) => prev.filter((item) => item.name !== file.name));
    }
  };

  interface ContentProps {
    index: number;
    filePath: string;
    content: string;
    groupColour: string;
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
    questions: z.number(),
    specifications: z.string(),
  });

  const createGroupSchema = z.object({
    groupName: z.string(),
    colour: z.string(),
  });

  const createSummarySchema = z.object({
    nameOfSummaryDoc: z.string(),
    specifications: z.string(),
  });




  // Forms
  function CreateQuizForm() {
    const form = useForm<z.infer<typeof createQuizSchema>>({
      resolver: zodResolver(createQuizSchema),
      defaultValues: {
        questions: 5,
        specifications: "",
      },
    });
    function onQuizSubmit(values: z.infer<typeof createQuizSchema>) {
      setCreateQuizLoading(true);
      console.log("TESTING TESTING TESTING IPASDFHNLJKASH DKLAHSJLDA")
      const formData = new FormData();
      formData.append("questions", values.questions.toString());
      formData.append("specifications", values.specifications);
      // console.log("Checked Items: ", checkedItems);
      // console.log("On Submit Create Quiz Form Data: ", formData);
      
      // PERFORM API CALL WITH THIS DATA
      let dataSendingToAPI = {
        questions: parseInt(formData.get("questions") as string, 10),
        specifications: formData.get("specifications"),
      }
      createQuiz(dataSendingToAPI.questions, dataSendingToAPI.specifications as string);

    }
    return (
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onQuizSubmit)}
            className="space-y-8 border border-neutral-200 dark:border-neutral-700 p-4 rounded-md"
          >
            {/* Questions Field */}
            <FormField
              control={form.control}
              name="questions"
              render={({ field }) => (
                <FormItem className="mt-6">
                  <FormLabel className="font-sans font-semibold text-lg">
                    Number of Questions:
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-full"
                      placeholder="Number of questions"
                      onBlur={field.onBlur}
                      ref={field.ref}
                      onChange={(e) => {
                        field.onChange(parseInt(e.target.value, 10));
                      }}
                    />
                    {/* <Input
                      {...field} // Automatically register with React Hook Form
                      type="number"
                      className="w-full"
                      placeholder="Number of questions"
                    /> */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
  
            {/* Specifications Field */}
            <FormField
              control={form.control}
              name="specifications"
              render={({ field }) => (
                <FormItem className="mt-6">
                  <FormLabel className="font-sans font-semibold text-lg">
                    Additional Specifications:
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="w-full"
                      placeholder="Focus on questions from the 18th century of France..."
                      onBlur={field.onBlur}
                      ref={field.ref}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                    />
                     {/* <Textarea
                      {...field} // Automatically register with React Hook Form
                      className="w-full"
                      placeholder="Focus on questions from the 18th century of France..."
                    /> */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
  
            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-500 text-white"
            >
              <IconBolt />
              Generate Quiz
            </Button>
          </form>
        </Form>
      </div>
    );
  }
  
  function CreateSummaryForm() {
    const form = useForm<z.infer<typeof createSummarySchema>>({
      resolver: zodResolver(createSummarySchema),
      defaultValues: {
        nameOfSummaryDoc: "",
        specifications: "",
      },
    });
    function onCreateSummaryFormSubmit(values: z.infer<typeof createSummarySchema>) {
      const formData = new FormData();
      formData.append("nameOfSummaryDoc", values.nameOfSummaryDoc);
      formData.append("specifications", values.specifications);
      console.log("On Submit Create Summary Form Data: ", formData);
      // Perform your API call with `formData`
      createSummary(values.nameOfSummaryDoc, values.specifications)
        .then((response) => {
          console.log("Summary created successfully", response);
          setTriggerRefresh((prev) => !prev);
        })
        .catch((error) => {
          console.error("Failed to create summary", error);
        });
    }
    return (
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onCreateSummaryFormSubmit)}
            className="space-y-8 border border-neutral-200 dark:border-neutral-700 p-4 rounded-md"
          >
            {/* Name of Summary Document Field */}
            <FormField
              control={form.control}
              name="nameOfSummaryDoc"
              render={({ field }) => (
                <FormItem className="mt-6">
                  <FormLabel className="font-sans font-semibold text-lg">
                    Name of Summary Document:
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="w-full"
                      placeholder="Name of summary document"
                      onBlur={field.onBlur}
                      ref={field.ref}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                    />
                    {/* <Input
                      {...field} // Automatically register with React Hook Form
                      type="text"
                      className="w-full"
                      placeholder="Name of summary document"
                    /> */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
  
            {/* Specifications Field */}
            <FormField
              control={form.control}
              name="specifications"
              render={({ field }) => (
                <FormItem className="mt-6">
                  <FormLabel className="font-sans font-semibold text-lg">
                    Additional Specifications:
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="w-full"
                      placeholder="Focus on questions from the 18th century of France..."
                      onBlur={field.onBlur}
                      ref={field.ref}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                    />
                    {/* <Textarea
                      {...field} // Automatically register with React Hook Form
                      className="w-full"
                      placeholder="Focus on questions from the 18th century of France..."
                    /> */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              
            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-500 text-white"
            >
              <IconBolt />
              Generate Summary
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
            setTriggerRefresh((prev) => !prev);
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
                      accept=".pdf,.mp4,.mp3,.png,.jpeg,.webp,.heif,.heic,.txt"
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
    )
  };

  function CreateGroupForm() {
    const form = useForm<z.infer<typeof createGroupSchema>>({
      resolver: zodResolver(createGroupSchema),
      defaultValues: {
        groupName: "",
        colour: "#878787",
      },
    })
    function onCreateGroupFormSubmit(values: z.infer<typeof createGroupSchema>) {
      const formData = new FormData();
      // formData.append("groupName", values.groupName);
      // formData.append("colour", values.colour);
      console.log("On Submit Create Group Form Data: ");
      // Perform your API call with `formData`
      handleCreateGroup(values.groupName, values.colour);
    }

    return (
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onCreateGroupFormSubmit)} className="space-y-8 border border-neutral-200 dark:border-neutral-700 p-4 rounded-md">
          <FormField
            control={form.control}
            name="groupName"
            render={({ field }) => (
              <FormItem className="w-64">
                <FormLabel>Group Name:</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="groupName"
                    {...field} // Use field directly for handling value, onChange, etc.
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="colour"
            render={({ field }) => (
              <FormItem className="w-64">
                <FormLabel>Colour:</FormLabel>
                <FormControl>
                  <Input
                    type="color"
                    {...field} // Use field directly for handling value, onChange, etc.
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    )
  };


  // Dialogs
  function UploadContentDialog({ contentModalOpen, setContentModalOpen }: { 
    contentModalOpen: boolean,
    setContentModalOpen: React.Dispatch<React.SetStateAction<boolean>> 
  }) {
    return (
      <Dialog>
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
  };

  function CreateSummaryDialog({ buttonDisabled, contentModalOpen, setContentModalOpen }: {
    buttonDisabled: boolean,
    contentModalOpen: boolean,
    setContentModalOpen: React.Dispatch<React.SetStateAction<boolean>> 
  }) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            onClick={() => {
              setContentModalOpen(true);
          }} className="w-fit bg-blue-500 text-white">
            <CirclePlus/> Create Summary
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-fit">
          <DialogHeader >
            <DialogTitle>Create Summary</DialogTitle>
            <DialogDescription>
              Create a summary based on course material you've uploaded.
            </DialogDescription>
          </DialogHeader>
          <div>
            <CreateSummaryForm></CreateSummaryForm>
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
  };

  function CreateGroupDialog({ createGroupModalOpen, setCreateGroupModalOpen }: {
    createGroupModalOpen: boolean,
    setCreateGroupModalOpen: React.Dispatch<React.SetStateAction<boolean>> 
  }){
    return (
      <Dialog open={createGroupModalOpen} onOpenChange={setCreateGroupModalOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => {setCreateGroupModalOpen(true)}} className="bg-[#F4F4F5] text-black hover:bg-gray-300">
            <CirclePlus/> Create Group
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-fit">
          <DialogHeader >
            <DialogTitle>Create Group</DialogTitle>
            <DialogDescription>
              This will be were you can organize your content.
            </DialogDescription>
          </DialogHeader>
          <div>
            <CreateGroupForm></CreateGroupForm>
          </div>
        </DialogContent>
      </Dialog>
    )
  };

  const Content: React.FC<ContentProps> = ({ index, filePath, content, groupColour, type, checked, onChange }) => {
    // const renderIcon = (fileType: string) => {
    //   const fileExtension = fileType.toLowerCase();
  
    //   if ([".mp4", ".webm", ".mov"].includes(fileExtension)) {
    //     return <Video className="w-6 h-6 text-blue-500" />; // Video icon
    //   }
    //   if ([".mp3", ".wav", ".aac"].includes(fileExtension)) {
    //     return <Music className="w-6 h-6 text-green-500" />; // Audio icon
    //   }
    //   if ([".pdf", ".txt", ".doc", ".docx"].includes(fileExtension)) {
    //     return <FileText className="w-6 h-6 text-gray-500" />; // Document/Text icon
    //   }
    //   return <File className="w-6 h-6 text-neutral-500" />; // Default file icon
    // };
    console.log("groupColour: ", groupColour);
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
          <Sheet>
            <SheetTrigger>
              <Card key={index} className={`w-80 ${checked ? "bg-blue-100" : ""}`}>
                <CardHeader className="flex flex-row items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    className="h-4 w-4 rounded"
                  />
                  {/* <div className={`aspect-square w-4 rounded-full bg-[${groupColour}]`}></div> */}
                  <CardTitle className="text-blue-500">{filePath}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{content.substring(0, 35)}...</CardDescription>
                </CardContent>
              </Card>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{filePath}</SheetTitle>
                <SheetDescription>{content}</SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>

        </motion.div>
      </AnimatePresence>
    );
  };

  function GroupTabsMenu() {
    let allFiles = appData.map((group: any) => group.contentFiles).flat();
    let curGroups = []
    // add all groups from app data to curGroups
    appData.forEach((group: any) => {
      curGroups.push(
        {
          groupName: group.groupName, 
          files: group.contentFiles,
          groupId: group.groupId,
          groupColor: group.groupColor
        }
      )
    })
    curGroups.unshift(
      {
        groupName: "All", 
        files: allFiles,
        groupId: "",
        groupColor: "#878787"
      }
    );
    let numOfCols = "grid-cols-" + curGroups.length;
    const defaultGroup = curGroups.length > 0 ? curGroups[0].groupName : "";
    
    return(
      !appData 
      ? 
        (<div>
          Loading...
          <Button onClick={()=>{console.log(appData)}}>Test</Button>
        </div>)
      : 
        (
          <Tabs defaultValue={defaultGroup} className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-row gap-2 items-center">
              <TabsList className={` gap-4`}>
                {curGroups.map((group: any, index: number) => (
                  <TabsTrigger key={index} value={group.groupName}>{group.groupName}</TabsTrigger>
                ))}
              </TabsList>
              <CreateGroupDialog createGroupModalOpen={createGroupModalOpen} setCreateGroupModalOpen={setCreateGroupModalOpen}/>
            </div>
      
            {curGroups.map((group: any, index: number) => (
              <TabsContent key={index} value={group.groupName}>
                <Card className="">
                  <CardHeader>
                    <CardTitle>{group.groupName}</CardTitle>
                    <CardDescription>
                      All your files associated with {group.groupName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-row gap-4 flex-wrap">
                    {Array.isArray(group.files) && group.files.length > 0 ? (
                      group.files.map((file: any, index: number) => (
                        <Content
                          key={index}
                          index={index}
                          filePath={file.name}
                          content={file.text}
                          groupColour={group.groupColor}
                          type={`.${file.name.split('.').pop()}`} // Extract file extension
                          checked={checkedItems.some((item) => item.name === file.name)} // check by file name
                          onChange={handleCheckboxChange(file)}
                        />
                      ))
                    ) : (
                      <div className="text-gray-500">
                        No files.
                      </div>
                    )}
                    {/* <Button onClick={()=>{console.log("TESTTESTTESTTEST: ", group.groupColor)}}>Click for test</Button>   */}
                  </CardContent>
                  <CardFooter>
                    {/* <Button className="bg-red-500" onClick={() => {}}>Delete Group</Button> */}
                  </CardFooter>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        )
    )
  }

  return(
    <div className="flex flex-1">
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 
      bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full overflow-y-auto">

        <h2 className="mb-4 text-3xl font-semibold dark:text-white">Content</h2>
        <div className="flex flex-row gap-4 mb-4">
          { contentModalOpen ? <CreateSummaryDialog buttonDisabled={checkedItems.length == 0 ? true : false} contentModalOpen={contentModalOpen} setContentModalOpen={setContentModalOpen}/>
            : 
            null
          }
          { contentModalOpen ? <CreateQuizDialog buttonDisabled={checkedItems.length == 0 ? true : false} quizModalOpen={quizModalOpen} setQuizModalOpen={setQuizModalOpen}/> 
            : 
            null
          }
          { contentModalOpen ? <UploadContentDialog contentModalOpen={contentModalOpen} setContentModalOpen={setContentModalOpen}/>
            : 
            null
          }
        </div>
        <GroupTabsMenu/>
        {/* <Button onClick={()=>{console.log(checkedItems)}}>Press for test</Button> */}
        
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