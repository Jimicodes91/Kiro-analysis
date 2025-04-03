import React from 'react';

interface SwitchProps {
  isOn: boolean;
  onChange?: (newValue: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const Switch: React.FC<SwitchProps> = ({
  isOn,
  onChange,
  size = 'md',
  disabled = false,
}) => {
  // Size configurations
  const sizeClasses = {
    sm: {
      switch: 'w-8 h-4',
      circle: 'w-3 h-3',
      translate: 'translate-x-4',
    },
    md: {
      switch: 'w-11 h-6',
      circle: 'w-5 h-5',
      translate: 'translate-x-5',
    },
    lg: {
      switch: 'w-14 h-7',
      circle: 'w-6 h-6',
      translate: 'translate-x-7',
    },
  };

  const handleToggle = () => {
    if (disabled) return;
    onChange?.(!isOn);
  };

  const toggleClasses = `
    ${sizeClasses[size].switch}
    ${isOn ? 'bg-primary' : 'bg-[#09232733]'} 
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    relative inline-flex items-center justify-start rounded-full transition-colors ease-in-out duration-200
  `;

  const circleClasses = `
    ${sizeClasses[size].circle}
    ${isOn ? sizeClasses[size].translate : 'translate-x-0.5'}
    bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out
    absolute
  `;

  return (
    <div
      onClick={handleToggle}
      className={toggleClasses}
      role="switch"
      aria-checked={isOn}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleToggle();
        }
      }}
    >
      <span 
        className="sr-only"
        aria-hidden="true"
      >
        {isOn ? 'On' : 'Off'}
      </span>
      <span 
        aria-hidden="true" 
        className={circleClasses}
      />
    </div>
  );
};

export default Switch;