
import $api from '../../http';
import {IQuestionGroup} from './type';

export const createGroupQuestion = async (params: Omit<IQuestionGroup, '_id'>): Promise<IQuestionGroup> => {
  const {data} = await $api.post('/questionGroup/create', {
    ...params
  });
  return data;
};

export const getAllGroupQuestion = async (): Promise<IQuestionGroup[]> => {
  const {data} = await $api.get('/questionGroup/get/allGroupQuestion');
  return data;
};

export const deleteOneQuestion = async (id: string): Promise<any> => {
  const {data} = await $api.delete(`/questionGroup/deleteOne/${id}`);
  return data;
};