// import classNames from 'classnames'
import React from 'react'
import { Helmet } from 'react-helmet'

interface PropContainer {
    title: string;
    children: React.ReactNode;
    className?: string;
}

const Container = ({ title = 'Administration Control Panel', children, className='' }: PropContainer ) => (
  <div className={`${className} container-component`}>
    {/* <Helmet>
      <title>{title}</title>
    </Helmet> */}
    {children}
  </div>
)

export default Container
