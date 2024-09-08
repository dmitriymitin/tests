import s from './EditorWrapper.module.scss';
import React, {FC, memo} from 'react';
import Editor from './Editor/Editor';
import {EditorDescriptionTest} from '../../api/test/type';

interface IEditorWrapper {
    descriptionPARSE?: EditorDescriptionTest;
    setDescriptionPARSE: (description: EditorDescriptionTest) => void;
}

const EditorWrapper: FC<IEditorWrapper> = ({setDescriptionPARSE, descriptionPARSE}) => {
  return (
    <>
      <div className={s.editorContainer}>
        <Editor data={descriptionPARSE} setData={setDescriptionPARSE} />
      </div>
    </>

  );
};

export default memo(EditorWrapper);
