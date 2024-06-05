import React from 'react';
import s from './AdminSettingBlock.module.scss';
import ChangeAllTestFirstQuestion from "../AllAdminTestsList/ChangeAllTestFirstQuestion/ChangeAllTestFirstQuestion";

const AdminSettingBlock = () => {
  return (
    <div className={s.wrapper}>
      <h1 className={"title"}>
        Общие настройки для всех тестов
      </h1>
      <ChangeAllTestFirstQuestion/>
    </div>
  );
};

export default AdminSettingBlock;