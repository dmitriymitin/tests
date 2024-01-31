import React, {useState} from 'react';
import s from "./AdminSearchStudentsBlock.module.scss";
import {Button, Empty, Input, Pagination, Spin} from "antd";
import {useQuery} from "react-query";
import {getAllStudentsBySearch} from "../../api/test";
import UseDebounce from "../../hooks/UseDebounce";
import clsx from "clsx";
import {useNavigate} from "react-router-dom";

const AdminSearchStudentsBlock = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [searchInput] = UseDebounce(search, 700);
    const [page, setPage] = useState(1);
    const {data: studentsData, isLoading} = useQuery({
        queryKey: ['students' + searchInput + page],
        queryFn: () => getAllStudentsBySearch({
            search: searchInput,
            pageNumber: page
        })
    })
    const students = studentsData?.data

    return (
        <div className={s.wrapper}>
            <h1 className={"title"}>
                Поиск результатов студентов
            </h1>
            <div className={s.searchBlock}>
                <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Введите ФИО стуеднта"/>
                {isLoading && <div className={s.statusWrapper}><Spin/></div>}
                {!isLoading && students && students?.length === 0 &&
                    <div className={s.statusWrapper}><Empty/></div>
                }
                {students && students?.length > 0 &&
                    <ul className={s.resultsWrapper}>
                        {students?.map(el =>
                            <li key={el.userInfo._id} className={clsx(s.resultsWrapperItem, 'testBackground')}>
                                <div className={s.infoWrapper}>
                                    <p className={s.title}>
                                        {el.userInfo.FIOGroup}
                                    </p>
                                    <p className={s.title}>
                                        <strong>Название теста:</strong> {el.test.title}
                                    </p>
                                </div>
                                <div className={s.btns}>
                                    <Button
                                        type={'primary'}
                                        onClick={() => {
                                            localStorage.setItem('FIO', el.userInfo.FIOGroup)
                                            navigate(`/admin/testInfo/${el.userInfo.testId}`)
                                        }}
                                    >
                                        Перейти к тесту
                                    </Button>
                                </div>
                            </li>
                        )}
                    </ul>
                }
            </div>
            {studentsData && studentsData?.totalCount > 10 &&
                <div className={s.pagination}>
                    <Pagination onChange={e => setPage(e)} current={page} total={studentsData?.totalCount} pageSize={10}/>
                </div>
            }
        </div>
    );
};

export default AdminSearchStudentsBlock;
