import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const AuthForm = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    captcha: ''
  });
  const [errors, setErrors] = useState({});
  const [captchaCode, setCaptchaCode] = useState('7X9K2');
  const navigate = useNavigate();

  // Mock credentials for different user roles
  const mockCredentials = {
    mentor: { email: 'mentor@edurisk.edu', password: 'mentor123' },
    admin: { email: 'admin@edurisk.edu', password: 'admin123' },
    ministry: { email: 'ministry@edurisk.edu', password: 'ministry123' }, 

  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (activeTab === 'register') {
      if (!formData?.fullName?.trim()) {
        newErrors.fullName = 'Full name is required';
      }
      if (!formData?.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData?.password !== formData?.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData?.captcha) {
        newErrors.captcha = 'CAPTCHA is required';
      } else if (formData?.captcha !== captchaCode) {
        newErrors.captcha = 'CAPTCHA code is incorrect';
      }
    }

    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (activeTab === 'login') {
        // Check mock credentials
        const userRole = Object.keys(mockCredentials)?.find(role => 
          mockCredentials?.[role]?.email === formData?.email && 
          mockCredentials?.[role]?.password === formData?.password
        );

        if (userRole) {
          // Navigate to appropriate dashboard based on role
          navigate(`/${userRole}-dashboard`);
        } else {
          setErrors({ 
            email: 'Invalid credentials. Use: mentor@edurisk.edu/mentor123, admin@edurisk.edu/admin123, or ministry@edurisk.edu/ministry123' 
          });
        }
      } else {
        // Registration success - simulate email verification
        alert('Registration successful! Please check your email for verification link.');
        setActiveTab('login');
        setFormData({
          fullName: '',
          email: formData?.email,
          password: '',
          confirmPassword: '',
          captcha: ''
        });
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars?.charAt(Math.floor(Math.random() * chars?.length));
    }
    setCaptchaCode(result);
    setFormData(prev => ({ ...prev, captcha: '' }));
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Tab Toggle */}
      <div className="flex bg-muted rounded-lg p-1 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('login')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === 'login' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('register')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === 'register' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
          }`}
        >
          Register
        </button>
      </div>
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name - Register only */}
        {activeTab === 'register' && (
          <Input
            label="Full Name"
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={formData?.fullName}
            onChange={handleInputChange}
            error={errors?.fullName}
            required
          />
        )}

        {/* Email */}
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your email address"
          value={formData?.email}
          onChange={handleInputChange}
          error={errors?.email}
          required
        />

        {/* Password */}
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData?.password}
          onChange={handleInputChange}
          error={errors?.password}
          required
        />

        {/* Confirm Password - Register only */}
        {activeTab === 'register' && (
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData?.confirmPassword}
            onChange={handleInputChange}
            error={errors?.confirmPassword}
            required
          />
        )}

        {/* CAPTCHA - Register only */}
        {activeTab === 'register' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              CAPTCHA Verification
            </label>
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-muted border border-border rounded-md px-3 py-2">
                <span className="font-mono text-lg font-semibold text-foreground tracking-wider">
                  {captchaCode}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={refreshCaptcha}
                  className="ml-2 h-6 w-6"
                >
                  <Icon name="RotateCcw" size={14} />
                </Button>
              </div>
              <Input
                type="text"
                name="captcha"
                placeholder="Enter CAPTCHA"
                value={formData?.captcha}
                onChange={handleInputChange}
                error={errors?.captcha}
                className="flex-1"
              />
            </div>
          </div>
        )}

        {/* General Error */}
        {errors?.general && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-md">
            <p className="text-sm text-error">{errors?.general}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          loading={isLoading}
          fullWidth
          className="mt-6"
        >
          {activeTab === 'login' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>
      {/* Additional Info */}
      {activeTab === 'login' && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          
        </div>
      )}
    </div>
  );
};

export default AuthForm;