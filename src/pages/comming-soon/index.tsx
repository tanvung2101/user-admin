import React from 'react'
import i18next from '../../locales/i18n'
import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

const CommingSoon = () => {
  const navigate = useNavigate()

  const homePage = () => {
    navigate('/')
  }
  return (
    <Result
      status='404'
      title={'COMMING SOON'}
      subTitle={'Chức năng sẽ phát triển sau'}
      extra={
        <Button className='bg-red-500' type='primary' onClick={homePage}>
          {i18next.t('go_homepage')}
        </Button>
      }
    />
  )
}

export default CommingSoon
