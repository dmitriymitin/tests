import s from "./CreateCustomTestDescriptionForm.module.scss";
import React, {FC, memo, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useForm} from "antd/es/form/Form";
import Editor from "./Editor/Editor";
import {EditorDescriptionTest} from "../../api/test/type";
import {Button, message} from "antd";
import {useMutation} from "react-query";
import {updateTestDescriptionEditor} from "../../api/test";
import exampleData from "./Editor/exampleData";

interface CreateCustomTestDescriptionFormProps {
    id: string;
    description?: EditorDescriptionTest;
    refetch: () => void
}

const CreateCustomTestDescriptionForm: FC<CreateCustomTestDescriptionFormProps> = ({id, description, refetch}) => {
    const navigate = useNavigate();
    const [form] = useForm()

    const {
    		mutateAsync: updateTestDescriptionEditorTrigger,
    		isLoading: updateTestDescriptionEditorLoading,
    	} = useMutation(updateTestDescriptionEditor)

    const [descriptionPARSE, setDescriptionPARSE] = useState(description || exampleData)

    const handleSaveDescription = async () => {
        try {
            await updateTestDescriptionEditorTrigger({
                id,
                description: descriptionPARSE
            })
            message.success('Описание успешно сохранено!')
        } catch (e) {
            message.error('Ошибка при сохранении описания!')
        }
    }


    return (
        <>
            <div className={s.editorContainer}>
                <Editor data={descriptionPARSE} setData={setDescriptionPARSE} />
            </div>
            <div className={s.btnSaveWrapper}>
                <Button
                    onClick={handleSaveDescription}
                    size={'large'}
                    type={'primary'}
                    loading={updateTestDescriptionEditorLoading}
                >
                    Сохранить описание
                </Button>
            </div>
        </>

    );
};

export default memo(CreateCustomTestDescriptionForm);
