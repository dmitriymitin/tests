import {EditorDescriptionTest} from "../../api/test/type";
import React, {FC, memo, useEffect, useState} from "react";
import s from "./EditorWrapper.module.scss";
import Editor from "./Editor/Editor";
import useFormInstance from "antd/es/form/hooks/useFormInstance";
import {Form} from "antd";

interface IEditorWrapperForm {
  // descriptionPARSE?: EditorDescriptionTest;
  // setDescriptionPARSE: (description: EditorDescriptionTest) => void
}

const EditorWrapperForm: FC<IEditorWrapperForm> = ({}) => {
  const form = useFormInstance();
  const defaultDescriptionParse = form.getFieldValue('descriptionParse');
  const [descriptionPARSE, setDescriptionPARSE] = useState<EditorDescriptionTest>(defaultDescriptionParse);

  useEffect(() => {
    form.setFieldValue('descriptionParse', descriptionPARSE);
    form.submit();
  }, [descriptionPARSE, form]);

  return (
    <>
      <Form.Item name={'descriptionParse'}>
      <div className={s.editorContainer}>
        <Editor data={descriptionPARSE} setData={setDescriptionPARSE} />
      </div>
      </Form.Item>
    </>

  );
};

export default memo(EditorWrapperForm);