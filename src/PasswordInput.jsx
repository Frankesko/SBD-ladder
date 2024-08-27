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
          padding: 10px;
          padding-right: 40px;
          font-size: 16px;
          background-color: #ff4136;
          color: white;
          border: none;
          border-radius: 5px;
        }
        .password-input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }
        .toggle-password {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: white;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .toggle-password:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default PasswordInput;