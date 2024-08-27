import React, { useState } from 'react';

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
        {showPassword ? "👁️" : "👁️‍🗨️"}
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
          background-color: #333;
          color: #fff;
          border: 1px solid #ff4136;
          border-radius: 5px;
          box-sizing: border-box;
        }
        
        .toggle-password {
          position: absolute;
          right: 5px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #fff;
          font-size: 20px;
          padding: 5px;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .toggle-password:hover,
        .toggle-password:focus {
          color: #ff4136;
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default PasswordInput;