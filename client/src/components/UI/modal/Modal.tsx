import React, {FC} from "react"
import { createPortal } from "react-dom" 
import "./Modal.scss"
import {CSSTransition} from "react-transition-group"


type ModalProps = {
  style?: CSSStyleSheet,
  onClose?: any,
  className?: string,
  inProp: boolean,
  children: React.ReactElement
  bg?: any
}

const Modal:FC<ModalProps> = (props)=>{
  const { style, onClose, className, inProp, bg, ...attributes  } = props
  
  return createPortal(
    <CSSTransition unmountOnExit in={inProp} timeout={1000} classNames="my-modal">
      <div className={["modal", className?className:""  ].join(" ")} {...attributes}>
        {props.children}
        {/*{ onClose && <span className="modal-close_icon" onClick={onClose}*/}
        {/*  >*/}
        {/*  <i className="fa fa-times"/>*/}
        {/*  </span> }*/}
      </div>
    </CSSTransition>,
    document.getElementById("modal-root") as HTMLDivElement
  )
}


export default Modal
