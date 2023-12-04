'use client'
import s from "./AllAdminTestListWrapper.module.scss";
import {FC, memo} from "react";
import AllAdminTestsList from "./AllAdminTestsList";

interface AllAdminTestListWrapperProps {}

const AllAdminTestListWrapper: FC<AllAdminTestListWrapperProps> = ({}) => {

    return <AllAdminTestsList
        page={1}
        query={''}
    />
};

export default memo(AllAdminTestListWrapper);
