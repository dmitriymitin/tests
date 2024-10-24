'use client';
import React from 'react';
import Icon from '@ant-design/icons';
import s from './IconAddNewTest.module.scss';
import {CustomIconComponentProps} from '@ant-design/icons/lib/components/Icon';

export const IconAnswerTypeCheckbox = (props: Partial<CustomIconComponentProps>) => {
  const icon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 104 75" version="1.1">
      <title>CheckBox</title>
      <g id="组件骨架图更新" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="🎉-5.0-新版" transform="translate(-931.000000, -1722.000000)" fillRule="nonzero">
          <g id="CheckBox" transform="translate(932.000000, 1722.000000)">
            <g id="7.Icon/control/checkbox/Checked-">
              <g id="icon/z/checkboxChecked-Copy" fill="#1677FF">
                <rect id="box" x="0" y="0" width="14" height="14" rx="2"/>
              </g>
              <g id="check" transform="translate(2.625000, 2.625000)">
                <rect id="Rectangle" fill="#000000" opacity="0" x="0" y="0" width="8.75" height="8.75"/>
                <path
         d="M8.28125,1.23046875 L7.59863281,1.23046875 C7.50292969,1.23046875 7.41210938,1.27441406 7.35351563,1.34960938 L3.32714844,6.45019531 L1.39648438,4.00390625 C1.33691406,3.92871094 1.24707031,3.88476562 1.15136719,3.88476562 L0.46875,3.88476562 C0.403320313,3.88476562 0.3671875,3.95996094 0.407226563,4.01074219 L3.08203125,7.39941406 C3.20703125,7.55761719 3.44726563,7.55761719 3.57324219,7.39941406 L8.34277344,1.35546875 C8.3828125,1.30566406 8.34667969,1.23046875 8.28125,1.23046875 Z"
         id="Path" stroke="#FFFFFF" strokeWidth="0.833333333" fill="#FFFFFF"/>
              </g>
            </g>
            <g id="icon/z/checkboxChecked-Copy" transform="translate(0.000000, 30.000000)" fill="#FFFFFF"
               stroke="#D9D9D9">
              <rect id="box" x="0" y="0" width="14" height="14" rx="2"/>
            </g>
            <g id="icon/z/checkboxChecked-Copy" transform="translate(0.000000, 60.000000)" fill="#F5F5F5"
               stroke="#D9D9D9">
              <rect id="box" x="0" y="0" width="14" height="14" rx="2"/>
            </g>
            <rect id="矩形复制-55" fill="#EBEBEB" x="23" y="30" width="80" height="14"/>
            <rect id="矩形复制-55备份-4" fill="#EBEBEB" x="23" y="0" width="80" height="14"/>
            <rect id="矩形复制-55备份" fill="#EBEBEB" x="23" y="60" width="80" height="14"/>
          </g>
        </g>
      </g>
    </svg>
  );

  return (
    <Icon rev={''} className={props.className} component={icon} {...props} />
  );
};
