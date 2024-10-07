import React from 'react';
import Auth from '../pages/Auth';
import Test from '../pages/Test/Test';
import Admin from '../pages/AdminListTestsPage';
import Tests from '../pages/Tests';
import AdminTestInfo from '../pages/AdminTestInfo/AdminTestInfo';
import AdminTestKeyInfo from '../pages/AdminTestKeyInfo/AdminTestKeyInfo';
import CreateCustomTest from '../pages/CreateCustomTest/CreateCustomTest';
import CreateCustomTestDescriptionPage from '../pages/CreateCustomTestDescriptionPage/CreateCustomTestDescriptionPage';
import AuthDev from '../pages/AuthDev';
import AdminSearchStudents from '../pages/AdminSearchStudents/AdminSearchStudents';
import AdminSetting from '../pages/AdminSetting/AdminSetting';
import AdminListTestsPage from '../pages/AdminListTestsPage';
import Questions from '../pages/Questions';
import CreateQuestionPage from '../pages/CreateQuestionPage/CreateQuestionPage';
import UpdateQuestionPage from "../pages/UpdateQuestionPage/UpdateQuestionPage";
import InfoQuestionPage from "../pages/InfoQuestionPage/InfoQuestionPage";

export interface IRoute {
    path: string;
    component: React.ComponentType;
}

export enum RouteNames {
    LOGIN = '/login',
    DEV_LOGIN = '/dev/login',
    TESTS = '/',
    TEST = '/tests/:testId',
    CREATE_CUSTOM_TEST = '/admin/test/create/customTest',
    CREATE_CUSTOM_TEST_DESCRIPTION = '/admin/test/create/customTest/description',
    ADMIN = '/admin',
    ADMIN_TEST_INFO = '/admin/test/info',
    ADMIN_TEST_KEY_INFO = '/admin/test/infoKey',
    ADMIN_SEARCH_STUDENTS = '/admin/student/search',
    ADMIN_TESTS_LIST = '/admin/test/list',
    ADMIN_SETTING = '/admin/setting',
    ADMIN_QUESTIONS_LIST = '/admin/question/list',
    ADMIN_QUESTION_CREATE = '/admin/question/create',
    ADMIN_QUESTION_UPDATE = '/admin/question/update',
    ADMIN_QUESTION_INFO = '/question/info',
}

export const publicRoutes : IRoute[] = [
  {
    path: RouteNames.TESTS,
    component: Tests
  },
  {
    path: RouteNames.TEST,
    component: Test
  },
  {
    path: RouteNames.LOGIN,
    component: Auth
  },
  {
    path: RouteNames.DEV_LOGIN,
    component: AuthDev
  }
];

export const privateRoutes : IRoute[] = [
  {
    path: RouteNames.TESTS,
    component: Tests
  },
  {
    path: RouteNames.TEST,
    component: Test
  },
  {
    path: RouteNames.ADMIN_TESTS_LIST,
    component: AdminListTestsPage
  },
  {
    path: RouteNames.ADMIN,
    component: AdminListTestsPage
  },
  {
    path: RouteNames.ADMIN_TEST_INFO + '/:testId',
    component: AdminTestInfo
  },
  {
    path: RouteNames.ADMIN_TEST_KEY_INFO + '/:testId',
    component: AdminTestKeyInfo
  },
  {
    path: RouteNames.CREATE_CUSTOM_TEST_DESCRIPTION + '/:testId',
    component: CreateCustomTestDescriptionPage
  },
  {
    path: RouteNames.CREATE_CUSTOM_TEST + '/:testId',
    component: CreateCustomTest
  },
  {
    path: RouteNames.ADMIN_SEARCH_STUDENTS,
    component: AdminSearchStudents
  },
  {
    path: RouteNames.ADMIN_SETTING,
    component: AdminSetting
  },
  {
    path: RouteNames.ADMIN_QUESTIONS_LIST,
    component: Questions
  },
  {
    path: RouteNames.ADMIN_QUESTION_CREATE,
    component: CreateQuestionPage
  },
  {
    path: RouteNames.ADMIN_QUESTION_INFO + '/:questionId',
    component: InfoQuestionPage
  },
  {
    path: RouteNames.ADMIN_QUESTION_UPDATE + '/:questionId',
    component: UpdateQuestionPage
  }
];
