import React, {FC} from 'react';
import {type} from "os";
import {symlink} from "fs";


type Props = {
  type: any
  className: string,
}

const Button: FC<React.ButtonHTMLAttributes<Props>> = ({className, type="button", children, ...attr}) => {
  return <button  type={type} className={"btn " + className} {...attr} >{children}</button>
};

export default Button;