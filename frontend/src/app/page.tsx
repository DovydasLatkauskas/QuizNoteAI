import React from "react";
import Landing from "@/components/Landing";
// import Head from 'next/head'

export const metadata = {
  title: "Quiz Note AI",
  description: "Learning has never been easier with",
};

export default function Home() {

  
  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <Landing/>
    </div>
  );
}
