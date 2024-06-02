import React, {Fragment, useState} from 'react';
import {Badge, Button, message, Popconfirm, Segmented, Select, Spin} from "antd";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {
    deleteTest,
    getAdminAllTests,
    updateAdminStatusTest
} from "../../api/test";
import {testStatusType} from "../../type/test/type";
import {useNavigate} from "react-router-dom";
import {CLIENT_URL} from "../../http";
import s from './AllAdminTestsList.module.scss'
import clsx from "clsx";
import {CopyOutlined} from "@ant-design/icons";
import CustomTooltip from "../CustomTooltip";
import ChangeTitleOrQuestionCountModalDrawer from "../ChangeTitleOrQuestionCountModalDrawer";
import {
    EFilterById,
    EFilterTranslate,
    ITestCustomModelResponse,
    ITestModelResponse,
    TFilterById
} from "../../api/test/type";
import {getFormateDate} from "../../utils/getFormateDate";
import {getFormatCreateDate} from "../../utils/getFormatCreateDate";
import {getFormatUpdateDate} from "../../utils/getFormatUpdateDate";
import {useAllTest} from "../../http/hooks/useAllTest";
import {useAllFolder} from "../../http/hooks/useAllFolder";
import PutInFolderBtn from "./PutInFolderBtn/PutInFolderBtn";

const getTestStatusTextForBtn = (status: testStatusType) => {
    switch (status) {
        case "Open":
            return 'Закрыть тест для всех'
        default:
            return 'Открыть тест для всех'
    }
}

const copyAddress = (value: string) => {
    navigator.clipboard.writeText(value);
};

const getTestStatusText = (status: testStatusType) => {
    switch (status) {
        case "Open":
            return <div className={clsx(s.body__status, 'statusOpen')}>Открыт</div>
        default:
            return <div className={clsx(s.body__status, 'statusClose')}>Закрыт</div>
    }
}

interface AllAdminTestsListProps {
    filterById: string | undefined;
    isShowBadge: boolean;
    folderId: string | undefined;
    showTestInFolder: number;
}

const AllAdminTestsList = ({filterById, folderId, showTestInFolder,isShowBadge}: AllAdminTestsListProps) => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const {data: allFolder, isLoading: isLoadingFolder} = useAllFolder();
    const [currentDefaultTestData, setCurrentDefaultTestData] = useState({
        testId: '',
        title: '',
        quantityQuestion: 0,
        openModal: false,
    })

    const {
        data: allTest,
        isLoading: isAllTestLoading,
        isFetching,
        refetch: allTestRefetch
    } = useAllTest(filterById, folderId)

    const {
        mutateAsync: deleteTestTrigger
    } = useMutation(deleteTest)

    const {
        mutateAsync: updateStatusTestTrigger
    } = useMutation(updateAdminStatusTest)


    const onDeleteTest = async (id: string) => {
        try {
            await deleteTestTrigger(id)
            await queryClient.invalidateQueries({queryKey: ['allTests']})
        } catch (e) {
            message.error('Ошибка при удалении теста')
        }
    }

    const onUpdateStatusTest = async (id: string, status: testStatusType) => {
        try {
            await updateStatusTestTrigger({id, status})
            await queryClient.invalidateQueries({queryKey: ['allTests']})
        } catch (e) {
            message.error('Ошибка при обвнолении статуса теста')
        }
    }

    if (isAllTestLoading || isFetching || isLoadingFolder) {
        return <div className={s.loading}>
            <Spin size={'large'}/>
        </div>
    }

    if (!allTest || allTest.length === 0) {
        return (
          <div className={s.all__tests__list__empty}>
              Тестов пока нет
          </div>
        )
    }

    const handleOpenChangeInfoTest = (val: boolean) => {
        setCurrentDefaultTestData(prevState => ({
            ...prevState,
            openModal: val
        }))
    }

    const newAllTest = allTest?.reduce((acc, el, index) => {
        if (showTestInFolder) acc.push(el)
        else if (!el.folderId) acc.push(el)
        return acc
    }, [] as (ITestModelResponse & ITestCustomModelResponse)[])


    return (
      <Fragment>
          {newAllTest.map((el, index) => {
                const folderName = allFolder?.find(folder => folder._id === el.folderId)?.name;
                const isShowTestInFolder = isShowBadge ? showTestInFolder : false;
                return (
                  <Badge.Ribbon text={folderName} color="gold" style={{
                      display: isShowTestInFolder ? folderName ? 'block' : 'none' : 'none',
                  }}>
                      <div key={el._id} className={s.all__tests__list__wrapper}>
                          <div className={s.all__tests__list__test__item}>
                              <div className={s.title}>
                                  {el.title}
                              </div>

                              <div className={s.infoWrapper}>
                                  <p className={s.wrapperStatus}>Статус теста:</p>
                                  {getTestStatusText(el.status)}
                              </div>

                              <div className={s.infoWrapper}>
                                  <p>Тип теста:</p>
                                  <div className={s.body}>
                                      {!!el.quantityQuestion && !el.descriptionEditor && 'Тест без описания'}
                                      {!!el.questions && 'Тест с отдельным описанием вопросов'}
                                      {!!el.descriptionEditor && 'Тест с описанием'}
                                  </div>
                              </div>

                              <div className={s.infoWrapper}>
                                  <p>Адрес теста:</p>
                                  <div className={clsx(s.body, s.addressTest)}>{CLIENT_URL + `/tests/${el._id}`}</div>
                                  <CustomTooltip text={'Адрес теста был успешно скопирован!'}>
                                      <button
                                        className={s.addressCopyButton}
                                        onClick={() => copyAddress(CLIENT_URL + `/tests/${el._id}`)}
                                      >
                                          <CopyOutlined/>
                                      </button>
                                  </CustomTooltip>
                              </div>

                              <div className={s.infoWrapper}>
                                  <p>Кол-во вопросов:</p>
                                  <div
                                    className={s.body}>{el.quantityQuestion || (el.questions && el.questions.length) || 0}</div>
                              </div>

                              {el?.createDate && <div className={s.infoWrapper}>
                                  <p>Тест создан: </p>
                                  <div
                                    className={s.body}>{getFormatCreateDate(el.createDate)}</div>
                              </div>}

                              {el?.updateDate && <div className={s.infoWrapper}>
                                  <p>Тест изменен: </p>
                                  <div
                                    className={s.body}>{getFormatUpdateDate(el.updateDate)}</div>
                              </div>}

                          </div>
                          <div
                            className={s.btnsWrapper}
                            style={{
                                marginTop: isShowTestInFolder ? folderName ? 30 : 0 : 0,
                            }}
                          >
                              <div className={s.btnsColum}>
                                  <div className={s.btns}>
                                      <Button
                                        className={s.btn}
                                        onClick={() => {
                                            //Обычный тест
                                            if (!!el.quantityQuestion && !el.descriptionEditor) {
                                                setCurrentDefaultTestData({
                                                    testId: el._id,
                                                    title: el.title,
                                                    quantityQuestion: el.quantityQuestion,
                                                    openModal: true
                                                })
                                                return
                                            }
                                            //Тест со своими вопросами
                                            if (el.questions) {
                                                navigate(`/admin/testInfo/customTest/${el._id}`)
                                                return
                                            }

                                            if (!!el.descriptionEditor) {
                                                navigate(`/admin/testInfo/customTest/description/${el._id}`)
                                                return
                                            }
                                        }}
                                      >
                                          Редактировать тест
                                      </Button>
                                      <Button
                                        className={s.btn}
                                        onClick={() => navigate(`/admin/testInfo/key/${el._id}`)}
                                      >
                                          Ввести ключ
                                      </Button>
                                      <Button
                                        className={s.btn}
                                        onClick={() => {
                                            localStorage.removeItem('FIO')
                                            navigate(`/admin/testInfo/${el._id}`)
                                        }}
                                      >
                                          Результаты
                                      </Button>
                                  </div>
                                  {allFolder && allFolder.length > 0 && <PutInFolderBtn id={el._id}/>}
                              </div>
                              <div className={s.btns}>
                                  <Button
                                    className={s.btn}
                                    type={'primary'}
                                    onClick={() => onUpdateStatusTest(el._id, el.status)}
                                  >
                                      {getTestStatusTextForBtn(el.status)}
                                  </Button>
                                  <Popconfirm
                                    title="Удаление теста"
                                    description="Вы уверены, что хотите удалить тест?"
                                    onConfirm={() => onDeleteTest(el._id)}
                                    okText="Да"
                                    cancelText="Нет"
                                  >
                                      <Button
                                        className={clsx(s.deleteBtn, s.btn)}
                                        danger
                                      >
                                          Удалить
                                      </Button>
                                  </Popconfirm>
                              </div>
                          </div>
                      </div>
                  </Badge.Ribbon>
                )
            }
          )}
          {currentDefaultTestData.testId &&
            <ChangeTitleOrQuestionCountModalDrawer
              refetch={allTestRefetch}
              testId={currentDefaultTestData.testId}
              title={currentDefaultTestData.title}
              quantityQuestion={currentDefaultTestData.quantityQuestion}
              open={currentDefaultTestData.openModal}
              setOpen={handleOpenChangeInfoTest}
            />
          }
      </Fragment>
    );
};

export default AllAdminTestsList;
