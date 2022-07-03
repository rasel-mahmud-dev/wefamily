import React, {CSSProperties, FC} from 'react'
import ReactDOM from 'react-dom'

import './Backdrop.scss'

type BackdropPROPS = {
  isOpenBackdrop?: boolean
  bg?:any
  style?: CSSProperties,
  onCloseBackdrop?: ()=>void
  transparent?: boolean
  children?: React.ReactElement
  as?: "app" | "content" | "global"
}

const Backdrop:FC<BackdropPROPS> = (props)=> {
  const { isOpenBackdrop,
    bg,
    style,
    onCloseBackdrop,
    transparent,
    children,
    as
  } = props

  const handleBackdrop=(e: React.MouseEvent)=>{
    if((e.target as HTMLDivElement).classList.contains("backdrop")){
      if(onCloseBackdrop)
        onCloseBackdrop()
    }
  }

  let styles = {...style}
  if(bg){
    styles.background = bg
  }

  return ReactDOM.createPortal(
    <div style={styles} onClick={handleBackdrop} className={['backdrop', as, isOpenBackdrop ? 'open' : 'close', transparent ? 'bg-transparent' : '' ].join(' ')}>
      {children}
    </div>,
    document.querySelector(as === "app" ? '#root' : as === 'content' ? '#appContent' : '#backdrop-root') as HTMLDivElement
  )
}

export default Backdrop