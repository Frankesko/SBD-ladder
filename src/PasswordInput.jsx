import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-input-container">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="password-input"
      />
      <button
        type="button"
        className="toggle-password"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? "Nascondi password" : "Mostra password"}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
      <style jsx>{`
        .password-input-container {
          position: relative;
          width: 100%;
          margin-bottom: 10px;
        }
        .password-input {
          width: 100%;
          padding: 12px;
          padding-right: 40px;
          font-size: 16px;
          background-color: white;
          color: #333;
          border: 1px solid #ccc;
          border-radius: 4px;
          transition: border-color 0.3s ease;
        }
        .password-input:focus {
          outline: none;
          border-color: #007bff;
        }
        .password-input::placeholder {
          color: #999;
        }
        .toggle-password {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #777;
          padding: 5px;
        }
        .toggle-password:focus {
          outline: none;
          color: #007bff;
        }
      `}</style>
    </div>
  );
};

export default PasswordInput;