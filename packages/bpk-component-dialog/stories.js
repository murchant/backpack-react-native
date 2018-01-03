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
import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { cssModules, withDefaultProps } from 'bpk-react-utils';

import BpkButton from 'bpk-component-button';
import BpkText from 'bpk-component-text';

import BpkDialog from './index';

import STYLES from './stories.scss';

const getClassName = cssModules(STYLES);

const Paragraph = withDefaultProps(BpkText, {
  textStyle: 'base',
  tagName: 'p',
  className: getClassName('bpk-dialog-paragraph'),
});

class DialogContainer extends Component {
  constructor() {
    super();

    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);

    this.state = {
      isOpen: false,
    };
  }

  onOpen() {
    this.setState({
      isOpen: true,
    });
  }

  onClose() {
    this.setState({
      isOpen: false,
    });
  }

  render() {
    const { ...rest } = this.props;

    return (
      <div id="dialog-container">
        <div id="application-container">
          <BpkButton onClick={this.onOpen}>Open dialog</BpkButton>
          <Paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut egestas
            sit amet nisi nec ultrices. In efficitur justo ac tristique
            ultricies. Mauris luctus felis arcu, a porttitor turpis aliquet
            faucibus. Aenean nibh nulla, dictum sit amet efficitur cursus,
            molestie vitae enim. Aenean vel nunc purus. Vestibulum consectetur
            luctus eros ac bibendum. Donec pretium nunc mi, sed iaculis nibh
            aliquet in. Integer ut accumsan orci, non hendrerit nunc. Quisque
            ante enim, convallis lacinia arcu eu, tincidunt dignissim nunc.
            Nulla facilisi. Curabitur mattis sapien imperdiet, dignissim ligula
            id, maximus erat. Morbi sed eros vitae augue accumsan dictum sit
            amet eu lectus. Integer vitae consectetur libero, sed porttitor
            urna.
          </Paragraph>
        </div>
        <BpkDialog
          closeLabel="Close dialog"
          id="my-dialog"
          className="my-classname"
          isOpen={this.state.isOpen}
          onClose={this.onClose}
          renderTarget={() => document.getElementById('dialog-container')}
          getApplicationElement={() =>
            document.getElementById('application-container')
          }
          {...rest}
        >
          {this.props.children}
          <BpkButton onClick={this.onClose}>Close</BpkButton>
        </BpkDialog>
      </div>
    );
  }
}

DialogContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

storiesOf('bpk-component-dialog', module)
  .add('Default', () => (
    <DialogContainer title="Dialog title">
      <p>This is a default dialog. You can put anything you want in here.</p>
    </DialogContainer>
  ))
  .add('Not dismissible', () => (
    <DialogContainer dismissible={false}>
      <p>
        This is not dismissible. To close it you must bind the `onClose`
        function to a component inside the dialog, like the button below.
      </p>
    </DialogContainer>
  ));
