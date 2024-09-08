'use client';
import React from 'react';
import Icon from '@ant-design/icons';
import {CustomIconComponentProps} from '@ant-design/icons/lib/components/Icon';

export const IconAnswerTypeText = (props: Partial<CustomIconComponentProps>) => {
  const icon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
         viewBox="0 0 121 77" version="1.1">
      <title>Input</title>
      <g id="组件骨架图更新" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="🎉-5.0-新版" transform="translate(-558.000000, -1959.000000)">
          <g id="Input" transform="translate(559.000000, 1960.000000)">
            <g id="3.DataEntry/Input/Default/Basic-#">
              <g id="Z/Shape/RectangleRC/2px/RC-A">
                <rect id="BG/fill" fill="#FFFFFF" fillRule="nonzero" x="0.5" y="0.5" width="118" height="30" rx="1"/>
                <rect id="outline" stroke="#000000" opacity="0.15" x="0" y="0" width="119" height="31" rx="6"/>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );

  return (
    <Icon rev={''} className={props.className} component={icon} {...props} />
  );
};
