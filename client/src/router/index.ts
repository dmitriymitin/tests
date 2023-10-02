import React from "react";
import Auth from "../pages/Auth";
import Test from "../pages/Test";
import Admin from "../pages/Admin";
import Tests from "../pages/Tests";
import AdminTestInfo from "../pages/AdminTestInfo";
import AdminTestKeyInfo from "../pages/AdminTestKeyInfo";

export interface IRoute {
    path: string;
    component: React.ComponentType;
}

export enum RouteNames {
    LOGIN = '/login',
    TESTS = '/',
    TEST = "/tests/:testId",
    ADMIN = '/admin',
    ADMIN_TEST_INFO = "/admin/testInfo/:testId",
    ADMIN_TEST_KEY_INFO = "/admin/testInfo/key/:testId"
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
    }
]
