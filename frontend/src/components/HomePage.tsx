import React, {useState} from 'react';
import { getUserProfile } from "../../api/backend";

async function getProfile() {
    const profile = await getUserProfile();
    return profile.firstname;
}
export default function HomePage(){
    const [name, setName] = useState()
    getProfile().then((data) => setName(data))
    
    return(
        <div className="flex flex-1">
            <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
                <h2 className="text-2xl font-semibold dark:text-white font-sans">Welcome back, {name}</h2>
            </div>
        </div>
    )
}