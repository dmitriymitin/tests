import React from 'react';
import {Button, message, Popconfirm} from 'antd';
import {useNavigate} from 'react-router-dom';
import {RouteNames} from '../../../router';
import clsx from 'clsx';
import s from '../../AllAdminTestsList/AllAdminTestsList.module.scss';
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import IsVisible from "../../ui/isVisibleWrapper";
import {useMutation} from "react-query";
import {deleteOneQuestion} from "../../../api/question";
import {useAllGroupQuestion} from "../../../http/hooks/useAllGroupQuestion";
import {useAllQuestion} from "../../../http/hooks/useAllQuestion";

interface IAllQuestionBlockBtnProps {
  questionId?: string;
}

const AllQuestionBlockBtn = ({questionId}: IAllQuestionBlockBtnProps) => {
  const {isAuth} = useTypedSelector(state => state.auth);
  const {invalidate: invalidateAllGroupQuestion} = useAllGroupQuestion(false);
  const {invalidate: invalidateAllQuestion} = useAllQuestion(false);
  const navigate = useNavigate();

  const {
    mutateAsync: deleteOneQuestionTrigger,
    isLoading: isLoadingDeleteOneQuestionTrigger
  } = useMutation(deleteOneQuestion);

  const onDeleteQuestion = async () => {
    try {
      await deleteOneQuestionTrigger(questionId);
      await invalidateAllGroupQuestion();
      await invalidateAllQuestion();
    } catch (e) {
      message.error('Ошибка при удалении вопроса');
    }
  };

  return (
    <IsVisible isVisible={isAuth}>
      <div className="flex-row flex-end gap-10 mt-20">
        <Button
          type={'primary'}
          onClick={() => navigate(RouteNames.ADMIN_QUESTION_UPDATE + '/' + questionId)}
        >
          Редактировать
        </Button>
        <Popconfirm
          title="Удаление вопроса"
          description="Вы уверены, что хотите удалить вопрос?"
          onConfirm={onDeleteQuestion}
          onPopupClick={e => e.stopPropagation()}
          okText="Да"
          cancelText="Нет"
          cancelButtonProps={{
            loading: isLoadingDeleteOneQuestionTrigger
          }}
        >
          <Button
            onClick={(e) => e.stopPropagation()}
            className={clsx(s.deleteBtn, s.btn)}
            danger
            loading={isLoadingDeleteOneQuestionTrigger}
          >
            Удалить
          </Button>
        </Popconfirm>
      </div>
    </IsVisible>
  );
};

export default AllQuestionBlockBtn;
