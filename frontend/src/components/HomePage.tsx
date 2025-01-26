import React, { useState, useEffect } from "react";
import { getUserProfile } from "../../api/backend";

export default function HomePage() {
    const [name, setName] = useState<string | null>(null); // Initialize state for the name

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await getUserProfile(); // Fetch profile data
                setName(profile.data.firstName); // Update state with the fetched name
            } catch (error) {
                console.error("Error fetching profile:", error);
                setName("Guest"); // Fallback if there's an error
            }
        };

        fetchProfile(); // Call the fetch function
    }, []); // Empty dependency array ensures this runs once when the component mounts

    return (
        <div className="flex flex-1">
            <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
                <h2 className="text-2xl font-semibold dark:text-white font-sans">
                    Welcome back, {name || "loading..."}
                </h2>
            </div>
        </div>
    );
}
