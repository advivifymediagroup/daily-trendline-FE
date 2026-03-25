import { fetchAPI } from "@/utils/fetchApi";

export const getAllNews = async () => {
  return fetchAPI("/newses?populate=*");
};
