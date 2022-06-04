import React, {FC} from 'react';
import {type} from "os";
import {symlink} from "fs";


type Props = {
  type?: any
  className: string,
  children: React.ReactNode
}

const Button: FC<Props> = ({className, type="button", children}) => {
  return <button type={type} className={"btn " + className}>{children}</button>
};

export default Button;