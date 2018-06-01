import React, { Component, createElement } from 'react';
import { Platform, ActivityIndicator, TouchableNativeFeedback } from 'react-native';
import { string, bool, func, oneOf, number, oneOfType } from 'prop-types';
import { Text, Icon, Box, Touchable } from '../index';

const buttonColors = {
  red: 'red',
  green: 'green',
  blue: 'blue',
  white: 'white',
  transparent: 'transparent',
  disabled: 'lightgrey',
  black: 'black',
};

const textColors = {
  red: 'white',
  green: 'white',
  blue: 'white',
  white: 'black',
  transparent: 'black',
  disabled: 'white',
  black: 'white',
};

const textSizes = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
};

const sizeMapping = {
  sm: 'small',
  md: 'medium',
  lg: 'large',
};

const paddingSizes = {
  sm: {
    paddingX: 15,
    paddingY: 10,
  },
  md: {
    paddingX: 20,
    paddingY: 15,
  },
  lg: {
    paddingX: 25,
    paddingY: 20,
  },
};

class Button extends Component {
  static defaultProps = {
    children: 'Button Text',
    color: 'black',
    size: 'lg',
    accessible: true,
    withFeedback: true,
  }

  static propTypes = {
    children: string,
    disabled: bool,
    onPress: func,
    color: string,
    textColor: string,
    icon: string,
    size: oneOf(
      ['sm', 'md', 'lg']
    ),
    padding: number,
    paddingX: number,
    paddingY: number,
    accessibilityLabel: string,
    accessibilityRole: string,
    accessible: bool,
    width: oneOfType(
      [number, string]
    ),
    height: oneOfType(
      [number, string]
    ),
    showSpinnerOnClick: bool,
    withFeedback: bool,
  }

  state = {
    hasBeenClickedOn: false,
  }

  componentDidMount() {
    // console.warn( 'mounted button', this.props, this.state );
  }

  componentDidUpdate() {
    // console.warn( 'updated button', this.props, this.state );
  }

  handlePress = event => {
    // if (
      // this.props.showSpinnerOnClick &&
      // this.state.hasBeenClickedOn
    // )
      // return false;

    this.setState({ hasBeenClickedOn: true });

    if ( this.props.onPress )
      this.props.onPress( event );
  }

  renderIconChild() {
    const { textColor, color, icon, size } = this.props;

    return (
      <Icon
        color={textColor || textColors[color]}
        name={icon}
        size={size}
      />
    );
  }

  renderTextChild() {
    const { textColor, color, children, size } = this.props;

    return (
      <Text
        color={textColor || textColors[color]}
        decoration="none"
        size={textSizes[size]}
        align="center"
        width="100%"
      >
        {children}
      </Text>
    );
  }

  renderSpinnerChild() {
    const { size, disabled, color } = this.props;

    return (
      <Box
        position="absolute"
        width="100%"
        height="100%"
        top={0}
        left={0}
        backgroundColor={(
          disabled
            ? buttonColors.disabled
            : buttonColors[color]
        )}
        opacity={0.8}
        flex={1}
        justifyContent="center"
        alignItems="center"
      >
        <ActivityIndicator
          size={sizeMapping[size]}
        />
      </Box>
    );
  }

  renderChildWrapper() {
    const {
      disabled,
      color,
      padding,
      paddingX,
      paddingY,
      size,
      icon,
      children,
      showSpinnerOnClick,
    } = this.props;

    const { hasBeenClickedOn } = this.state;

    const child =
      icon != null ? this.renderIconChild()
      : typeof children === 'string' ? this.renderTextChild()
      : children || null;

    return (
      <Box
        backgroundColor={(
          disabled
            ? buttonColors.disabled
            : buttonColors[color]
        )}
        padding={padding}
        paddingX={paddingX == null ? paddingSizes[size].paddingX : paddingX}
        paddingY={paddingY == null ? paddingSizes[size].paddingY : paddingY}
        width="100%"
        cleanStyleObject
        position="relative"
      >
        {child}

        {(
          showSpinnerOnClick &&
          hasBeenClickedOn
        )
          ? this.renderSpinnerChild()
          : null}
      </Box>
    );
  }

  render() {
    const {
      disabled,
      color,
      withFeedback,
      accessible,
      accessibilityLabel,
      accessibilityRole,
      width,
      height,
    } = this.props;

    const style = {
      height,
      width,
    };

    return createElement(
      Touchable,
      {
        style,
        disabled,
        onPress: this.handlePress,
        accessible,
        accessibilityLabel,
        accessibilityRole,
        background: (
          Platform.OS === 'android'
            ? TouchableNativeFeedback.Ripple( textColors[color], false )
            : undefined
        ),
        withFeedback,
      },
      this.renderChildWrapper()
    );
  }
}

export default Button;
