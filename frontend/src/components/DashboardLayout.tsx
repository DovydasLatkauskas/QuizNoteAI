// @ts-nocheck
"use client";
import React, {useEffect, useState} from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconBooks,
  IconFileText,
  IconHome,
  IconBrain,
  IconUserBolt,
  IconUserFilled
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import "@/app/globals.css";
import {getUserProfile} from "../../api/backend";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {

  const [name, setName] = useState<string | null>(null); // Initialize state for the name
  const [loading, setLoading] = useState<boolean>(true); // Initialize loading state

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile(); // Fetch profile data
        setName(profile.data.firstName + " " + profile.data.lastName); // Update state with the fetched name
      } catch (error) {
        console.error("Error fetching profile:", error);
        setName("Guest"); // Fallback if there's an error
      } finally {
        setLoading(false); // Ensure loading is set to false once the request completes
      }
    };
    
    fetchProfile(); // Call the fetch function
  }, []); // Empty dependency array ensures this runs once when the component mounts
  const links = [
    {
      label: "Home",
      href: "/Dashboard",
      icon: (
        <IconHome className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Quizzes",
      href: "/Dashboard/Quizzes",
      icon: (
        <IconBrain className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Content",
      href: "/Dashboard/Content",
      icon: (
        <IconFileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "/Dashboard/Profile",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  
  const [open, setOpen] = useState(false);
  
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <>
              <Logo />
            </>
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: name,
                href: "#",
                icon: (
                  <IconUserFilled className="text-neutral-700 dark:text-neutral-200 h-6 w-6" />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      {children}
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      {/* <div className="h-5 w-6 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0"> */}
        <IconBooks className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
      {/* </div> */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-large font-sans font-semibold text-black dark:text-white whitespace-pre"
      >
        QuizNoteAI
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

export default DashboardLayout;


// // THIS IS GOOD FOR LOADING CONTENT PLACEHOLDER:
// {/* <div className="flex gap-2">
//   {[...new Array(4)].map((i) => (
//     <div
//       key={"first" + i}
//       className="h-20 w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse"
//     ></div>
//   ))}
// </div>
// <div className="flex gap-2 flex-1">
//   {[...new Array(2)].map((i) => (
//     <div
//       key={"second" + i}
//       className="h-full w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse"
//     ></div>
//   ))}
// </div> */}
