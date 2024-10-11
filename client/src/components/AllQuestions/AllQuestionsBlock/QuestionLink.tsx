import React from 'react';
import {Link} from 'react-router-dom';
import {CLIENT_URL} from '../../../http';
import {RouteNames} from '../../../router';
import {useTypedSelector} from "../../../hooks/useTypedSelector";

interface IQuestionLink {
  id?: string;
  convertId?: string;
  isPublic?: boolean;
  className?: string;
}

const QuestionLink = ({id, convertId, className = "fs-16", ...props}: IQuestionLink) => {
  const {isAuth} = useTypedSelector(state => state.auth);
  const isPublic = isAuth ? true : props.isPublic;
  return (
    isPublic
      ? (
        <Link className={className} to={`${CLIENT_URL}` + RouteNames.ADMIN_QUESTION_INFO + `/${id}`}>
          {convertId}
        </Link>
      ) : (
        <div className={className}>{convertId}</div>
      )
  );
};

export default QuestionLink;
