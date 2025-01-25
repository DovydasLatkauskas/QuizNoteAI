"use client";
import React, { useEffect, useState } from "react";
import HomePage from "@/components/HomePage";
import ContentPage from "@/components/ContentPage";
import QuizzesPage from "@/components/QuizzesPage";
import QuizPage from "@/components/QuizPage";
import "@/app/globals.css";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from 'next/router'

export default function Quiz() {
    const router = useRouter()
    return (
        <DashboardLayout>
            <QuizPage quiz={router.query.id} />
        </DashboardLayout>
    )
}