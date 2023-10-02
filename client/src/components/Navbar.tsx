import React from 'react';
import {useTypedSelector} from "../hooks/useTypedSelector";
import {useNavigate} from 'react-router-dom'

const Navbar = () => {
    const navigate = useNavigate();
    const {isAuth} = useTypedSelector(state => state.auth)

    return (
        <div className="navbar">
            <div className={"container"}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between"
                }}>
                    <button className={'clearButton'}  onClick={() => navigate('/')}>
                        Главная страница
                    </button>
                    {isAuth &&
                        <button className={'clearButton'}  onClick={() => navigate('/admin')}>
                            Админ панель
                        </button>
                    }
                </div>
            </div>
        </div>
    );
};

export default Navbar;
