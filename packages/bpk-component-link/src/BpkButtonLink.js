/*
 * Backpack - Skyscanner's Design System
 *
 * Copyright 2017 Skyscanner Ltd
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import PropTypes from 'prop-types';
import React from 'react';
import { cssModules } from 'bpk-react-utils';

import STYLES from './bpk-link.scss';

const getClassName = cssModules(STYLES);

const BpkButtonLink = (props) => {
  const {
    children,
    className,
    onClick,
    white,
    ...rest
  } = props;
  const classNames = [getClassName('bpk-link')];

  if (white) { classNames.push(getClassName('bpk-link--white')); }
  if (className) { classNames.push(className); }

  return (
    <button type="button" className={classNames.join(' ')} onClick={onClick} {...rest}>
      {children}
    </button>
  );
};

BpkButtonLink.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  white: PropTypes.bool,
};

BpkButtonLink.defaultProps = {
  className: null,
  white: false,
};

export default BpkButtonLink;
