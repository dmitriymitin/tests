import React from 'react';
import {Link} from 'react-router-dom';
import {CLIENT_URL} from '../../../http';
import {RouteNames} from '../../../router';

interface IQuestionLink {
  id?: string;
  convertId?: string;
  isPublic?: boolean;
}

const QuestionLink = ({id, isPublic, convertId}: IQuestionLink) => {
  return (
    isPublic
      ? (
        <Link className="fs-16" to={`${CLIENT_URL}` + RouteNames.ADMIN_QUESTION_INFO + `/${id}`}>
          {convertId}
        </Link>
      ) : (
        <div className="fs-16">{convertId}</div>
      )
  );
};

export default QuestionLink;
