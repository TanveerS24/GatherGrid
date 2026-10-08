/**
 * PasswordInput — Input with show/hide toggle.
 *
 * Usage:
 *   <PasswordInput placeholder="Password" />
 */
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input, type InputProps } from '../Input/Input';
import { IconButton } from '../IconButton/IconButton';
import styles from './PasswordInput.module.css';

export type PasswordInputProps = Omit<InputProps, 'type' | 'rightAddon'>;

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, ref) => {
    const [show, setShow] = useState(false);

    return (
      <Input
        ref={ref}
        {...props}
        type={show ? 'text' : 'password'}
        rightAddon={
          <IconButton
            label={show ? 'Hide password' : 'Show password'}
            size="sm"
            variant="ghost"
            className={styles.toggle}
            type="button"
            onClick={() => setShow((v) => !v)}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </IconButton>
        }
      />
    );
  },
);

PasswordInput.displayName = 'PasswordInput';
