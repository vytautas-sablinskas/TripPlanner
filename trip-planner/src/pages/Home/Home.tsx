import GoogleAutocomplete from "@/components/Extra/GoogleAutocomplete";
import React, { useEffect } from "react";
import Autocomplete from "react-google-autocomplete";

const Home = () => {
  const key = import.meta.env.VITE_GOOGLE_API_KEY;
  console.log(key);

  useEffect(() => {
    console.log(import.meta.env.VITE_GOOGLE_API_KEY);
  })

  return (
    <div>
      <h1>Home</h1>
      <GoogleAutocomplete />
    </div>
  );
};

export default Home;
