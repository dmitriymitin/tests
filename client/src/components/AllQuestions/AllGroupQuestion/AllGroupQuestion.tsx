import React, {useEffect, useState} from 'react';
import {useAllGroupQuestion} from '../../../http/hooks/useAllGroupQuestion';
import clsx from 'clsx';
import {IQuestionGroup} from '../../../api/questionGroup/type';
import gs from '../../../GlobalStyles.module.scss';
import s from '../../AllAdminTestsList/AllAdminTestsList.module.scss';
import sC from './AllGroupQuestion.module.scss';
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import {Empty, Popconfirm} from 'antd';
import ContextMenuWrapper from '../../ui/ContextMenuWrapper/ContextMenuWrapper';
import AllGroupQuestionDeleteBtnTheme from '../AllGroupQuestionDeleteBtnTheme/AllGroupQuestionDeleteBtnTheme';
import {useAllGroupsStore} from '../../../store/groups/useAllGroups';
import AddNewThemeModalDrawer from '../AddNewThemeModalDrawer/AddNewThemeModalDrawer';
import ChangeNewThemeModalDrawer from '../AddNewThemeModalDrawer/ChangeNewThemeModalDrawer';
import IsVisible from '../../ui/isVisibleWrapper';

interface IAllGroupQuestionBtnProps {
  group: IQuestionGroup;
  handleClick?: () => void;
  isActive?: boolean;
  isCount?: boolean;
}

const AllGroupQuestionBtn = ({group, isActive, handleClick, isCount}: IAllGroupQuestionBtnProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <ChangeNewThemeModalDrawer
        open={isModalOpen}
        setOpen={setIsModalOpen}
        group={group}
      />
      <ContextMenuWrapper
        isFullWidth={false}
        text={<>
          <button
            onClick={() => setIsModalOpen(true)}
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
          className={clsx('group-block-wrapper boxShadow3 clearButton flex-row flex-middle fs-14', {['active']: isActive})}
          onClick={() => handleClick()}
        >
          <div className={clsx('group-block', {['all-border']: !isCount, ['right-border']: isCount})}>
            {group.name}
          </div>
          <IsVisible isVisible={isCount}>
            <div className="group-block left-border">
              {group.count}
            </div>
          </IsVisible>
        </button>
      </ContextMenuWrapper>
    </>
  );
};

interface IAllGroupQuestionProps {
  isCount?: boolean;
}

const AllGroupQuestion = ({isCount = true}: IAllGroupQuestionProps) => {
  const {data: allGroupQuestion, isLoading} = useAllGroupQuestion();
  const {currentActiveGroups, setCurrentActiveGroupIds} = useAllGroupsStore(store => store);

  const handleDeleteActiveIdClick = (id: string) => () => {
    setCurrentActiveGroupIds([...currentActiveGroups.filter(el => el._id !== id)]);
  };

  const handleAddActiveIdClick = (group: IQuestionGroup) => () => {
    setCurrentActiveGroupIds([group, ...currentActiveGroups]);
  };

  useEffect(() => {
    const activeGroups = currentActiveGroups;
    activeGroups.forEach((el, index) => {
      const newGroup = allGroupQuestion?.find(newEl => newEl._id === el._id);
      if (index) {
        handleAddActiveIdClick(newGroup);
      } else {
        setCurrentActiveGroupIds([newGroup]);
      }
    });
  }, [allGroupQuestion]);

  const currentActiveGroupIds = currentActiveGroups?.map(el => el._id);
  const noActiveGroups = allGroupQuestion?.filter(el => !currentActiveGroupIds.includes(el._id));

  return (
    <>
      <div className="flex-wrap flex-middle gap-10">
        {currentActiveGroups
          ?.map(el => (
            <AllGroupQuestionBtn
              isCount={isCount}
              key={el._id}
              isActive
              group={el}
              handleClick={handleDeleteActiveIdClick(el._id)}
            />
          ))}
        {noActiveGroups
          ?.map(el => (
            <AllGroupQuestionBtn
              isCount={isCount}
              key={el._id}
              group={el}
              handleClick={handleAddActiveIdClick(el)}
            />
          ))}
      </div>
    </>
  );
};

export default AllGroupQuestion;
