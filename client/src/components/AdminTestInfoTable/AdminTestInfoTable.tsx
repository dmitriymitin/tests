import React, {useState} from 'react';
import Column from 'antd/es/table/Column';
import {Button, Row, Table} from 'antd';
import {ICustomTestQuestion, ISaveNewTestResponse, TypeCustomTestQuestionAnswer} from '../../api/test/type';
import {ColumnsType} from 'antd/es/table';
import {useMedia} from 'react-use';
import s from './AdminTestInfoTable.module.scss';

interface DataType {
    // @ts-ignore
    key: React.Key;
    fiogroup: string;
    // @ts-ignore
    correctAnswers: string;
    [key: string]: string | JSX.Element;
}

interface AdminTestInfoTableProps {
    firstQuestionTitle: string;
    usersTestInfo: ISaveNewTestResponse[];
    questions?: ICustomTestQuestion[];
    setCurrentQuestion: (val: {
        openModal: boolean;
        question: ICustomTestQuestion & { name: string };
    }) => void;
    countAnswers: number;
    testKey: string | null;
    isFullInfo?: boolean;
}

const AdminTestInfoTable = ({firstQuestionTitle, usersTestInfo, questions, setCurrentQuestion, countAnswers, testKey, isFullInfo}: AdminTestInfoTableProps) => {
  const isMedia768 = useMedia('(max-width: 768px');
  const isMedia576 = useMedia('(max-width: 576px');
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
    if (countAnswers <= 5) {
      return {x: 500, y: 700};
    }

    if (countAnswers <= 10) {
      return {x: 2000, y: 700};
    }

    return {x: 4000, y: 700};
  };

  const allCountCorrectAnswers = new Array(countAnswers).fill('1').reduce((acc, _, index) => {
    acc[index + 1] = 0;
    return acc;
  }, {} as {
        [key: string]: string;
    });

  const data: ColumnsType<DataType> = usersTestInfo.map((el) => {
    let correctAnswers = 'Ключ не установлен';
    if (testKey) {
      const countCorrectAnswers = new Array(countAnswers).fill('1').reduce((acc, _, index) => {
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
                  {new Array(countAnswers).fill('1').map((_, index) =>
                    <Table.Summary.Cell key={index + 1} index={index + 1}>
                      {(100 - 100 * (allCountCorrectAnswers[index + 1] || 0) / usersTestInfo.length).toFixed(0)}%
                    </Table.Summary.Cell>
                  )}
                </Table.Summary.Row>
              </Table.Summary>
            )}
    >
      <Column fixed={'left'} width={FIOWidth()} title={firstQuestionTitle} dataIndex="fiogroup" key="fiogroup" />
      {questions
        ? questions.map((el, index) => (
          <Column
                            title={<Button
                                onClick={() => {
                                  setCurrentQuestion({
                                    openModal: true,
                                    question: {
                                      _id: el._id,
                                      description: el.description,
                                      answers: el.answers,
                                      name: `Вопрос ${index + 1}`,
                                    }
                                  });
                                }}
                            >
                              Вопрос {index + 1}
                            </Button>}
                            dataIndex={index + 1}
                            key={index + 1}
          />
        )
        )
        : new Array(countAnswers).fill('1').map((_, index) => (
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
