import React, { cloneElement } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { withNavigation } from 'react-navigation';
import { any, bool, func, string, object } from 'prop-types';

const Link = ({
  children = 'Link',
  to,
  disabled,
  onClick,
  navigation,
  ...restProps
}) => {
  const handlePress = event => {
    navigation.navigate( to );

    if ( onClick )
      onClick( event );
  };

  return (
    <TouchableWithoutFeedback
      {...restProps}
      onPress={handlePress}
      disabled={disabled}
    >
      {cloneElement( children, {
        onPress: handlePress,
      })}
    </TouchableWithoutFeedback>
  );
};

Link.propTypes = {
  children: any,
  to: string.isRequired,
  disabled: bool,
  onClick: func,
  navigation: object,
};

export default withNavigation( Link );
