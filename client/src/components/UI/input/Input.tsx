import React, {FC} from 'react';


import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {
 faEye, faEyeSlash

} from "@fortawesome/pro-regular-svg-icons";


import "./styles.scss"

interface Props{
  onChange: any,
  name: string,
  value: string | number,
  type?: string
  placeholder?: string
  label: string
  className?: string
  errorMessage?: string
}

const Input:FC<Props> = (props) => {
  
  const {
    onChange,
    name,
    value,
    type= "text",
    placeholder,
    label,
    className,
    errorMessage
  } = props
  
  const [isShowPass, setShowPass] = React.useState(false)
  
  
  return (
      <div className="input-group flex mb-3">
        <label className="font-medium min-w-100px block text-base font-400 text-gray-dark-4"
               htmlFor={name + "-input"}>{label}</label>
        <div className="input_box">
          { type === "password" ? (
            <div className="flex justify-between items-center">
              <input
                type={isShowPass ? "text" : type}
                onChange={onChange ? onChange : ()=>{}}
                value={value}
                name={name}
                id={name + "-input"}
                placeholder={placeholder}
                className={["input-item", className ? className : ""].join(" ")}
              />
              {value && <FontAwesomeIcon onClick={()=>setShowPass(!isShowPass)} icon={isShowPass ? faEyeSlash : faEye  } /> }
            </div>
          ) : (
            <input
              type={type}
              onChange={onChange ? onChange : ()=>{}}
              value={value}
              name={name}
              id={name + "-input"}
              placeholder={placeholder}
              className={["input-item", className ? className : ""].join(" ")}
            />
          ) }
          
          
          <div className="input-border"/>
          <span className={["input--error_message", errorMessage ? "open__error_message": "close__error_message"].join(" ")}>{errorMessage}</span>
        </div>
    </div>
  );
};

export default Input;