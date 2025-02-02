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

import PropTypes from 'prop-types';
import React, { Component, type Node, type Config } from 'react';
import { Animated, TextInput, View, ViewPropTypes } from 'react-native';
import BpkText from 'react-native-bpk-component-text';
import {
  getThemeAttributes,
  withTheme,
  type Theme,
} from 'react-native-bpk-theming';
import AnimatedValue from 'react-native/Libraries/Animated/src/nodes/AnimatedValue';
import { animationDurationSm } from 'bpk-tokens/tokens/base.react.native';
import TinyMask from 'tinymask';
import {
  withBpkAppearance,
  type WithBpkAppearanceInjectedProps,
} from 'react-native-bpk-appearance';

import { ValidIcon, InvalidIcon } from './BpkTextInputIcons';
import {
  getLabelStyle,
  getInputContainerStyle,
  getPlaceholderColor,
  getStyles,
} from './styles';
import { REQUIRED_THEME_ATTRIBUTES, themePropType } from './theming';

export type Props = {
  label: string,
  value: string,
  clearButtonMode: 'never' | 'while-editing' | 'unless-editing' | 'always',
  editable: boolean,
  description: ?string,
  inputRef: ?(Node) => void,
  mask: ?string,
  onBlur: ?() => void,
  onFocus: ?() => void,
  placeholder: ?string,
  style: ?(Object | Array<Object>),
  valid: ?boolean,
  validationMessage: ?string,
  accessoryView: ?Node,
  theme: ?Theme,
};

export const propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-foreign-prop-types
  clearButtonMode: TextInput.propTypes.clearButtonMode,
  description: PropTypes.string,
  editable: PropTypes.bool,
  inputRef: PropTypes.func,
  mask: PropTypes.string,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  placeholder: PropTypes.string,
  style: ViewPropTypes.style,
  valid: PropTypes.oneOf([true, false, null]),
  validationMessage: PropTypes.string,
  accessoryView: PropTypes.node,
  theme: themePropType,
};

export const defaultProps = {
  clearButtonMode: 'while-editing',
  description: null,
  editable: true,
  inputRef: null,
  mask: null,
  onBlur: null,
  onFocus: null,
  placeholder: null,
  style: null,
  valid: null,
  validationMessage: null,
  accessoryView: null,
  theme: null,
};

type State = {
  isFocused: boolean,
};

type EnhancedProps = Props & WithBpkAppearanceInjectedProps;

class BpkTextInput extends Component<EnhancedProps, State> {
  animatedValues: { color: AnimatedValue, labelPosition: AnimatedValue };

  tinymask: TinyMask;

  static propTypes = { ...propTypes };

  static defaultProps = { ...defaultProps };

  constructor(props: EnhancedProps) {
    super(props);

    this.state = {
      isFocused: false,
    };

    this.animatedValues = {
      color: new Animated.Value(this.getColorAnimatedValue()),
      labelPosition: new Animated.Value(this.getLabelPositionAnimatedValue()),
    };

    this.tinymask = new TinyMask(props.mask || '');
  }

  componentDidUpdate() {
    Animated.parallel([
      Animated.timing(this.animatedValues.color, {
        toValue: this.getColorAnimatedValue(),
        duration: animationDurationSm,
      }),
      Animated.timing(this.animatedValues.labelPosition, {
        toValue: this.getLabelPositionAnimatedValue(),
        duration: animationDurationSm,
      }),
    ]).start();
  }

  onFocus = () => {
    this.setState(
      () => ({ isFocused: true }),
      () => {
        if (this.props.onFocus) {
          this.props.onFocus();
        }
      },
    );
  };

  onBlur = () => {
    this.setState(
      () => ({ isFocused: false }),
      () => {
        if (this.props.onBlur) {
          this.props.onBlur();
        }
      },
    );
  };

  getColorAnimatedValue() {
    return this.state.isFocused ? 1 : 0;
  }

  getLabelPositionAnimatedValue() {
    return this.props.value || this.state.isFocused ? 0 : 1;
  }

  getPlaceholderValue() {
    const { isFocused } = this.state;
    const { accessoryView, mask, placeholder } = this.props;
    const hasAccessoryView = accessoryView !== null;

    return isFocused || hasAccessoryView ? placeholder || mask : null;
  }

  render() {
    const { isFocused } = this.state;
    const {
      description,
      inputRef,
      placeholder,
      validationMessage,
      editable,
      label,
      value,
      mask,
      style: userStyle,
      valid,
      onFocus,
      onBlur,
      accessoryView,
      theme,
      bpkAppearance,
      ...rest
    } = this.props;
    const styles = getStyles(bpkAppearance);
    const hasAccessoryView = accessoryView !== null;
    const placeholerValue = this.getPlaceholderValue();
    const placeholderColor = getPlaceholderColor(bpkAppearance);

    const validityIcon = valid ? (
      <ValidIcon />
    ) : (
      valid === false && <InvalidIcon />
    );

    const themeAttributes = getThemeAttributes(
      REQUIRED_THEME_ATTRIBUTES,
      theme,
    );

    const focusedColor = themeAttributes
      ? themeAttributes.textInputFocusedColor
      : undefined;

    const animatedLabelStyle = getLabelStyle(
      this.animatedValues.color,
      this.animatedValues.labelPosition,
      { value, valid, editable, hasAccessoryView },
      focusedColor,
      bpkAppearance,
    );

    const animatedInputStyle = getInputContainerStyle(
      this.animatedValues.color,
      hasAccessoryView,
      valid,
      focusedColor,
      bpkAppearance,
    );

    const inputTextStyle = [styles.input];

    if (themeAttributes) {
      inputTextStyle.push({ fontFamily: themeAttributes.textFontFamily });
      animatedLabelStyle.push({ fontFamily: themeAttributes.textFontFamily });
    }

    const renderExtraInfo = () => {
      if (valid === false && validationMessage) {
        return (
          <BpkText textStyle="xs" style={styles.validationMessage}>
            {validationMessage}
          </BpkText>
        );
      }
      if (description) {
        return (
          <BpkText textStyle="xs" style={styles.description}>
            {description}
          </BpkText>
        );
      }
      return null;
    };

    return (
      <View style={userStyle}>
        <View style={styles.rowContainer}>
          <Animated.Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={animatedLabelStyle}
            allowFontScaling={!hasAccessoryView}
          >
            {label}
          </Animated.Text>
          {accessoryView}
          <Animated.View style={animatedInputStyle}>
            <TextInput
              editable={editable}
              value={mask ? this.tinymask.mask(value) : value || ''}
              style={inputTextStyle}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              // Ignored because we simply do not understand it
              // $FlowFixMe
              ref={inputRef}
              underlineColorAndroid="transparent"
              {...rest}
              placeholder={placeholerValue}
              placeholderTextColor={placeholderColor}
            />
            {!isFocused && validityIcon}
          </Animated.View>
        </View>
        {renderExtraInfo()}
      </View>
    );
  }
}

const WithTheme = withTheme(BpkTextInput);
type BpkTextConfig = Config<Props, typeof defaultProps>;
export default withBpkAppearance<BpkTextConfig>(WithTheme); // eslint-disable-line prettier/prettier
