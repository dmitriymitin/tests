import React from 'react';
import clsx from 'clsx';
import s from './UserTestInfo.module.scss';
import {useParams} from 'react-router-dom';
import VariantRender from './components/VariantRender';
import {useTestUserResult} from "../../http/hooks/useTestUserResult";
import IsVisible from "../../components/ui/isVisibleWrapper";
import {Spin} from "antd";

const UserTestInfo = () => {
  const {userAnswerId} = useParams();
  const {data, isLoading} = useTestUserResult(userAnswerId);
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
          <VariantRender userAnswerId={userAnswerId}/>
        </div>
      </IsVisible>
    </>
  );
};

export default UserTestInfo;
