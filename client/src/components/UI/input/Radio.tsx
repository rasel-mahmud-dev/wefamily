import React, {FC} from 'react';

import "./styles.scss"

interface Props{
  onChange: any,
  name: string,
  value: string | number,
  placeholder?: string
  label: string
  className?: string
  errorMessage?: string
}

const Radio:FC<Props> = (props) => {
  
  const {
    onChange,
    name,
    value,
    placeholder,
    label,
    className,
    errorMessage
  } = props
  
  return (
    <div className={["input-group type-radio mb-3", className ? className : ""].join(" ")}>
  
      <input
        type="radio"
        onChange={onChange ? ()=>onChange({target: {name, value: label}}) : ()=>{}}
        value={value}
        name={name}
        id={label + "-input"}
        placeholder={placeholder}
        className={["input-item"].join(" ")}
      />
  
      { value === label
      ?  (
          <svg  onClick={onChange ? ()=>onChange({target: {name, value: label}}) : ()=>{}} width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="10" fill="#D6D6D6"/>
            <path d="M16 10C16 13.3137 13.3137 16 10 16C6.68629 16 4 13.3137 4 10C4 6.68629 6.68629 4 10 4C13.3137 4 16 6.68629 16 10Z" fill="#7722E2"/>
          </svg>
      ) : (
       <svg  onClick={onChange ? ()=>onChange({target: {name, value: label}}) : ()=>{}} width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="10" fill="#D6D6D6"/>
          <path d="M16 10C16 13.3137 13.3137 16 10 16C6.68629 16 4 13.3137 4 10C4 6.68629 6.68629 4 10 4C13.3137 4 16 6.68629 16 10Z" fill="white"/>
        </svg>
      )
      }
  
      <label className="font-normal min-w-100px block text-base font-400 text-gray-dark-4"
             htmlFor={label + "-input"}>{label}</label>
        <span className={["input--error_message", errorMessage ? "open__error_message": "close__error_message"].join(" ")}>{errorMessage}</span>
      </div>
    
  );
};

export default Radio;