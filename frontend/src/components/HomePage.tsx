import React, { useState, useEffect } from "react";
import { getUserProfile } from "../../api/backend";
import BentoGridThirdDemo from "@/components/BentoGridThirdDemo";

export default function HomePage() {
    const [name, setName] = useState<string | null>(null); // Initialize state for the name
    const [loading, setLoading] = useState<boolean>(true); // Initialize loading state

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await getUserProfile(); // Fetch profile data
                setName(profile.data.firstName); // Update state with the fetched name
            } catch (error) {
                console.error("Error fetching profile:", error);
                setName("Guest"); // Fallback if there's an error
            } finally {
                setLoading(false); // Ensure loading is set to false once the request completes
            }
        };

        fetchProfile(); // Call the fetch function
    }, []); // Empty dependency array ensures this runs once when the component mounts

    const RecentQuizzes = () => {
        return(
            <div className="flex flex-col gap-2">
                {/* <h2 className="mx-6 mb-8 text-2xl font-semibold dark:text-white font-sans">
                    Recent Quizzes
                </h2> */}
                {/* <div className="flex flex-row gap-2 overflow-x-auto p-2">
                    test
                </div> */}
            </div>
        )
    }

    return (
        <div className="flex flex-1">
            <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full overflow-y-auto">
                <h2 className="mx-4 text-2xl font-semibold dark:text-white font-sans">
                    {loading ? "" : `Welcome back, ${name}`}
                </h2>
                <RecentQuizzes />
                <BentoGridThirdDemo />
            </div>
        </div>
    );
}
