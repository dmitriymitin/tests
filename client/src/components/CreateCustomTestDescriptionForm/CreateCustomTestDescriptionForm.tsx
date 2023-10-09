import s from "./CreateCustomTestDescriptionForm.module.scss";
import React, {FC, memo, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useForm} from "antd/es/form/Form";
import Editor from "./Editor/Editor";

interface CreateCustomTestDescriptionFormProps {
    id: string
}

const CreateCustomTestDescriptionForm: FC<CreateCustomTestDescriptionFormProps> = ({id}) => {
    const navigate = useNavigate();
    const [form] = useForm()

    const [descriptionPARSE, setDescriptionPARSE] = useState('')

    // const {
    //     data: customTestData,
    //     isLoading: customTestLoading,
    //     isFetching: customTestFetching,
    //     refetch: refetchCustomTestData
    // } = useQuery(['customTestInfo', testId], () => getOneCustomTest(testId), {
    //     refetchOnWindowFocus: false
    // })
    //
    // if (customTestLoading || customTestFetching)
    //     return <div className={s.spin}>
    //         <Spin size={'large'}/>
    //     </div>
    //
    //
    // if (!customTestData) {
    //     message.error('произошла ошибка при получении информации о тесте')
    //     navigate('/admin')
    //     return null
    // }

    console.log(descriptionPARSE)


    return (
        <div>
            <Editor data={descriptionPARSE} setData={setDescriptionPARSE} />
        </div>
    );
};

export default memo(CreateCustomTestDescriptionForm);
