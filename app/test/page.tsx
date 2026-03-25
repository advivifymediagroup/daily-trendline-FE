"use client";
import { fetchAPI } from "@/utils/fetchApi";
import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [articles, setArticles] = useState(null);

  useEffect(() => {
    const loadArticles = async () => {
      const data = await fetchAPI("/articles");
      console.log("DATA::", data.data);
      console.log(typeof data)
      setArticles(data);
    };

    loadArticles();
  }, []);

  

  return <Box></Box>;
};

export default Page;
