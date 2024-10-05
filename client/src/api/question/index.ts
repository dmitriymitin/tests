
import $api from '../../http';
import {IQuestion} from './type';

export const getQuestion = async (id: string): Promise<IQuestion> => {
  const {data} = await $api.get(`/question/get/one/${id}`);
  return data;
};

export const createQuestion = async (params: Omit<IQuestion, '_id'>): Promise<IQuestion> => {
  const {data} = await $api.post('/question/create', {
    ...params
  });
  return data;
};

export const updateQuestion = async (params: {id: string; data: Omit<IQuestion, '_id'>}): Promise<IQuestion> => {
  const {data} = await $api.post('/question/update', {
    ...params
  });
  return data;
};

export const deleteOneQuestion = async (id: string): Promise<IQuestion[]> => {
  const {data} = await $api.delete(`/question/deleteOne/${id}`);
  return data;
};


export const getAllQuestion = async ({activeGroupIds}: {activeGroupIds: string[]}): Promise<IQuestion[]> => {
  const {data} = await $api.get('/question/get/all', {
    params: {
      activeGroupIds
    }
  });
  return data;
};
