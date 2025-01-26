"use client";
import React, { useEffect, useState } from "react";
import HomePage from "@/components/HomePage";
import ContentPage from "@/components/ContentPage";
import QuizzesPage from "@/components/QuizzesPage";
import "@/app/globals.css";
import DashboardLayout from "@/components/DashboardLayout";
import {getUserProfile} from "../../../api/backend";

export default function Dashboard() {
  return(
    <DashboardLayout>
      <HomePage />
    </DashboardLayout>
  )
}