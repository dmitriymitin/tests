import React, {FC, Fragment, ReactNode} from 'react';

interface IIsVisibleWrapperProps {
  isVisible?: boolean,
  children: ReactNode
}

const IsVisibleWrapper: FC<IIsVisibleWrapperProps> = ({isVisible, children}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <Fragment>
      {children}
    </Fragment>
  );
};

export default IsVisibleWrapper;