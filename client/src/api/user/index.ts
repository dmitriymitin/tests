import $api from '../../http';

export const updateUserPassword = async (values: {newPassword: string}): Promise<any> => {
  const {data} = await $api.post('/update_user_password', {password: values.newPassword});
  return data;
};
