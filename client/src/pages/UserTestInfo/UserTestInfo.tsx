import React from 'react';
import clsx from 'clsx';
import s from './UserTestInfo.module.scss';
import {useNavigate, useParams} from 'react-router-dom';
import VariantRender from './components/VariantRender';
import {useTestUserResult} from '../../http/hooks/useTestUserResult';
import IsVisible from '../../components/ui/isVisibleWrapper';
import {message, Spin} from 'antd';
import {RouteNames} from '../../router';
import {useTypedSelector} from "../../hooks/useTypedSelector";

const UserTestInfo = () => {
  const {userAnswerId} = useParams();
  const {isAuth} = useTypedSelector(state => state.auth);
  const {data, isLoading, isError} = useTestUserResult(userAnswerId);
  const navigate = useNavigate();

  if (isError || (!isLoading && !data)) {
    message.error('Вариант не доступен для просмотра');
    navigate(RouteNames.ADMIN_TESTS_LIST);
    return null;
  }

  return (
    <>
      <IsVisible isVisible={isLoading}>
        <div className="status-block h220p">
          <Spin size="large"/>
        </div>
      </IsVisible>
      <IsVisible isVisible={!isLoading}>
        <div className={clsx(s.wrapper, 'container')}>
          <h1 className={'title'}>
            Вариант {data?.userInfo?.convertId}
          </h1>
          <IsVisible isVisible={isAuth && !data?.testInfo?.setting?.isPublicTestVariants}>
            <div className="red fs-16">
              Варианты не доступны для просмотра студентам
            </div>
          </IsVisible>
          <VariantRender userAnswerId={userAnswerId}/>
        </div>
      </IsVisible>
    </>
  );
};

export default UserTestInfo;
