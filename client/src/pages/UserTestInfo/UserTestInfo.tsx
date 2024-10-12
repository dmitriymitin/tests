import React from 'react';
import clsx from "clsx";
import s from "../AdminTestInfo/AdminTestInfo.module.scss";
import {useParams} from "react-router-dom";

const UserTestInfo = () => {
  const {userAnswerId} = useParams();
  return (
    <div className={clsx(s.wrapper, 'container')}>
      <h1 className={'title'}>
        {userAnswerId}
      </h1>
    </div>
  );
};

export default UserTestInfo;