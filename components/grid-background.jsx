import React from "react";

export function GridBackgroundDemo({ text }) {
  return (
    <div className="h-[50rem] w-full bg-green-300  bg-grid-white/[0.5] relative flex items-center justify-center">
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-green bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_60%,black)]"></div>
      <div className="flex flex-col text-center items-center">
        <div
          className=" animate-pulse
         inline-block rounded-lg bg-gray-100 px-3 py-1 dark:text-black text-sm dark:bg-white border border-black font-semibold"
        >
          Introducing
        </div>
        <p className="text-4xl text-black   w-[70%] sm:text-7xl font-bold relative z-20 bg-clip-text   py-8">
          AI AIDer: Your Smart Database Assistant
        </p>
        <p className="max-w-[700px] text-black  md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-black">
          Meet your new colleague. AI AIDer is an AI-powered MySQL Analytical
          assistant designed to help you work smarter, faster, and with more
          insights.It's delivers effortless data insights, simplifying analysis
          for streamlined decision-making and enhanced productivity
        </p>
      </div>
    </div>
  );
}
