import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  help?: string;
}

export function Input({
  label,
  error,
  help,
  className = '',
  id,
  ...props
}: InputProps): JSX.Element {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-gray-700">
          {label}
          {props.required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`px-4 py-3 border rounded-lg text-base transition-colors focus:outline-none min-h-[2.75rem] ${
          error
            ? 'border-danger-500 focus:border-danger-500 focus:ring-2 focus:ring-danger-200'
            : 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-danger-500">{error}</p>}
      {help && !error && <p className="text-sm text-gray-500">{help}</p>}
    </div>
  );
}
