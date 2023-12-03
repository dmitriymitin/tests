import $api from "../../http";

export const addNewImageInTest = async (values: {
    formData: any;
}): Promise<any> => {
    const {data} = await $api.post('/uploadImage/create', values.formData);
    return data;
};
