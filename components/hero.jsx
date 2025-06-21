"use client";

import Link from "next/link";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {  useEffect, useRef } from "react";

const HeroSection = () => {

    const imageRef = useRef()
    useEffect(() => {
        const imageElement = imageRef.current;
        const handlescroll = () => {
            const scrollPosition = window.scrollY;
            const scrollThreshold = 100;
            if (scrollPosition > scrollThreshold) {
                imageElement.classList.add("scrolled");
            } else {
                imageElement.classList.remove("scrolled");
            }
        };
        window.addEventListener("scroll", handlescroll);

        return () => window.removeEventListener("scroll", handlescroll);
    },[])
  return (
    <div className="pb-20">
      <div className="container mx-auto text-center px-0">
        <h1 className="text-5xl md:text-8xl lg:text-[105px] pb-6 gradient-title">
          Manage your finances with <br /> Intelligence 
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          An AI-powered financial management platform that helps you track,
          analyze, and optimize your spending with real-time insights.
        </p>
        <div className="flex justify-center space-x-4 mb-8">
          <Link href="/Dashboard">
            <Button size="lg" className="px-8">Get Started</Button>
          </Link>
          <Link href="/Dashboard">
            <Button size="lg" variant="outline" className="px-8">Watch Demo</Button>
          </Link>
        </div>
        <div className="hero-image-wrapper w-full">
          <div ref={imageRef} className="hero-image w-full">
            <Image
              src="/banner.jpeg"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="rounded-lg shadow-2xl border mx-auto w-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection