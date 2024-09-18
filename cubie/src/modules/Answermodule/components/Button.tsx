import React, { FC, PropsWithChildren } from 'react'

interface IProps {
  [key: string]: any
}
const Button: FC<PropsWithChildren<IProps>> = ({ children, ...rest }) => {
  return (
    <button
      className="bg-gradient-to-l from-b1 to-c1 px-4 py-2 text-center font-bold tracking-widest text-a1"
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button
