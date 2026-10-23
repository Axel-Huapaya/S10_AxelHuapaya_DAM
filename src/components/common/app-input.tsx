import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';

import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';

type AppInputProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  icon?: string;
  helperText?: string;
  isValid?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  maxLength?: number;
} & Omit<TextInputProps, 'onChangeText' | 'value'>;

export const AppInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  icon,
  helperText,
  isValid,
  hasError,
  errorMessage,
  maxLength,
  ...rest
}: AppInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (hasError) return colors.error;
    if (isFocused) return colors.borderFocus;
    if (isValid && value.length > 0) return colors.success;
    return colors.border;
  };

  const getBackgroundColor = () => {
    if (hasError) return colors.errorBg;
    if (isFocused) return '#FFFFFF';
    return '#F8FAFC';
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {isValid && value.length > 0 && (
          <Text style={styles.validBadge}>✓ Válido</Text>
        )}
      </View>

      <View
        style={[
          styles.inputContainer,
          {
            borderColor: getBorderColor(),
            backgroundColor: getBackgroundColor(),
          },
          isFocused && styles.inputFocused,
        ]}
      >
        {icon && <Text style={styles.iconText}>{icon}</Text>}

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={maxLength}
          selectionColor={colors.primary}
          {...rest}
        />
      </View>

      {hasError && errorMessage ? (
        <Text style={styles.errorText}>⚠ {errorMessage}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.medium,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: theme.fontSize.body,
    fontWeight: '700',
    color: colors.text,
  },
  validBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.success,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: theme.radius.medium,
    paddingHorizontal: 14,
    minHeight: 52, // Standard mobile touch target (> 48px)
  },
  inputFocused: {
    ...theme.shadows.subtle,
  },
  iconText: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 12,
  },
  helperText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
    marginLeft: 2,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    fontWeight: '600',
    marginTop: 4,
    marginLeft: 2,
  },
});