// @ts-nocheck
"use client";
import Image from "next/image";
import React, { act, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import Book1 from "@/../public/thumbnails/thumbnail1.jpg";
import Book2 from "@/../public/thumbnails/thumbnail2.png";
import Book3 from "@/../public/thumbnails/thumbnail3.jpg";
import Book4 from "@/../public/thumbnails/thumbnail4.jpg";
import Book5 from "@/../public/thumbnails/thumbnail5.jpg";

const images = [Book1, Book2, Book3, Book4, Book5];

interface ExpandableCardDemoProps {
  quizzes: QuizGroups[];
  loading: boolean;
}

interface QuizGroups {
  groupName: string;
  quizzes: Quiz[];
}

interface Quiz {
  title: string;
  description: string;
  groupId: string;
  id: string;
  imageNumber: number;
  questions: any[]; // TODO:
  sources: string[];
  ctaText: string;
  ctaLink: string;
}

export default function ExpandableCardDemo({ quizzes, loading }: ExpandableCardDemoProps) {
  console.log("Quizzes: ", quizzes,"\n\n")
  const [active, setActive] = useState<Quiz | boolean | null>(null);
  const id = useId();
  const ref = useRef<any>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0  grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6 font-sans"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <Image
                  priority
                  width={200}
                  height={200}
                  src={images[active.imageNumber]}
                  alt={active.title}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-neutral-700 dark:text-neutral-200 text-base font-sans"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400 text-base font-sans"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  <motion.a
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    href={"/Dashboard/Quizzes/" + active.id}
                    className="px-4 py-3 text-sm rounded-full font-bold bg-blue-500 text-white font-sans"
                  >
                    Start Quiz
                  </motion.a>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {/* {typeof active.content === "function" ? active.content() : active.content} */}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="w-full grid grid-cols-1 md:grid-cols-3 items-start gap-4">
        {loading
          ? ""
          : quizzes
              .filter((card) => card.quizzes.length > 0) // Filter out cards with no quizzes
              .map((card: any) =>
                card.quizzes.map((quiz: any, index: number) => (
                  <motion.div
                    layoutId={`quiz-${quiz.title}-${id}-${index}`} // Use unique keys
                    key={quiz.title + index}
                    onClick={() => setActive(quiz)}
                    className="p-4 flex flex-col hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer border"
                  >
                    <div className="flex gap-4 flex-col w-full">
                      <motion.div layoutId={`image-${quiz.title}-${id}`}>
                        <Image
                          width={200}
                          height={100}
                          src={images[quiz.imageNumber]}
                          alt={quiz.title}
                          className="h-60 w-full rounded-lg object-cover object-top"
                        />
                      </motion.div>
                      <div className="flex justify-center items-center flex-col">
                        <motion.h3
                          layoutId={`title-${quiz.title}-${id}`}
                          className="font-bold text-neutral-800 dark:text-neutral-200 text-center md:text-left text-base font-sans"
                        >
                          {quiz.title}
                        </motion.h3>
                        <motion.p
                          layoutId={`description-${quiz.description}-${id}`}
                          className="text-neutral-600 dark:text-neutral-400 text-center md:text-left text-base font-sans"
                        >
                          {quiz.description}
                        </motion.p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

// EXAMPLE USAGE
// const cards = [
//   {
//     // description: "Whales: A Summary of Characteristics and Classification",
//     title: "Whales: A Summary of Characteristics and Classification",
//     src: Book1,
//     ctaText: "Start Quiz",
//     ctaLink: "https://ui.aceternity.com/templates", // visit link
//     content: () => {
//       return (
//         <p>
//           Whales are fully aquatic placental mammals belonging to the order Cetartiodactyla, 
//           closely related to hippos.  They are informally categorized as large cetaceans, 
//           excluding dolphins and porpoises (which are whales cladistically).  Two parvorders 
//           exist: baleen whales (Mysticeti) and toothed whales (Odontoceti), diverging ~34 
//           million years ago.  Baleen whales lack teeth, using baleen plates to filter feed, 
//           while toothed whales have conical teeth for catching prey.  Whales exhibit immense 
//           size variation, from the dwarf sperm whale to the enormous blue whale (the largest
//            animal ever).  Many species show sexual dimorphism.  Notable adaptations include 
//            the baleen whale's large head and throat pleats for filter feeding, and the toothed 
//            whale's excellent hearing and deep-diving capabilities.</p>
//       );
//     },
//   },
//   {
//     // description: "Babbu Maan",
//     title: "Mitran Di Chhatri",
//     src: Book2,
//     ctaText: "Visit",
//     ctaLink: "https://ui.aceternity.com/templates",
//     content: () => {
//       return (
//         <p>
//           Babu Maan, a legendary Punjabi singer, is renowned for his soulful
//           voice and profound lyrics that resonate deeply with his audience. Born
//           in the village of Khant Maanpur in Punjab, India, he has become a
//           cultural icon in the Punjabi music industry. <br /> <br /> His songs
//           often reflect the struggles and triumphs of everyday life, capturing
//           the essence of Punjabi culture and traditions. With a career spanning
//           over two decades, Babu Maan has released numerous hit albums and
//           singles that have garnered him a massive fan following both in India
//           and abroad.
//         </p>
//       );
//     },
//   },

//   {
//     // description: "Metallica",
//     title: "For Whom The Bell Tolls",
//     src: Book3,
//     ctaText: "Visit",
//     ctaLink: "https://ui.aceternity.com/templates",
//     content: () => {
//       return (
//         <p>
//           Metallica, an iconic American heavy metal band, is renowned for their
//           powerful sound and intense performances that resonate deeply with
//           their audience. Formed in Los Angeles, California, they have become a
//           cultural icon in the heavy metal music industry. <br /> <br /> Their
//           songs often reflect themes of aggression, social issues, and personal
//           struggles, capturing the essence of the heavy metal genre. With a
//           career spanning over four decades, Metallica has released numerous hit
//           albums and singles that have garnered them a massive fan following
//           both in the United States and abroad.
//         </p>
//       );
//     },
//   },
//   {
//     // description: "Lord Himesh",
//     title: "Aap Ka Suroor",
//     src: Book4,
//     ctaText: "Visit",
//     ctaLink: "https://ui.aceternity.com/templates",
//     content: () => {
//       return (
//         <p>
//           Himesh Reshammiya, a renowned Indian music composer, singer, and
//           actor, is celebrated for his distinctive voice and innovative
//           compositions. Born in Mumbai, India, he has become a prominent figure
//           in the Bollywood music industry. <br /> <br /> His songs often feature
//           a blend of contemporary and traditional Indian music, capturing the
//           essence of modern Bollywood soundtracks. With a career spanning over
//           two decades, Himesh Reshammiya has released numerous hit albums and
//           singles that have garnered him a massive fan following both in India
//           and abroad.
//         </p>
//       );
//     },
//   },
//   {
//     // description: "Lord Himesh",
//     title: "Aap Ka Suroor",
//     src: Book5,
//     ctaText: "Visit",
//     ctaLink: "https://ui.aceternity.com/templates",
//     content: () => {
//       return (
//         <p>
//           Himesh Reshammiya, a renowned Indian music composer, singer, and
//           actor, is celebrated for his distinctive voice and innovative
//           compositions. Born in Mumbai, India, he has become a prominent figure
//           in the Bollywood music industry. <br /> <br /> His songs often feature
//           a blend of contemporary and traditional Indian music, capturing the
//           essence of modern Bollywood soundtracks. With a career spanning over
//           two decades, Himesh Reshammiya has released numerous hit albums and
//           singles that have garnered him a massive fan following both in India
//           and abroad.
//         </p>
//       );
//     },
//   },
// ];
