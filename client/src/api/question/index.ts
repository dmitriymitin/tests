
import $api from "../../http";
import {IQuestion} from "./type";

export const createQuestion = async (params: Omit<IQuestion, '_id'>): Promise<IQuestion> => {
  const {data} = await $api.post(`/question/create`, {
    ...params
  });
  return data;
};

export const getAllQuestion = async (): Promise<IQuestion[]> => {
  const {data} = await $api.get(`/question/get/all`);
  return data;
};