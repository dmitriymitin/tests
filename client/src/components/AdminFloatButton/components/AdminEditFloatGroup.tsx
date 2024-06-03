import React from 'react';
import {FloatButton, message, Popconfirm} from "antd";
import {EditOutlined, PlusOutlined} from "@ant-design/icons";
import s from "../AdminFloatButton.module.scss";
import gs from "../../../GlobalStyles.module.scss"
import clsx from "clsx";
import {useMutation, useQueryClient} from "react-query";
import {clearAllTestResultsFetcher, closeAllTestFetcher, openAllTestFetcher} from "../../../api/test";

const AdminAddFloatGroup = () => {
  const queryClient = useQueryClient()

  const {
    mutateAsync: openAllTestTrigger
  } = useMutation(openAllTestFetcher)

  const {
    mutateAsync: closeAllTestTrigger
  } = useMutation(closeAllTestFetcher)

  const {
    mutateAsync: clearAllTestResultsTrigger
  } = useMutation(clearAllTestResultsFetcher)

  const handleOpenAllTest = async () => {
    try {
      await openAllTestTrigger();
      await queryClient.invalidateQueries({ queryKey: ['allTests'] })
      message.success('Все тесты успешно открыты!')
    } catch (e) {
      message.error('Ошибка при открытии всех тестов!')
    }
  }

  const handleCloseAllTest = async () => {
    try {
      await closeAllTestTrigger();
      await queryClient.invalidateQueries({ queryKey: ['allTests'] })
      message.success('Все тесты успешно закрыты!')
    } catch (e) {
      message.error('Ошибка при закрытии всех тестов!')
    }
  }

  const handleClearResultsAllTest = async () => {
    try {
      await clearAllTestResultsTrigger();
      message.success('Все результаты тестов успешно очищены!')
    } catch (e) {
      message.error('Ошибка при очистке результатов тестов!')
    }
  }

  return (
    <>
      <FloatButton.Group
        trigger="click"
        type="primary"
        style={{right: 164}}
        icon={<EditOutlined/>}
      >
        <div className={gs.adminFunctionBlock}>
          <Popconfirm
            title="Открыть все тесты"
            description="Вы уверены, что хотите открыть все тесты?"
            onConfirm={handleOpenAllTest}
            okText="Да"
            cancelText="Нет"
          >
            <button className={clsx('clearButton', gs.btn)}>
              Открыть все тесты
            </button>
          </Popconfirm>
          <div className={gs.underline}/>
          <Popconfirm
            title="Закрыть все тесты"
            description="Вы уверены, что хотите закрыть все тесты?"
            onConfirm={handleCloseAllTest}
            okText="Да"
            cancelText="Нет"
          >
            <button className={clsx('clearButton', gs.btn)}>
              Закрыть все тесты
            </button>
          </Popconfirm>
          <div className={gs.underline}/>
          <Popconfirm
            title="Очистить результаты"
            description="Вы уверены, что хотите очистить результаты всех тестов?"
            onConfirm={handleClearResultsAllTest}
            okText="Да"
            cancelText="Нет"
          >
            <button className={clsx('clearButton', gs.btn)}>
              Очистить результаты всех тестов
            </button>
          </Popconfirm>
        </div>
      </FloatButton.Group>
    </>
  );
};

export default AdminAddFloatGroup;