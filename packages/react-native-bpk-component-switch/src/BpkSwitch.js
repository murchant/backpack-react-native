/*
 * Backpack - Skyscanner's Design System
 *
 * Copyright 2016-2019 Skyscanner Ltd
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

/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { Platform, Switch } from 'react-native';
import {
  getThemeAttributes,
  makeThemePropType,
  withTheme,
} from 'react-native-bpk-theming';
import {
  colorSkyBlue,
  colorBlackTint01,
  colorSkyGrayTint06,
  colorSkyGrayTint07,
} from 'bpk-tokens/tokens/base.react.native';
import { useBpkDynamicValue } from 'react-native-bpk-appearance';
import { setOpacity } from 'bpk-tokens';

const REQUIRED_THEME_ATTRIBUTES = ['switchPrimaryColor'];

const useColors = (themeAttributes: ?Object, value: ?boolean): Object => {
  const primaryColor = themeAttributes
    ? themeAttributes.switchPrimaryColor
    : colorSkyBlue;

  // The color props mean different things based on the platform.
  const colors = Platform.select({
    ios: {
      ios_backgroundColor: useBpkDynamicValue({
        light: colorSkyGrayTint06,
        dark: colorBlackTint01,
      }),
      trackColor: {
        true: primaryColor,
      },
    },
    android: {
      thumbColor: value ? primaryColor : colorSkyGrayTint07,
      trackColor: {
        false: colorSkyGrayTint06,
        true: setOpacity(primaryColor, 0.32), // Taken from here https://github.com/material-components/material-components-android/blob/master/lib/java/com/google/android/material/color/MaterialColors.java#L42
      },
    },
  });
  return colors;
};

export type Props = {
  value: ?boolean,
  theme: ?Object,
};

const BpkSwitch = (props: Props) => {
  const { value, theme, ...rest } = props;
  const themeAttributes = getThemeAttributes(REQUIRED_THEME_ATTRIBUTES, theme);

  return (
    <Switch {...useColors(themeAttributes, value)} value={value} {...rest} />
  );
};

BpkSwitch.propTypes = {
  value: PropTypes.bool,
  theme: makeThemePropType(REQUIRED_THEME_ATTRIBUTES),
};

BpkSwitch.defaultProps = {
  value: false,
  theme: null,
};

export default (withTheme(BpkSwitch): typeof BpkSwitch);
