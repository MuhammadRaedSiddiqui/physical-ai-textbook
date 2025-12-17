/**
 * Sign Up Form Component.
 * Collects user registration data including custom background fields.
 */

import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import type { SignupData } from './types';
import styles from './AuthForms.module.css';

interface SignUpFormProps {
  onSuccess?: () => void;
  onSwitchToSignIn?: () => void;
}

export function SignUpForm({ onSuccess, onSwitchToSignIn }: SignUpFormProps) {
  const { signup, isLoading } = useAuth();

  const [formData, setFormData] = useState<SignupData>({
    email: '',
    password: '',
    name: '',
    software_background: '',
    hardware_background: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1); // Two-step form

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate step 1
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Move to step 2
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await signup(formData);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    }
  };

  const handleBack = () => {
    setStep(1);
    setError(null);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h2 className={styles.authTitle}>
            {step === 1 ? 'CREATE_ACCOUNT' : 'YOUR_BACKGROUND'}
          </h2>
          <p className={styles.authSubtitle}>
            {step === 1
              ? 'Initialize your learning profile'
              : 'Help us personalize your experience'}
          </p>
          {/* Step indicator */}
          <div className={styles.stepIndicator}>
            <span className={step === 1 ? styles.stepActive : styles.stepComplete}>1</span>
            <span className={styles.stepLine} />
            <span className={step === 2 ? styles.stepActive : styles.stepInactive}>2</span>
          </div>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <span className={styles.errorIcon}>!</span>
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleStep1Submit} className={styles.authForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.inputLabel}>
                DISPLAY_NAME
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                placeholder="Enter your name"
                className={styles.input}
                autoComplete="name"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.inputLabel}>
                EMAIL_ADDRESS <span className={styles.required}>*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={styles.input}
                required
                autoComplete="email"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.inputLabel}>
                PASSWORD <span className={styles.required}>*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                className={styles.input}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.inputLabel}>
                CONFIRM_PASSWORD <span className={styles.required}>*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className={styles.input}
                required
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              CONTINUE
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="software_background" className={styles.inputLabel}>
                SOFTWARE_BACKGROUND
              </label>
              <textarea
                id="software_background"
                name="software_background"
                value={formData.software_background || ''}
                onChange={handleChange}
                placeholder="e.g., Python intermediate, ROS 2 beginner, familiar with TensorFlow, some C++ experience..."
                className={styles.textarea}
                rows={3}
              />
              <span className={styles.inputHint}>
                What programming languages and tools are you familiar with?
              </span>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="hardware_background" className={styles.inputLabel}>
                HARDWARE_BACKGROUND
              </label>
              <textarea
                id="hardware_background"
                name="hardware_background"
                value={formData.hardware_background || ''}
                onChange={handleChange}
                placeholder="e.g., Jetson Nano projects, Arduino basics, built a 3DOF robot arm, Raspberry Pi experience..."
                className={styles.textarea}
                rows={3}
              />
              <span className={styles.inputHint}>
                What robotics hardware have you worked with?
              </span>
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="button"
                onClick={handleBack}
                className={styles.secondaryButton}
              >
                BACK
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className={styles.spinner} />
                    INITIALIZING...
                  </>
                ) : (
                  'CREATE_ACCOUNT'
                )}
              </button>
            </div>
          </form>
        )}

        <div className={styles.authFooter}>
          <span>Already have an account?</span>
          <button
            type="button"
            onClick={onSwitchToSignIn}
            className={styles.linkButton}
          >
            SIGN_IN
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUpForm;
