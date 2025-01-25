"use client";
import React, { useEffect, useState } from "react";
import ProfilePage from "@/components/ProfilePage";
import "@/app/globals.css";
import DashboardLayout from "@/components/DashboardLayout";

export default function Profile() {
  return(
    <DashboardLayout>
      <ProfilePage />
    </DashboardLayout>
  )
}