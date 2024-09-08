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

export interface IRoute {
    path: string;
    component: React.ComponentType;
}

export enum RouteNames {
    LOGIN = '/login',
    DEV_LOGIN = '/dev/login',
    TESTS = '/',
    TEST = '/tests/:testId',
    CREATE_CUSTOM_TEST = '/admin/testInfo/customTest/:testId',
    CREATE_CUSTOM_TEST_DESCRIPTION = '/admin/testInfo/customTest/description/:testId',
    ADMIN = '/admin',
    ADMIN_TEST_INFO = '/admin/testInfo/:testId',
    ADMIN_TEST_KEY_INFO = '/admin/testInfo/key/:testId',
    ADMIN_SEARCH_STUDENTS = '/admin/searchStudents',
    ADMIN_QUESTIONS_LIST = '/admin/listQuestions',
    ADMIN_QUESTION_CREATE = '/admin/create/question',
    ADMIN_QUESTION_UPDATE = '/admin/update/question',
    ADMIN_QUESTION_INFO = '/admin/info/question/:questionId',
    ADMIN_TESTS_LIST = '/admin/listTests',
    ADMIN_SETTING = '/admin/setting'
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
    path: RouteNames.ADMIN_TEST_INFO,
    component: AdminTestInfo
  },
  {
    path: RouteNames.ADMIN_TEST_KEY_INFO,
    component: AdminTestKeyInfo
  },
  {
    path: RouteNames.CREATE_CUSTOM_TEST_DESCRIPTION,
    component: CreateCustomTestDescriptionPage
  },
  {
    path: RouteNames.CREATE_CUSTOM_TEST,
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
  // {
  //     path: RouteNames.ADMIN_QUESTION_INFO,
  //     component: UpdateQuestionPage
  // },
  // {
  //     path: RouteNames.ADMIN_QUESTION_UPDATE,
  //     component: UpdateQuestionPage
  // }
];
