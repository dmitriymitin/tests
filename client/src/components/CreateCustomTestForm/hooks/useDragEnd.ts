import {useState} from 'react';
import {DropResult} from 'react-beautiful-dnd';
import {TQuestionColumn} from '../QuestionColumn/QuestionColumn';
import {IQuestion} from '../../../api/question/type';
import {IGetTestInfoCustomModelResponse} from '../../../api/test/type';
import {useMutation} from 'react-query';
import {addManyQuestionToCustomTest} from '../../../api/test';
import {useParams} from "react-router-dom";
import {message} from "antd";

export const useDragEnd = ({
  testData,
  questionData
}: {
  questionData?: IQuestion[];
  testData?: IGetTestInfoCustomModelResponse;
}) => {
  const {testId} = useParams();
  const {
    mutateAsync: addManyQuestion,
    isLoading: isLoadingAddManyQuestion
  } = useMutation(addManyQuestionToCustomTest);
  const initListTestQuestions =
    testData?.test?.questionsId?.
      map(el => {
        const currentQuestion = questionData?.find(question => question?._id === el);
        return ({
          id: currentQuestion?._id,
          convertId: currentQuestion?.convertId
        });
      });

  const initListAllQuestionIds = questionData?.
    filter(el => !initListTestQuestions?.find(testQuest => testQuest.id === el._id)).
    map(el => ({
      id: el._id,
      convertId: el.convertId
    }));

  const initialColumns: {[key: string]: TQuestionColumn} = {
    test_questions: {
      id: 'test_questions',
      title: 'Добавленные вопросы',
      info: 'Вопросы и порядок сохраняются автоматически',
      list: initListTestQuestions || []
    },
    all_questions: {
      id: 'all_questions',
      title: 'Список вопросов',
      questionsDataShowResult: testData?.test?.questions,
      list: initListAllQuestionIds || []
    },
  };

  const [columns, setColumns] = useState(initialColumns);

  const onDragEnd = ({source, destination}: DropResult) => {
    if (destination === undefined || destination === null) {
      return null;
    }

    if (source.droppableId === 'all_questions' && destination.droppableId === 'test_questions') {
      return null;
    }

    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    ) {
      return null;
    }

    const start = columns[source.droppableId];
    const end = columns[destination.droppableId];

    if (start === end) {
      const newList = start.list.filter(
        (_: any, idx: number) => idx !== source.index
      );
      newList.splice(destination.index, 0, start.list[source.index]);
      const newCol = {
        ...start,
        list: newList
      };

      const prevColumnsAllQuest = columns['all_questions'];
      const prevColumnsTestQuest = columns['test_questions'];
      if (source.droppableId === 'all_questions' && start?.isShowResult) {
        const testQuestCol = columns['test_questions'];
        const newList = testQuestCol.list.filter(
          (_: any, idx: number) => idx !== source.index
        );

        newList.splice(destination.index, 0, testQuestCol.list[source.index]);

        const newTestCol = {
          ...testQuestCol,
          list: newList
        };

        setColumns(state => (
          {
            ...state,
            [newCol.id]: newCol,
            ['test_questions']: newTestCol
          }
        ));

        addManyQuestion({
          id: testId,
          questionsId: newTestCol?.list?.map(el => el.id)
        }).catch(e => {
          message.error('Ошибка при изменении порядка');
          setColumns(state => (
            {
              ...state,
              ['all_questions']: prevColumnsAllQuest,
              ['test_questions']: prevColumnsTestQuest
            }
          ));
        });
      } else {
        setColumns(state => (
          {
            ...state,
            [newCol.id]: newCol
          }
        ));
      }

      if (source.droppableId === 'test_questions') {
        addManyQuestion({
          id: testId,
          questionsId: newCol?.list?.map(el => el.id)
        }).catch(e => {
          message.error('Ошибка при изменении порядка');
          setColumns(state => (
            {
              ...state,
              ['test_questions']: prevColumnsTestQuest
            }
          ));
        });
      }

      return null;
    } else {
      const newStartList = start.list.filter(
        (_: any, idx: number) => idx !== source.index
      );

      const newStartCol = {
        ...start,
        list: newStartList
      };

      const newEndList = end.list;

      newEndList.splice(destination.index, 0, start.list[source.index]);

      const newEndCol = {
        ...end,
        list: newEndList
      };

      setColumns(state => ({
        ...state,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol
      }));
      return null;
    }
  };

  return {
    columns,
    setColumns,
    onDragEnd
  };
};
