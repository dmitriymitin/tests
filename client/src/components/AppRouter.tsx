import React, {FC} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import {privateRoutes, publicRoutes, RouteNames} from '../router';
import {useTypedSelector} from '../hooks/useTypedSelector';
import AdminFloatButton from './AdminFloatButton/AdminFloatButton';
const AppRouter : FC = () => {
  const {isAuth} = useTypedSelector(state => state.auth);

  return (
    isAuth
      ? <>
        <Routes>
          {privateRoutes.map(({path, component: Component}) =>
            <Route
                        key={path}
                        path={path}
                        element={<Component/>}
            />
          )}
          <Route path="*" element={<Navigate to = {RouteNames.TESTS} replace/>}/>
        </Routes>
        <AdminFloatButton/>
      </>
      : <Routes>
        {publicRoutes.map(({path, component: Component}) =>
          <Route
                            key={path}
                            path={path}
                            element={<Component/>}
          />
        )}
        <Route path="*" element={<Navigate to = {RouteNames.TESTS} replace/>}/>
      </Routes>
  );
};

export default AppRouter;
