import React from 'react';
import {useSelectTestsStore} from "../../../../store/folders/useSelectTestsStore";
import {TitleBlockInfo} from "../../../../store/folders/const";

const InfoBlockTitle = () => {
  const currentAction = useSelectTestsStore(store => store.lastCurrentAction);
  const currentTitle = TitleBlockInfo[currentAction];

  return <div>{currentTitle}</div>;
};

export default InfoBlockTitle;
