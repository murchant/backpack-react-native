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

import React, { Component, type ComponentType, type ElementProps } from 'react';
import PropTypes from 'prop-types';
import { Animated, StyleSheet, View, ViewPropTypes, Image } from 'react-native';
import {
  borderRadiusSm,
  animationDurationBase,
  colorSkyGrayTint04,
} from 'bpk-tokens/tokens/base.react.native';
import AnimatedValue from 'react-native/Libraries/Animated/src/nodes/AnimatedValue';
import BpkSpinner from 'react-native-bpk-component-spinner';

type ImageProps = ElementProps<typeof Image>;
type ViewProps = ElementProps<typeof View>;
type ViewStyleProp = $PropertyType<ViewProps, 'style'>;

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    height: '100%',
  },
  outerWithBorderRadius: {
    borderRadius: borderRadiusSm,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingIndicatorView: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: colorSkyGrayTint04,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
});

export type Props = {
  ...$Exact<ImageProps>,
  style: ViewStyleProp,
  inView: boolean,
  loaded: boolean,
  rounded: boolean,
  imageComponent: ComponentType<ImageProps>,
};

class BpkImage extends Component<Props> {
  showLoadingIndicator: boolean;

  imageOpacity: AnimatedValue;

  loadingIndicatorOpacity: AnimatedValue;

  static propTypes = {
    // see: https://github.com/facebook/react-native/blob/master/Libraries/Image/ImageSourcePropType.js#L82
    source: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
      PropTypes.arrayOf(PropTypes.object),
    ]).isRequired,
    inView: PropTypes.bool,
    loaded: PropTypes.bool,
    onLoad: PropTypes.func,
    rounded: PropTypes.bool,
    style: ViewPropTypes.style,
    imageComponent: PropTypes.func,
  };

  static defaultProps = {
    inView: true,
    loaded: true,
    onLoad: null,
    rounded: true,
    style: null,
    imageComponent: Animated.Image,
  };

  constructor(props: Props) {
    super(props);

    this.showLoadingIndicator = !props.loaded;
    this.imageOpacity = new Animated.Value(props.loaded ? 1 : 0);
    this.loadingIndicatorOpacity = new Animated.Value(props.loaded ? 0 : 1);
  }

  componentDidUpdate = (prevProps: Props) => {
    if (!prevProps.loaded && this.props.loaded) {
      Animated.sequence([
        Animated.timing(this.imageOpacity, {
          toValue: 1,
          duration: animationDurationBase,
        }),
        Animated.timing(this.loadingIndicatorOpacity, {
          toValue: 0,
          duration: animationDurationBase,
        }),
      ]).start(() => {
        this.showLoadingIndicator = false;
      });
    }
  };

  render() {
    const {
      style: userStyle,
      inView,
      rounded,
      loaded,
      imageComponent: ImageComponent,
      ...rest
    } = this.props;

    const outerStyle = [styles.outer];
    if (rounded) {
      outerStyle.push(styles.outerWithBorderRadius);
    }
    if (userStyle) {
      outerStyle.push(userStyle);
    }

    return this.showLoadingIndicator ? (
      <View style={outerStyle}>
        <Animated.View
          style={[
            styles.loadingIndicatorView,
            { opacity: this.loadingIndicatorOpacity },
          ]}
        >
          {inView && <BpkSpinner small type="dark" />}
        </Animated.View>
        {inView && (
          <ImageComponent
            onLoad={this.props.onLoad}
            style={[styles.image, { opacity: this.imageOpacity }]}
            {...rest}
          />
        )}
      </View>
    ) : (
      <ImageComponent onLoad={this.props.onLoad} style={outerStyle} {...rest} />
    );
  }
}

export default BpkImage;
