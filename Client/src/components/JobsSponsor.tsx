import React from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

const SponsoredJobsBanner = () => {
  return (
    <section
      className="flex flex-col items-start container mx-auto gap-5 justify-center my-16 px-6">
        <h1 className="text-2xl capitalize">Sponsored Jobs</h1>
        <div 
          style={{
        backgroundImage:
          "url('/job.PNG')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
        className="w-full container mx-auto rounded-2xl p-30  flex flex-col md:flex-row items-center justify-between gap-6"></div>
      </section>
  );
};

export default SponsoredJobsBanner;
