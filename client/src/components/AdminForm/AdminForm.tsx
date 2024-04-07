import React, {useState} from 'react';
import s from './AdminForm.module.scss'
import {Button, Collapse, message, Popconfirm} from "antd";
import ChangePasswordModalDrawer from "../ChangePasswordModalDrawer";
import NewTestModalDrawer from "../NewTestModalDrawer";
import {AuthActionCreators} from "../../store/reducers/auth/action-creators";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useMutation, useQueryClient} from "react-query";
import {
    clearAllTestResultsFetcher, closeAllTestFetcher,
    createNewCustomTest,
    createNewTest,
    createNewTestWithDescription, openAllTestFetcher
} from "../../api/test";
import ChangeAllTestFirstQuestion from "../AllAdminTestsList/ChangeAllTestFirstQuestion/ChangeAllTestFirstQuestion";
import NewTestModalDrawerWithDescription from "../NewTestModalDrawerWithDescription";
import {getFormateDate} from "../../utils/getFormateDate";
import AllAdminTestListWrapper from "../AllAdminTestsList/AllAdminTestListWrapper";
import CreateNewForder from "./CreateNewForder/CreateNewForder";

const AdminForm = () => {
    const navigate = useNavigate()
    const [newFolderOpen, setNewFolderOpen] = useState(false);
    const [newTestOpen, setNewTestOpen] = useState(false)
    const [newTestDescriptionOpen, setNewTestDescriptionOpen] = useState(false)
    const queryClient = useQueryClient()

    const {
        mutateAsync: createCustomTestTrigger,
        isLoading: createCustomTestLoading,
    } = useMutation(createNewCustomTest)

    const {
        mutateAsync: createNewTestTrigger,
        isLoading: isCreateNewTestLoading
    } = useMutation(createNewTestWithDescription);

    const {
        mutateAsync: clearAllTestResultsTrigger
    } = useMutation(clearAllTestResultsFetcher)

    const {
        mutateAsync: openAllTestTrigger
    } = useMutation(openAllTestFetcher)

    const {
        mutateAsync: closeAllTestTrigger
    } = useMutation(closeAllTestFetcher)

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

    const handleClearResultsAllTest = async () => {
        try {
            await clearAllTestResultsTrigger();
            message.success('Все результаты тестов успешно очищены!')
        } catch (e) {
            message.error('Ошибка при очистке результатов тестов!')
        }
    }

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

    const items: any = [
        {
            key: '1',
            label: 'Функции для управлениями всеми тестами',
            children: <div className={s.btnActionWrapper}>
                <Popconfirm
                    title="Открыть все тесты"
                    description="Вы уверены, что хотите открыть все тесты?"
                    onConfirm={handleOpenAllTest}
                    okText="Да"
                    cancelText="Нет"
                >
                    <Button
                        size={'large'}
                        className={s.btn}
                    >
                        Открыть все тесты
                    </Button>
                </Popconfirm>
                <Popconfirm
                    title="Закрыть все тесты"
                    description="Вы уверены, что хотите закрыть все тесты?"
                    onConfirm={handleCloseAllTest}
                    okText="Да"
                    cancelText="Нет"
                >
                    <Button
                        size={'large'}
                        className={s.btn}
                    >
                        Закрыть все тесты
                    </Button>
                </Popconfirm>
                <Popconfirm
                    title="Очистить результаты"
                    description="Вы уверены, что хотите очистить результаты всех тестов?"
                    onConfirm={handleClearResultsAllTest}
                    okText="Да"
                    cancelText="Нет"
                >
                    <Button
                        size={'large'}
                        className={s.btn}
                    >
                        Очистить результаты всех тестов
                    </Button>
                </Popconfirm>
                <ChangeAllTestFirstQuestion/>
            </div>,
        }
    ];

    const itemsCreateTest: any = [
        {
            key: '1',
            label: 'Функции для создания тестов',
            children: <div className={s.admin__form__btns}>
                <Button
                  size={'large'}
                  className={s.btn}
                  type={"primary"}
                  onClick={() => setNewTestOpen(true)}
                >
                    Тест без описания
                </Button>
                <Button
                  size={'large'}
                  className={s.btn}
                  loading={isCreateNewTestLoading}
                  type={"primary"}
                  onClick={handleCreateCustomTestWithDescription}
                >
                    Тест с описанием
                </Button>
                <Button
                  size={'large'}
                  className={s.btn}
                  loading={createCustomTestLoading}
                  type={"primary"}
                  onClick={handleCreateCustomTest}
                >
                    Тест с отдельным описанием вопросов
                </Button>
            </div>,
        }
    ];

    return (
      <>
          <div className={s.admin__form}>
              <div className={s.title__wrapper}>
                  <h1 className="title">
                      Страница администратора
                  </h1>
              </div>
              <Collapse items={itemsCreateTest}/>
              <div className={s.btnActionWrapper}>
                  <Collapse items={items} defaultActiveKey={['2']}/>
                </div>
              <Button
                size={'large'}
                className={s.createForderBtn}
                type={'primary'}
                onClick={() => {
                    setNewFolderOpen(true);
                }}
              >
                  Создать новую папку
              </Button>
                <AllAdminTestListWrapper/>
                <NewTestModalDrawer open={newTestOpen} setOpen={setNewTestOpen}/>
                <NewTestModalDrawerWithDescription open={newTestDescriptionOpen} setOpen={setNewTestDescriptionOpen}/>
            </div>
          <CreateNewForder open={newFolderOpen} setOpen={setNewFolderOpen}/>
        </>

    );
};

export default AdminForm;
