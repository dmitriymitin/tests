import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useMutation, useQueryClient} from "react-query";
import {createNewCustomTest, createNewTestWithDescription} from "../../../../api/test";
import {getFormateDate} from "../../../../utils/getFormateDate";
import {FloatButton, message} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import s from "../../AdminFloatButton.module.scss";
import clsx from "clsx";
import NewTestModalDrawer from "../../../NewTestModalDrawer";
import CreateNewForder from "../../../AdminTestsListForm/CreateNewForder/CreateNewForder";
import gs from "../../../../GlobalStyles.module.scss"
import {useMedia} from "react-use";
import {useSelectTestsStore} from "../../../../store/folders/useSelectTestsStore";

const AdminAddFloatGroup = () => {
  const isPC = useMedia('(min-width: 768px)');
  const navigate = useNavigate();
  const [newTestOpen, setNewTestOpen] = useState(false);
  const selectTestsStore = useSelectTestsStore(store => store)
  const queryClient = useQueryClient()

  const {
    mutateAsync: createNewTestTrigger,
    isLoading: isCreateNewTestLoading
  } = useMutation(createNewTestWithDescription);

  const handleCreateCustomTestWithDescription = async () => {
    try {
      const date = new Date();
      const createDate = getFormateDate(date)
      const res = await createNewTestTrigger({
        title: 'Тест с описанием',
        quantityQuestion: 1,
        createDate
      });
      navigate(`/admin/testInfo/customTest/description/${res._id}`)
      await queryClient.invalidateQueries({ queryKey: ['allTests'] })
    } catch (e) {
      message.error('Ошибка при создании теста')
    }
  }

  const {
    mutateAsync: createCustomTestTrigger,
    isLoading: createCustomTestLoading,
  } = useMutation(createNewCustomTest)

  const handleCreateCustomTest = async () => {
    try {
      const date = new Date();
      const createDate = getFormateDate(date)
      const res = await createCustomTestTrigger(createDate);
      navigate(`/admin/testInfo/customTest/${res._id}`)
    } catch (e) {
      message.error('Ошибка при создании теста')
    }
  }

  return (
    <>
      <FloatButton.Group
        trigger="click"
        type="primary"
        style={{right: isPC ? 164 : 114}}
        icon={<PlusOutlined/>}
        onClick={() => selectTestsStore.setCurrentAction(undefined)}
      >
        <div className={clsx(gs.adminFunctionBlock, gs.plus)}>
          <button
            className={clsx('clearButton', gs.btn)}
            onClick={() => setNewTestOpen(true)}
          >
            Тест без описания
          </button>
          <div className={gs.underline}/>
          <button
            className={clsx('clearButton', gs.btn)}
            // loading={isCreateNewTestLoading}
            onClick={handleCreateCustomTestWithDescription}
          >
            Тест с описанием
          </button>
          <div className={gs.underline}/>
          <button
            className={clsx('clearButton', gs.btn)}
            // loading={createCustomTestLoading}
            onClick={handleCreateCustomTest}
          >
            Тест с отдельным описанием вопросов
          </button>

        </div>
      </FloatButton.Group>
      <NewTestModalDrawer open={newTestOpen} setOpen={setNewTestOpen}/>
    </>
  );
};

export default AdminAddFloatGroup;