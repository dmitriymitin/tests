import React from 'react';
import Column from 'antd/es/table/Column';
import {Table} from 'antd';
import {ETypeTest, IUserInfoForTest} from '../../api/test/type';
import {ColumnsType} from 'antd/es/table';
import {useMedia} from 'react-use';
import {IFullTest} from '../../api/test';
import QuestionLink from '../AllQuestions/AllQuestionsBlock/QuestionLink';
import {getTestType} from '../../utils/helpers';
import IsVisible from '../ui/isVisibleWrapper';
import {AnswerType} from '../../models/question';
import {Link} from 'react-router-dom';
import {RouteNames} from '../../router';

interface DataType {
    // @ts-ignore
    key: React.Key;
    fiogroup: string;
    variant: string | JSX.Element;
    // @ts-ignore
    correctAnswers: string;
    [key: string]: string | JSX.Element;
}

interface AdminTestInfoTableProps {
    usersTestInfo: IUserInfoForTest[];
    currentTest?: IFullTest;
    testKey: string | null;
    isFullInfo?: boolean;
}

type IdQuestAnswer = {[key: string]: {
    isAnswer: boolean;
    value: string;
    type: AnswerType;
  };}

const getIdQuestionAnswers = (currentTest: IFullTest): { [key: string]: IdQuestAnswer } => {
  return currentTest.questions?.reduce((acc, question) => {
    const currentQuestionAsnwers = Object.values(question?.answers)?.[0];
    if (question?.answers?.['text']) {
      acc[question._id] = {
        [currentQuestionAsnwers.keys[0]]: {
          isAnswer: true,
          value: currentQuestionAsnwers.keys[0],
          type: AnswerType.Text
        }
      };
    } else {
      const setKeys = new Set(currentQuestionAsnwers.keys);
      const answersObject = Object.values(currentQuestionAsnwers.values)
        .reduce((acc, el) => {
          if (el && el?.keyId) {
            acc[el?.keyId] = {
              isAnswer: setKeys?.has(el?.keyId) || false,
              value: el.key,
              type: Object.keys(question?.answers)?.[0] as any
            };
            return acc;
          }

          return acc;
        }, {} as IdQuestAnswer);
      acc[question._id] = answersObject;
    }

    return acc;
  }, {} as { [key: string]: IdQuestAnswer });
};

const AdminTestInfoTable = ({
  currentTest,
  usersTestInfo,
  testKey,
  isFullInfo
}: AdminTestInfoTableProps) => {
  const testType = getTestType(currentTest);
  const isVariant = currentTest?.setting?.isPublicTestVariants;
  const firstQuestionTitle = currentTest.firstQuestionTitle || 'Фамилия, номер группы';
  const questions = currentTest?.questions;
  const quantityQuestion = currentTest?.quantityQuestion || currentTest.questionsId?.length;
  const isMedia768 = useMedia('(max-width: 768px');
  const isMedia576 = useMedia('(max-width: 576px');
  const idQuestionAnswers = getIdQuestionAnswers(currentTest);
  const getSize = () => {
    if (isMedia768) {
      return 'middle';
    }

    if (isMedia576) {
      return 'small';
    }

    return 'large';
  };

  const getScroll = () => {
    if (quantityQuestion <= 5) {
      return {x: 500, y: 700};
    }

    if (quantityQuestion <= 10) {
      return {x: 2000, y: 700};
    }

    return {x: 4000, y: 700};
  };

  const allCountCorrectAnswers = (() => {
    if (testType === ETypeTest.WITH_QUESTIONS) {
      return questions?.reduce((acc, quest) => {
        acc[quest._id] = 0;
        return acc;
      }, {} as {
        [key: string]: number;
      });
    }

    return new Array(quantityQuestion).fill('1').reduce((acc, _, index) => {
      acc[index + 1] = 0;
      return acc;
    }, {} as {
      [key: string]: number;
    });
  })();

  const getCorrectAnswersCustom = (id: string) => {
    return (100 - 100 * (allCountCorrectAnswers[id] || 0) / usersTestInfo.length).toFixed(0);
  };

  const getCorrectAnswers = (index: number) => {
    return (100 - 100 * (allCountCorrectAnswers[index + 1] || 0) / usersTestInfo.length).toFixed(0);
  };

  const data: ColumnsType<DataType> = usersTestInfo.map((el) => {
    if (testType !== ETypeTest.WITH_QUESTIONS) {
      let correctAnswers = 'Ключ не установлен';
      if (testKey) {
        const countCorrectAnswers = new Array(quantityQuestion).fill('1').reduce((acc, _, index) => {
          if (el.answer !== undefined && el.answer[index + 1] !== undefined && el.answer[index + 1]?.toString().toLowerCase() === testKey[index]?.toString().toLowerCase()) {
            acc += 1;
            allCountCorrectAnswers[index + 1] = (allCountCorrectAnswers[index + 1] || 0) + 1;
          }

          return acc;
        }, 0);

        correctAnswers = countCorrectAnswers.toString();
      }

      return {
        key: el._id,
        fiogroup: el.FIOGroup,
        correctAnswers,
        ...el.answer
      };
    }

    const allAnswers = el.answersCustom.values;
    let countCorrectAnswers = 0;
    const initCustomAnswers = questions?.reduce((acc, el) => {
      acc[el._id] = 'нет ответа';
      return acc;
    }, {});
    const newCustomAnswers = Object.entries(allAnswers).reduce((acc, [idQuest, {keys}], index) => {
      let isCorrectAnswer = true;
      const currentQuest = idQuestionAnswers[idQuest];
      let countRightQuest = 0;
      if (!currentQuest) {
        acc[idQuest] = 'нет ответа';
        return acc;
      }

      Object.values(currentQuest).forEach(el => {
        if (el.isAnswer) {
          countRightQuest++;
        }
      });
      const answersFromTestKeys = Object.keys(currentQuest);
      const answersFromTest = Object.values(currentQuest);
      const isTextIndex = answersFromTest.findIndex(el => el.type === AnswerType.Text);
      if (!keys || (keys && !keys.length)) {
        isCorrectAnswer = false;
        acc[idQuest] = 'нет ответа';
      } else {
        if (isTextIndex !== -1) {
          acc[idQuest] = keys[0];
          const indexCorrectAnswer = answersFromTestKeys.indexOf(keys[0]);
          if (!answersFromTest[indexCorrectAnswer]?.isAnswer) {
            isCorrectAnswer = false;
          }
        } else {
          let countRightAnswerToCheck = 0;
          acc[idQuest] = keys.reduce((accum, key) => {
            const indexCorrectAnswer = answersFromTestKeys.indexOf(key);
            const isAnswer = answersFromTest[indexCorrectAnswer]?.isAnswer;
            if (!isAnswer) {
              isCorrectAnswer = false;
            }

            if (isCorrectAnswer) {
              countRightAnswerToCheck++;
            }

            accum += answersFromTest[indexCorrectAnswer]?.value;

            return accum;
          }, '');

          if (countRightAnswerToCheck !== countRightQuest) {
            isCorrectAnswer = false;
          }
        }

        if (isCorrectAnswer) {
          allCountCorrectAnswers[idQuest] = (allCountCorrectAnswers[idQuest] || 0) + 1;
          countCorrectAnswers += 1;
        }
      }

      return acc;
    }, {} as { [key: string]: string });

    const correctAnswers = countCorrectAnswers.toString();

    const res = {
      key: el._id,
      fiogroup: el.FIOGroup,
      correctAnswers,
      ...initCustomAnswers,
      ...newCustomAnswers
    };

    if (isVariant) {
      res['variant'] = <Link to={RouteNames.TEST_USER_RESULT + '/' + el._id}>{el.convertId}</Link>;
    }

    return res;
  });

  const FIOWidth = () => {
    if (isMedia576) {
      return 75;
    }

    if (isMedia768) {
      return 150;
    }

    return 200;
  };

  const smallInfoTable = (
    <Table
      dataSource={data}
      bordered
      size={getSize()}
      scroll={{y: 700}}
      pagination={false}
      style={{
        marginBottom: 100
      }}
    >
      <Column width={300} title={firstQuestionTitle} dataIndex="fiogroup" key="fiogroup" />
      <Column title="Кол-во верных ответов" dataIndex="correctAnswers" key="correctAnswers" />
    </Table>
  );

  const fullInfoTable = (
    <Table
      dataSource={data}
      bordered
      size={getSize()}
      scroll={getScroll()}
      pagination={false}
      style={{
        marginBottom: 100
      }}
      summary={() => (
        <Table.Summary fixed>
          <Table.Summary.Row>
            <Table.Summary.Cell index={0}>Кол-во неверных ответов на вопрос</Table.Summary.Cell>
            <IsVisible isVisible={testType === ETypeTest.WITH_QUESTIONS}>
              {isVariant && <Table.Summary.Cell key={'variant'} index={0}>{''}</Table.Summary.Cell>}
              {questions?.map((quest, index) =>
                <Table.Summary.Cell key={quest._id} index={index + 1}>
                  {getCorrectAnswersCustom(quest._id)}%
                </Table.Summary.Cell>
              )}
            </IsVisible>
            <IsVisible isVisible={testType !== ETypeTest.WITH_QUESTIONS}>
              {new Array(quantityQuestion).fill('1').map((_, index) =>
                <Table.Summary.Cell key={index + 1} index={index + 1}>
                  {getCorrectAnswers(index)}%
                </Table.Summary.Cell>
              )}
            </IsVisible>
          </Table.Summary.Row>
        </Table.Summary>
      )}
    >
      <Column fixed={'left'} width={FIOWidth()} title={firstQuestionTitle} dataIndex="fiogroup" key="fiogroup" />
      {testType === ETypeTest.WITH_QUESTIONS && isVariant &&
        <Column width={150}
                title={'Вариант'}
                dataIndex="variant"
                key="variant"
        />
      }
      {testType === ETypeTest.WITH_QUESTIONS && questions
        ? questions?.map((el, index) => (
          <Column
            title={<div className="flex-row flex-middle gap-10">Вопрос <QuestionLink id={el?._id} convertId={el?.convertId} isPublic={el?.setting?.isPublicQuestion}/></div>}
            dataIndex={el?._id}
            key={el?._id}
          />))
        : new Array(quantityQuestion).fill('1').map((_, index) => (
          <Column
            title={`Вопрос ${index + 1}`}
            dataIndex={index + 1}
            key={index + 1}
          />
        )
        )
      }
      <Column fixed={'right'} width={100} title="Кол-во верных ответов" dataIndex="correctAnswers" key="correctAnswers" />
    </Table>
  );

  return (
    isFullInfo ? fullInfoTable : smallInfoTable
  );
};

export default AdminTestInfoTable;
