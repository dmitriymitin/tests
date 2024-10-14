import React, {Fragment} from 'react';
import s from './VariantRender.module.scss';

interface IVariantRender {
  userAnswerId?: string;
}

const VariantRender = ({userAnswerId}: IVariantRender) => {
  return (
    <div>
      {userAnswerId}
    </div>
  );
};

export default VariantRender;
