import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {useMutation, useQuery} from 'react-query';
import {clearTestResults, getOneTestInfo} from '../../api/test';
import {Button, Input, message, Popconfirm, Radio, Spin} from 'antd';
import AdminTestInfoTable from '../../components/AdminTestInfoTable/AdminTestInfoTable';
import s from './AdminTestInfo.module.scss';
import clsx from 'clsx';
import {ETypeTest} from '../../api/test/type';
import {DownloadOutlined} from '@ant-design/icons';
import {API_URL} from '../../http';
import gs from '../../GlobalStyles.module.scss';
import {RouteNames} from '../../router';
import IsVisible from '../../components/ui/isVisibleWrapper';
import {getTestType} from '../../utils/helpers';
import {useTypedSelector} from "../../hooks/useTypedSelector";

const AdminTestInfo = () => {
  const navigate = useNavigate();
  const {testId} = useParams();
  const fio = localStorage.getItem('FIO');
  const [isFullInfo, setIsFullInfo] = useState(false);
  const [search, setSearch] = useState(fio || '');
  const {isAuth} = useTypedSelector(state => state.auth);

  const {
    data: testInfoData,
    isLoading: isTestInfoLoading,
    isFetching: isTestInfoFetching,
    refetch,
  } = useQuery(['adminTestInfo', testId], () => getOneTestInfo(testId), {
    refetchOnWindowFocus: false,
    retry: 1
  });
  const [testInfoUsersResult, setTestInfoUsersResult] = useState(testInfoData?.usersInfo);
  const testType = getTestType(testInfoData?.test);

  const {
    mutateAsync: clearTestResultsTrigger,
    isLoading: clearTestResultsLoading
  } = useMutation(clearTestResults);

  useEffect(() => {
    setTestInfoUsersResult(testInfoData?.usersInfo);
  }, [testInfoData]);

  useEffect(() => {
    if (!search) {
      setTestInfoUsersResult(testInfoData?.usersInfo);
      return;
    }

    setTestInfoUsersResult(prev => {
      const test = testInfoData?.usersInfo?.filter((el) => el.FIOGroup.toLowerCase().includes((search || fio || '').toLowerCase()));
      return test;
    }
    );
  }, [search, fio, testInfoData]);

  if (isTestInfoLoading || isTestInfoFetching) {
    return <div className={s.spin}>
      <Spin size={'large'}/>
    </div>;
  }

  if (!testInfoData) {
    message.error('Результаты тестирования не доступны для просмотра');
    navigate('/admin');
    return null;
  }

  const handleClearResults = async () => {
    try {
      await clearTestResultsTrigger(testId);
      await refetch();
    } catch (e) {
      message.error('Ошибка при удалении результатов');
    }
  };

  const handleChangeFullInfo = () => {
    if (isFullInfo) {
      setIsFullInfo(false);
    } else {
      setIsFullInfo(true);
    }
  };

  const currentTest = testInfoData.test;

  return (
    <div className={clsx(s.admin__test__info, 'container')}>
      <h1 className={'title'}>
        {currentTest.title}
      </h1>
      <IsVisible isVisible={isAuth && !currentTest?.setting?.isPublicTestAnswers}>
        <div className="red fs-16">
          Результаты теста не доступны для просмотра студентам
        </div>
      </IsVisible>
      <IsVisible isVisible={isAuth && currentTest?.setting?.isPublicTestAnswers && currentTest?.setting?.isTestAnswersDetail}>
        <div className="red fs-16">
          Результаты теста для студентов будут не детализированы
        </div>
      </IsVisible>
      <IsVisible isVisible={isAuth}>
        <div className={s.admin__test__info__changeKey}>
          <IsVisible isVisible={testType !== ETypeTest.WITH_QUESTIONS}>
            Ключ {testInfoData.testKey || 'не установлен'}
            <Button onClick={() => navigate(RouteNames.ADMIN_TEST_KEY_INFO + `/${currentTest._id}`)}>Изменить
              ключ</Button>
          </IsVisible>
          {testInfoData.test.questions &&
              <Button onClick={() => navigate(RouteNames.CREATE_CUSTOM_TEST + `/${currentTest._id}`)}>Редактировать
                  тест</Button>
          }
          <Popconfirm
            title="Очистка рузльтатов"
            description="Вы уверены, что хотите очистить результаты?"
            onConfirm={handleClearResults}
            okText="Да"
            cancelText="Нет"
          >
            <Button
              loading={clearTestResultsLoading}
              style={{width: 200}}
              type={'default'}
              danger
            >
              Очистить результаты
            </Button>
          </Popconfirm>
        </div>
      </IsVisible>
      <Input placeholder={'Введите ФИО для поиска'} value={search} onChange={e => setSearch(e.target.value)}/>
      <IsVisible isVisible={isAuth ? true : testInfoData?.test?.setting?.isTestAnswersDetail}>
        <div className={s.change__status__wrapper}>
          <Radio.Group value={isFullInfo} onChange={handleChangeFullInfo}>
            <Radio.Button value={false}>Общая информация</Radio.Button>
            <Radio.Button value={true}>Подробная информация</Radio.Button>
          </Radio.Group>
        </div>
      </IsVisible>
      {
        testInfoUsersResult?.length === 0
          ? <p>Результов по тесту нет</p>
          : <div className={s.test__info__wrapper}>
            {isFullInfo && isAuth && (
              <div className={s.downloadBtnWrapper}>
                <Link
                  to={`${API_URL}/test/downloadTest/${testId}`}>
                  <button
                    className={clsx('clearButton fs-14 gap-10', gs.btnTitleSmall)}
                  >
                    <DownloadOutlined/>
                    Скачать EXEL
                  </button>
                </Link>
                {/* <Link */}
                {/*  to={`${API_URL}/test/downloadTest/${testId}`} */}
                {/*  className={s.downloadBtn} */}
                {/* ><DownloadOutlined/></Link> */}
              </div>
            )}
            {testInfoUsersResult &&
            <AdminTestInfoTable
                    isFullInfo={isFullInfo}
                    currentTest={currentTest}
                    usersTestInfo={testInfoUsersResult}
                    testKey={testInfoData.testKey}
            />
            }
          </div>
      }
    </div>
  );
};

export default AdminTestInfo;
