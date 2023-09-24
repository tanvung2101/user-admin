import React from 'react'
// import classNames from 'classnames'

const Page = ({ className, children }: { className: string; children: React.ReactNode }) => (
  <div className={`${className} page-component`}>{children}</div>
)

export default Page
