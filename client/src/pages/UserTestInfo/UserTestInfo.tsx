import React from 'react';
import clsx from 'clsx';
import s from './UserTestInfo.module.scss';
import {useParams} from 'react-router-dom';
import VariantRender from './components/VariantRender';

const UserTestInfo = () => {
  const {userAnswerId} = useParams();
  return (
    <div className={clsx(s.wrapper, 'container')}>
      <h1 className={'title'}>
      </h1>
      <VariantRender userAnswerId={userAnswerId}/>
    </div>
  );
};

export default UserTestInfo;
