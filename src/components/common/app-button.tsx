import React from 'react';
import {
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';

import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';

type AppButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export const AppButton = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}: AppButtonProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? colors.primary : '#FFFFFF'}
          size="small"
        />
      ) : (
        <>
          {icon && <Text style={styles.icon}>{icon}</Text>}
          <Text
            style={[
              styles.text,
              variant === 'outline' ? styles.textOutline : styles.textPrimary,
              disabled && styles.textDisabled,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: theme.radius.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  primary: {
    backgroundColor: colors.primary,
    ...theme.shadows.button,
  },
  secondary: {
    backgroundColor: colors.secondary,
    ...theme.shadows.subtle,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    backgroundColor: '#CBD5E1',
    borderColor: '#CBD5E1',
    shadowOpacity: 0,
    elevation: 0,
  },
  text: {
    fontSize: theme.fontSize.subheading,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  textPrimary: {
    color: '#FFFFFF',
  },
  textOutline: {
    color: colors.primary,
  },
  textDisabled: {
    color: '#94A3B8',
  },
  icon: {
    marginRight: 8,
    fontSize: 18,
  },
});