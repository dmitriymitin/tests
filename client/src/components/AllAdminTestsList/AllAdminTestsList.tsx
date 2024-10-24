import React, {Fragment, useState} from 'react';
import {Badge, Button, Empty, message, Popconfirm, Popover, Spin} from 'antd';
import {useMutation, useQueryClient} from 'react-query';
import {deleteTest, deleteTestFromFolder, IFullTest, updateAdminStatusTest} from '../../api/test';
import {testStatusType} from '../../type/test/type';
import {useNavigate} from 'react-router-dom';
import {CLIENT_URL} from '../../http';
import s from './AllAdminTestsList.module.scss';
import clsx from 'clsx';
import {CopyOutlined} from '@ant-design/icons';
import CustomTooltip from '../CustomTooltip';
import ChangeTitleOrQuestionCountModalDrawer from '../ChangeTitleOrQuestionCountModalDrawer';
import {ETypeTest} from '../../api/test/type';
import {getFormatCreateDate} from '../../utils/getFormatCreateDate';
import {getFormatUpdateDate} from '../../utils/getFormatUpdateDate';
import {useAllTest} from '../../http/hooks/useAllTest';
import {useAllFolder} from '../../http/hooks/useAllFolder';
import PutInFolderBtn from './PutInFolderBtn/PutInFolderBtn';
import {useSelectTestsStore} from '../../store/folders/useSelectTestsStore';
import {RouteNames} from '../../router';
import {getTestType} from '../../utils/helpers';
import IsVisible from "../ui/isVisibleWrapper";

const getTestStatusTextForBtn = (status: testStatusType) => {
  switch (status) {
    case 'Open':
      return 'Закрыть для всех';
    default:
      return 'Открыть для всех';
  }
};

const copyAddress = (value: string) => {
  navigator.clipboard.writeText(value);
};

const getTestStatusText = (status: testStatusType) => {
  switch (status) {
    case 'Open':
      return <div className={clsx(s.body__status, 'statusOpen')}>Открыт</div>;
    default:
      return <div className={clsx(s.body__status, 'statusClose')}>Закрыт</div>;
  }
};

interface AllAdminTestsListProps {
    filterById: string | undefined;
    isShowBadge: boolean;
    folderId: string | undefined;
    showTestInFolder: number;
}

const AllAdminTestsList = ({filterById, folderId, showTestInFolder, isShowBadge}: AllAdminTestsListProps) => {
  const selectTestsStore = useSelectTestsStore(store => store);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {data: allFolder, isLoading: isLoadingFolder} = useAllFolder();
  const [currentDefaultTestData, setCurrentDefaultTestData] = useState({
    testId: '',
    title: '',
    quantityQuestion: 0,
    openModal: false,
  });

  const currentStatus: testStatusType | undefined = (() => {
    if (!selectTestsStore.onlyMakeTestsAction) {
      return undefined;
    }

    if (selectTestsStore.lastCurrentAction === 'openTests') {
      return 'Open';
    }

    if (selectTestsStore.lastCurrentAction === 'closeTests') {
      return 'Close';
    }
  })();

  const {
    data: allTest,
    isLoading: isAllTestLoading,
    isFetching,
    refetch: allTestRefetch
  } = useAllTest(filterById, folderId, currentStatus);

  const {
    mutateAsync: deleteTestTrigger
  } = useMutation(deleteTest);

  const {
    mutateAsync: deleteTestFromFolderTrigger
  } = useMutation(deleteTestFromFolder);

  const {
    mutateAsync: updateStatusTestTrigger
  } = useMutation(updateAdminStatusTest);

  const onDeleteTest = async (id: string) => {
    try {
      await deleteTestTrigger(id);
      await queryClient.invalidateQueries({queryKey: ['allTests']});
    } catch (e) {
      message.error('Ошибка при удалении теста');
    }
  };

  const onUpdateStatusTest = async (id: string, status: testStatusType) => {
    try {
      await updateStatusTestTrigger({id, status});
      await queryClient.invalidateQueries({queryKey: ['allTests']});
    } catch (e) {
      message.error('Ошибка при обвнолении статуса теста');
    }
  };

  if (isAllTestLoading || isLoadingFolder || (selectTestsStore.currentAction ? false : isFetching)) {
    return <div className={s.loading}>
      <Spin size={'large'}/>
    </div>;
  }

  if (!allTest || allTest.length === 0) {
    return (
      <div className={s.all__tests__list__empty}>
        <Empty description={'Тестов пока нет'}/>
      </div>
    );
  }

  const handleOpenChangeInfoTest = (val: boolean) => {
    setCurrentDefaultTestData(prevState => ({
      ...prevState,
      openModal: val
    }));
  };

  const newAllTest = allTest?.reduce((acc, el, index) => {
    if (showTestInFolder) {
      acc.push(el);
    } else if (!el.folderId) {
      acc.push(el);
    }

    return acc;
  }, [] as (IFullTest)[]);

  const handleDeleteTestFromFolder = async (id) => {
    try {
      await deleteTestFromFolderTrigger(id);
      await allTestRefetch();
    } catch (e) {
      message.error('Ошибка при удалении теста из папки');
    }
  };

  return (
    <Fragment>
      {newAllTest.map((el, index) => {
        const folderName = allFolder?.find(folder => folder._id === el.folderId)?.name;
        const isShowTestInFolder = isShowBadge ? showTestInFolder : false;
        const isActiveTest = selectTestsStore.selectTests.includes(el._id);
        return (
          <Badge.Ribbon
                    key={el._id + index}
                    text={folderName} color="#363e45" style={{
                      display: isShowTestInFolder ? folderName ? 'block' : 'none' : 'none',
                    }}>
            <div
                        key={el._id + index}
                        className={
                          clsx(s.all__tests__list__wrapper,
                            {
                              [s.point]: !!selectTestsStore.currentAction,
                              [s.activeDefault]: isActiveTest && selectTestsStore.currentAction === 'openTests',
                              [s.activeDanger]: isActiveTest && (selectTestsStore.currentAction === 'closeTests' || selectTestsStore.currentAction === 'deleteTests'),
                              [s.activeSuccess]: isActiveTest && selectTestsStore.currentAction === 'clearResults',
                              [s.activeGray]: isActiveTest && selectTestsStore.currentAction === 'addInFolder'
                            })
                        }
                        onClick={() => {
                          if (!selectTestsStore.currentAction) {
                            return;
                          }

                          if (isActiveTest) {
                            selectTestsStore.removeTest(el._id);
                          } else {
                            selectTestsStore.addTest(el._id);
                          }
                        }}
            >
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
                    {(() => {
                      const testType = getTestType(el);
                      return (<>
                        {testType === ETypeTest.SIMPLE && 'Тест на доске'}
                        {testType === ETypeTest.WITH_DESCRIPTION && 'Тест с описанием'}
                        {testType === ETypeTest.WITH_QUESTIONS && 'Тест с вопросами'}
                      </>);
                    })()}
                  </div>
                </div>

                <div className={s.infoWrapper}>
                  <Popover className="cursor-pointer fs-14 mxw-100" content={CLIENT_URL + `/tests/${el._id}`}>
                    <p>Адрес теста</p>
                  </Popover>
                  <CustomTooltip isPreventDefault text={'Адрес теста был успешно скопирован!'}>
                    <button
                      className={s.addressCopyButton}
                      onClick={(e) => {
                        e.preventDefault();
                        copyAddress(CLIENT_URL + `/tests/${el._id}`);
                      }}
                    >
                      <CopyOutlined/>
                    </button>
                  </CustomTooltip>
                </div>

                <IsVisible isVisible={Boolean(el?.setting?.isPublicTestAnswers)}>
                  <div className={s.infoWrapper}>
                    <Popover className="cursor-pointer fs-14 mxw-100"
                             content={CLIENT_URL + RouteNames.TEST_INFO + `/${el._id}`}>
                      <p>Адрес результатов тестирования</p>
                    </Popover>
                    <CustomTooltip isPreventDefault text={'Адрес результатов тетсирования был успешно скопирован!'}>
                      <button
                        className={s.addressCopyButton}
                        onClick={(e) => {
                          e.preventDefault();
                          copyAddress(CLIENT_URL + RouteNames.TEST_INFO + `/${el._id}`);
                        }}
                      >
                        <CopyOutlined/>
                      </button>
                    </CustomTooltip>
                  </div>
                </IsVisible>

                <div className={s.infoWrapper}>
                  <p>Кол-во вопросов:</p>
                  <div
                    className={s.body}>{el.quantityQuestion || el.questions && el.questions.length || 0}</div>
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
                      onClick={(e) => {
                        e.stopPropagation();
                        const testType = getTestType(el);
                        // Обычный тест
                        if (testType === ETypeTest.SIMPLE) {
                          setCurrentDefaultTestData({
                            testId: el._id,
                            title: el.title,
                                quantityQuestion: el.quantityQuestion,
                                openModal: true
                              });
                              return;
                            }

                            if (testType === ETypeTest.WITH_DESCRIPTION) {
                              navigate(RouteNames.CREATE_CUSTOM_TEST_DESCRIPTION + `/${el._id}`);
                              return;
                            }

                            // Тест со своими вопросами
                            if (testType === ETypeTest.WITH_QUESTIONS) {
                              navigate(RouteNames.CREATE_CUSTOM_TEST + `/${el._id}`);
                              return;
                            }
                          }}
                    >
                      Редактировать
                    </Button>
                    <IsVisible isVisible={getTestType(el) !== ETypeTest.WITH_QUESTIONS}>
                      <Button
                        className={s.btn}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(RouteNames.ADMIN_TEST_KEY_INFO + `/${el._id}`);
                        }}
                      >
                        Ввести ключ
                      </Button>
                    </IsVisible>
                    <Button
                                        className={s.btn}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          localStorage.removeItem('FIO');
                                          navigate(RouteNames.TEST_INFO + `/${el._id}`);
                                        }}
                    >
                      Результаты
                    </Button>
                  </div>
                  <div className="flex-wrap gap-10">
                    {allFolder && allFolder.length > 0 && <PutInFolderBtn id={el._id}/>}
                    {
                      el.folderId && (
                        <Button
                          className={s.btn}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTestFromFolder(el._id);
                          }}
                        >
                          Удалить из папки
                        </Button>
                      )
                    }
                  </div>
                </div>
                <div className={s.btns}>
                  <Button
                                    className={clsx(s.btn)}
                                    danger={el.status === 'Open'}
                                    type={'primary'}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onUpdateStatusTest(el._id, el.status);
                                    }}
                  >
                    {getTestStatusTextForBtn(el.status)}
                  </Button>
                  <Popconfirm
                                    title="Удаление теста"
                                    description="Вы уверены, что хотите удалить тест?"
                                    onConfirm={() => {
                                      onDeleteTest(el._id);
                                    }}
                                    onPopupClick={e => e.stopPropagation()}
                                    okText="Да"
                                    cancelText="Нет"
                  >
                    <Button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                        }}
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
        );
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
