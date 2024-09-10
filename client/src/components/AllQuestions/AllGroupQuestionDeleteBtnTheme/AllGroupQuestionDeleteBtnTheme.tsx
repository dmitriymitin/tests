import React, {FC} from 'react';
import {message, Popconfirm, Spin} from 'antd';
import clsx from 'clsx';
import gs from '../../../GlobalStyles.module.scss';
import s from '../../AllAdminTestsList/AllAdminTestsList.module.scss';
import {DeleteOutlined} from '@ant-design/icons';
import {useMutation} from 'react-query';
import IsVisible from '../../ui/isVisibleWrapper';
import {IQuestionGroup} from '../../../api/questionGroup/type';
import {deleteOneQuestion} from '../../../api/questionGroup';
import {useAllGroupQuestion} from "../../../http/hooks/useAllGroupQuestion";

interface IAllGroupQuestionDeleteBtnThemeProps {
  group?: IQuestionGroup;
}

const AllGroupQuestionDeleteBtnTheme: FC<IAllGroupQuestionDeleteBtnThemeProps> = ({
  group
}) => {
  const {invalidate: invalidateGroupQuestion} = useAllGroupQuestion();
  const {
    mutateAsync: deleteQuestionTrigger,
    isLoading: isLoadingDeleteQuestion
  } = useMutation(deleteOneQuestion);

  const handleConfirm = async () => {
    try {
      await deleteQuestionTrigger(group._id);
      await invalidateGroupQuestion();
    } catch (e) {
      message.error('Ошибка при удалении темы');
    }
  };

  return (
    <Popconfirm
      title="Удалить текущую тему"
      description="Вы уверены, что хотите удалить текущую тему?"
      okText="Да"
      cancelText="Нет"
      onConfirm={handleConfirm}
    >
      <button className={clsx('clearButton', gs.btn, gs.btnDanger)}>
        <div className={s.btnDelete}>
          <DeleteOutlined style={{fontSize: 16}}/>
          Удалить тему
        </div>
      </button>
      <IsVisible isVisible={isLoadingDeleteQuestion}>
        <Spin/>
      </IsVisible>
    </Popconfirm>
  );
};

export default AllGroupQuestionDeleteBtnTheme;
