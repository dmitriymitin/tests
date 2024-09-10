import React from 'react';
import clsx from 'clsx';
import gs from '../../../GlobalStyles.module.scss';
import {RouteNames} from '../../../router';
import {PlusOutlined} from '@ant-design/icons';
import {useTypedSelector} from '../../../hooks/useTypedSelector';
import IsVisible from '../../ui/isVisibleWrapper';

interface IPillarHeadProps {
  title?: string;
  btnText?: string;
  btnClick?: () => void;
}

const PillarHead = ({title, btnText, btnClick}: IPillarHeadProps) => {
  const {isAuth} = useTypedSelector(state => state.auth);
  return (
    <div className="pillar-head flex-row flex-middle gap-10 fs-16">
      <span>{title}</span>
      <IsVisible isVisible={isAuth}>
        <button
          className={clsx('clearButton', gs.btnTitleSmall)}
          onClick={btnClick}
        >
          <PlusOutlined/>
          {btnText}
        </button>
      </IsVisible>
    </div>
  );
};

export default PillarHead;
