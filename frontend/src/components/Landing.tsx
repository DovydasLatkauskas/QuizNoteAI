"use client";
import * as motion from "motion/react-client"
import { AuroraBackground } from "@/components/ui/aurora-background";
import Link from 'next/link'

function Landing() {
    return(
        <div className="w-full">
            <AuroraBackground>
                <motion.div
                    initial={{ opacity: 0.0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.3,
                        duration: 0.8,
                        ease: "easeInOut",
                    }}
                    className="relative flex flex-col gap-4 items-center justify-center px-4"
                >
                    <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
                        Learning has never been easier
                    </div>
                    <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
                        Note summarizer and AI quizzing tool
                    </div>
                    <div className="flex flex-row gap-2">
                        <Link href="/SignUp" className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">
                            Sign up
                        </Link>
                        <span className="pt-2">or</span>
                        <Link href="/LogIn" className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">
                            LogIn
                        </Link>
                    </div>
                </motion.div>
            </AuroraBackground>
            {/* <div>Test</div> */}
        </div>
    )
}  

export default Landing;