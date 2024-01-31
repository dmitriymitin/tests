import React from "react";
import Auth from "../pages/Auth";
import Test from "../pages/Test/Test";
import Admin from "../pages/Admin";
import Tests from "../pages/Tests";
import AdminTestInfo from "../pages/AdminTestInfo/AdminTestInfo";
import AdminTestKeyInfo from "../pages/AdminTestKeyInfo/AdminTestKeyInfo";
import CreateCustomTest from "../pages/CreateCustomTest/CreateCustomTest";
import CreateCustomTestDescriptionPage from "../pages/CreateCustomTestDescriptionPage/CreateCustomTestDescriptionPage";
import AuthDev from "../pages/AuthDev";
import AdminSearchStudents from "../pages/AdminSearchStudents/AdminSearchStudents";

export interface IRoute {
    path: string;
    component: React.ComponentType;
}

export enum RouteNames {
    LOGIN = '/login',
    DEV_LOGIN = '/dev/login',
    TESTS = '/',
    TEST = "/tests/:testId",
    CREATE_CUSTOM_TEST = "/admin/testInfo/customTest/:testId",
    CREATE_CUSTOM_TEST_DESCRIPTION = '/admin/testInfo/customTest/description/:testId',
    ADMIN = '/admin',
    ADMIN_TEST_INFO = "/admin/testInfo/:testId",
    ADMIN_TEST_KEY_INFO = "/admin/testInfo/key/:testId",
    ADMIN_SEARCH_STUDENTS = "/admin/searchStudents"
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
]

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
        path: RouteNames.ADMIN,
        component: Admin
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
    }
]
