import React, {useState} from 'react';
import {useAllGroupQuestion} from '../../../http/hooks/useAllGroupQuestion';
import clsx from 'clsx';
import {IQuestionGroup} from '../../../api/questionGroup/type';
import gs from '../../../GlobalStyles.module.scss';
import s from '../../AllAdminTestsList/AllAdminTestsList.module.scss';
import sC from './AllGroupQuestion.module.scss';
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import {Popconfirm} from 'antd';
import ContextMenuWrapper from '../../ui/ContextMenuWrapper/ContextMenuWrapper';
import AllGroupQuestionDeleteBtnTheme from "../AllGroupQuestionDeleteBtnTheme/AllGroupQuestionDeleteBtnTheme";
import IsVisible from "../../ui/isVisibleWrapper";
import {RouteNames} from "../../../router";
import AddNewThemeModalDrawer from "../AddNewThemeModalDrawer/AddNewThemeModalDrawer";
import {useAllGroupsStore} from "../../../store/groups/useAllGroups";

interface IAllGroupQuestionBtnProps {
  group: IQuestionGroup;
  handleClick?: () => void;
  isActive?: boolean;
}

const AllGroupQuestionBtn = ({group, isActive, handleClick}: IAllGroupQuestionBtnProps) => {
  return (
    <ContextMenuWrapper
      isFullWidth={false}
      text={<>
        <button
          className={clsx('clearButton', gs.btn)}
        >
          <div className={s.btnChange}>
            <EditOutlined style={{fontSize: 16}}/>
            Изменить тему
          </div>
        </button>
        <AllGroupQuestionDeleteBtnTheme group={group}/>
      </>
      }
    >
      <button
        className={clsx('group-block-wrapper clearButton flex-row flex-middle fs-14', {['active']: isActive})}
        onClick={() => handleClick()}
      >
        <div className="group-block right-border">
          {group.name}
        </div>
        <div className="group-block left-border">
          {group.count}
        </div>
      </button>
    </ContextMenuWrapper>
  );
};

const AllGroupQuestion = () => {
  const {
    data: allGroupQuestion,
    isLoading: isAllQuestionGroupLoading,
    isFetching: isAllQuestionGroupFetching
  } = useAllGroupQuestion();
  const {currentActiveGroups, setCurrentActiveGroupIds} = useAllGroupsStore(store => store);
  const isLoadingGroup = isAllQuestionGroupLoading || isAllQuestionGroupFetching;

  const handleDeleteActiveIdClick = (id: string) => () => {
    setCurrentActiveGroupIds([...currentActiveGroups.filter(el => el._id !== id)]);
  };

  const handleAddActiveIdClick = (group: IQuestionGroup) => () => {
    setCurrentActiveGroupIds([group, ...currentActiveGroups]);
  };

  const currentActiveGroupIds = currentActiveGroups?.map(el => el._id);
  const noActiveGroups = allGroupQuestion?.filter(el => !currentActiveGroupIds.includes(el._id));

  return (
    <div className="flex-wrap flex-middle gap-10">
      {currentActiveGroups
        ?.map(el => (
          <AllGroupQuestionBtn
            key={el._id}
            isActive
            group={el}
            handleClick={handleDeleteActiveIdClick(el._id)}
          />
        ))}
      {noActiveGroups
        ?.map(el => (
          <AllGroupQuestionBtn
            key={el._id}
            group={el}
            handleClick={handleAddActiveIdClick(el)}
          />
        ))}
    </div>
  );
};

export default AllGroupQuestion;
