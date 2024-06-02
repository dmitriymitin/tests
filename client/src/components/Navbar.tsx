import React from 'react';
import {useTypedSelector} from "../hooks/useTypedSelector";
import {useNavigate} from 'react-router-dom'
import iconStudent from '../utils/ui/images/searchStudent.png'

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
                  <button className={'clearButton'} onClick={() => navigate('/')}>
                      Главная страница
                  </button>
                  {isAuth &&
                    <div className={'btnNavbarWrapper'}>
                        <button className={'clearButton'} onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            navigate('/admin/searchStudents');
                        }}>
                           <img style={{
                             width: 35,
                             height: 35
                           }} src={iconStudent} alt={'иконка поиска студентов'}/>
                        </button>
                        <button className={'clearButton'} onClick={() => navigate('/admin')}>
                            Панель админа
                        </button>
                    </div>
                  }
              </div>
          </div>
      </div>
    );
};

export default Navbar;
