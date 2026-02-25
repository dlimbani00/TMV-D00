import React, { useState } from 'react';
import { Button } from '../components/Button/Button';
import { Input } from '../components/Input/Input';
import '../styles/registration.css';

const navItems = ['Store', 'Mac', 'iPad', 'iPhone', 'Watch', 'AirPods', 'TV & Home', 'Entertainment', 'Accessories', 'Support'];

function Registration() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    country: 'United States',
    birthday: { month: '', day: '', year: '' }
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });

  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
    phoneNumber: false
  });

  const validateRequired = (value: string, fieldName: string): string => {
    if (!value || value.trim() === '') {
      const errorMessages: { [key: string]: string } = {
        firstName: 'Enter your first name.',
        lastName: 'Enter your last name.',
        email: 'Enter a valid email address.',
        password: 'Enter a password.',
        confirmPassword: 'Enter your password again.',
        phoneNumber: 'Enter your phone number.'
      };
      return errorMessages[fieldName] || 'This field is required.';
    }
    return '';
  };

  const validatePassword = (password: string): string => {
    if (!password || password.trim() === '') {
      return 'Enter a password.';
    }
    if (password.length < 8) {
      return 'Must be at least 8 characters and include a number, an uppercase letter, and a lowercase letter.';
    }
    if (!/[0-9]/.test(password)) {
      return 'Must be at least 8 characters and include a number, an uppercase letter, and a lowercase letter.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Must be at least 8 characters and include a number, an uppercase letter, and a lowercase letter.';
    }
    if (!/[a-z]/.test(password)) {
      return 'Must be at least 8 characters and include a number, an uppercase letter, and a lowercase letter.';
    }
    return '';
  };

  const validateEmail = (email: string): string => {
    if (!email || email.trim() === '') {
      return 'Enter a valid email address.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Enter a valid email address to use as your primary email address.';
    }
    return '';
  };

  const validateConfirmPassword = (confirmPassword: string, password: string): string => {
    if (!confirmPassword || confirmPassword.trim() === '') {
      return 'Enter your password again.';
    }
    if (confirmPassword !== password) {
      return 'Passwords do not match.';
    }
    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate on change if field was touched
    if (touched[name as keyof typeof touched]) {
      let error = '';
      if (name === 'firstName' || name === 'lastName') {
        error = validateRequired(value, name);
      } else if (name === 'password') {
        error = validatePassword(value);
      } else if (name === 'email') {
        error = validateEmail(value);
      } else if (name === 'confirmPassword') {
        error = validateConfirmPassword(value, formData.password);
      } else if (name === 'phoneNumber') {
        error = validateRequired(value, name);
      }
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));

    // Validate on blur
    let error = '';
    const fieldValue = formData[fieldName as keyof typeof formData] as string;
    
    if (fieldName === 'firstName' || fieldName === 'lastName') {
      error = validateRequired(fieldValue, fieldName);
    } else if (fieldName === 'password') {
      error = validatePassword(formData.password);
    } else if (fieldName === 'email') {
      error = validateEmail(formData.email);
    } else if (fieldName === 'confirmPassword') {
      error = validateConfirmPassword(formData.confirmPassword, formData.password);
    } else if (fieldName === 'phoneNumber') {
      error = validateRequired(formData.phoneNumber, fieldName);
    }
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const handleBirthdayChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      birthday: { ...prev.birthday, [field]: value }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="registration-page">
      {/* Apple Navigation Bar */}
      <nav className="apple-nav">
        <div className="nav-content">
          <a href="/" className="nav-logo">
            <svg height="44" viewBox="0 0 14 44" width="14" xmlns="http://www.w3.org/2000/svg">
              <path d="m13.0729 17.6825a3.61 3.61 0 0 0 -1.7248 3.0365 3.5132 3.5132 0 0 0 2.1379 3.2223 8.394 8.394 0 0 1 -1.0948 2.2618c-.6816.9812-1.3943 1.9623-2.4787 1.9623s-1.3633-.63-2.613-.63c-1.2187 0-1.6525.6507-2.644.6507s-1.6834-.9089-2.4787-2.0243a9.7842 9.7842 0 0 1 -1.6628-5.2776c0-3.0984 2.014-4.7405 3.9969-4.7405 1.0535 0 1.9314.6817 2.5924.6817.63 0 1.6112-.7127 2.8092-.7127a3.7579 3.7579 0 0 1 3.1604 1.5802zm-3.7284-2.8918a3.5615 3.5615 0 0 0 .8469-2.22 1.5353 1.5353 0 0 0 -.031-.32 3.5686 3.5686 0 0 0 -2.3445 1.2084 3.4629 3.4629 0 0 0 -.8779 2.1585 1.419 1.419 0 0 0 .031.2892 1.19 1.19 0 0 0 .2169.0207 3.0935 3.0935 0 0 0 2.1586-1.1368z" fill="#fff"/>
            </svg>
          </a>
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item}>
                {item === 'Support' ? (
                  <a href="/registration" className="nav-link">{item}</a>
                ) : item === 'Accessories' ? (
                  <a href="/" className="nav-link">{item}</a>
                ) : (
                  <a href="#" className="nav-link">{item}</a>
                )}
              </li>
            ))}
          </ul>
          <div className="nav-actions">
            <button className="nav-icon-btn">
              <svg height="44" viewBox="0 0 15 44" width="15" xmlns="http://www.w3.org/2000/svg">
                <path d="m14.298 27.202-3.87-3.87c-.701.573-1.57.97-2.507 1.124v-2.136c.827-.18 1.581-.585 2.161-1.165.58-.58.985-1.334 1.165-2.161h2.136c-.154.937-.551 1.806-1.124 2.507l3.87 3.87zm-6.377-5.061v-2.136h-2.136v2.136zm-3.12 0h2.136v-2.136h-2.136z" fill="#fff"/>
              </svg>
            </button>
            <button className="nav-icon-btn">
              <svg height="44" viewBox="0 0 14 44" width="14" xmlns="http://www.w3.org/2000/svg">
                <path d="m11.3535 16.0283h-1.0205a3.4229 3.4229 0 0 0 -3.333-2.9648 3.4229 3.4229 0 0 0 -3.333 2.9648h-1.0205a.6.6 0 0 0 -.6.6v7.37a.6.6 0 0 0 .6.6h8.707a.6.6 0 0 0 .6-.6v-7.37a.6.6 0 0 0 -.6-.6zm-4.3535-1.8652a2.3169 2.3169 0 0 1 2.2349 1.8652h-4.4698a2.3169 2.3169 0 0 1 2.2349-1.8652zm5.37 11.6369h-10.74v-8.37h10.74z" fill="#fff"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="registration-main">
        <div className="registration-container">
          <h1 className="registration-title">Create Your Apple Account</h1>
          <p className="registration-subtitle">
            One Apple Account is all you need to access all Apple services.
          </p>

          <form className="registration-form" onSubmit={handleSubmit}>
            {/* Name Section */}
            <div className="form-section">
              <div className="form-row">
                <Input
                  label="First Name"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('firstName')}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  required
                />
                <Input
                  label="Last Name"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('lastName')}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  required
                />
              </div>
            </div>

            {/* Country/Region */}
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="country" className="form-label">Country/Region</label>
                <select
                  id="country"
                  name="country"
                  className="form-select"
                  value={formData.country}
                  onChange={handleInputChange}
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                  <option>India</option>
                  <option>Japan</option>
                </select>
              </div>
            </div>

            {/* Birthday */}
            <div className="form-section">
              <label className="form-label-outside">Birthday</label>
              <div className="form-row birthday-row">
                <select
                  name="month"
                  className="form-select"
                  value={formData.birthday.month}
                  onChange={(e) => handleBirthdayChange('month', e.target.value)}
                  required
                >
                  <option value="">Month</option>
                  <option value="01">January</option>
                  <option value="02">February</option>
                  <option value="03">March</option>
                  <option value="04">April</option>
                  <option value="05">May</option>
                  <option value="06">June</option>
                  <option value="07">July</option>
                  <option value="08">August</option>
                  <option value="09">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
                <select
                  name="day"
                  className="form-select"
                  value={formData.birthday.day}
                  onChange={(e) => handleBirthdayChange('day', e.target.value)}
                  required
                >
                  <option value="">Day</option>
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <select
                  name="year"
                  className="form-select"
                  value={formData.birthday.year}
                  onChange={(e) => handleBirthdayChange('year', e.target.value)}
                  required
                >
                  <option value="">Year</option>
                  {Array.from({ length: 100 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Email */}
            <div className="form-section">
              <Input
                label="Email"
                type="email"
                id="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={() => handleBlur('email')}
                error={!!errors.email}
                helperText={errors.email}
                fullWidth={true}
                required
              />
            </div>

            {/* Password */}
            <div className="form-section">
              <Input
                label="Password"
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={() => handleBlur('password')}
                error={!!errors.password}
                helperText={errors.password}
                fullWidth={true}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="form-section">
              <Input
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={() => handleBlur('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                fullWidth={true}
                required
              />
            </div>

            {/* Phone Number */}
            <div className="form-section">
              <Input
                label="Phone Number"
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="+1 (555) 555-5555"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                onBlur={() => handleBlur('phoneNumber')}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
                fullWidth={true}
                required
              />
            </div>

            {/* Terms and Conditions */}
            <div className="form-section">
              <div className="terms-section">
                <p className="terms-text">
                  By creating an account, you agree to Apple's{' '}
                  <a href="#" className="terms-link">Customer Agreement</a> and{' '}
                  <a href="#" className="terms-link">Privacy Policy</a>.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <Button 
                variant="primary" 
                size="lg" 
                fullWidth
                type="submit"
              >
                Continue
              </Button>
            </div>

            {/* Sign In Link */}
            <div className="signin-section">
              <p className="signin-text">
                Already have an Apple Account?{' '}
                <a href="#" className="signin-link">Sign in</a>
              </p>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="registration-footer">
        <div className="footer-container">
          <div className="footer-links">
            <a href="#" className="footer-link">Privacy Policy</a>
            <span className="footer-separator">|</span>
            <a href="#" className="footer-link">Terms of Use</a>
            <span className="footer-separator">|</span>
            <a href="#" className="footer-link">Sales and Refunds</a>
            <span className="footer-separator">|</span>
            <a href="#" className="footer-link">Site Map</a>
          </div>
          <p className="footer-copyright">Copyright © 2026 Apple Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Registration;
