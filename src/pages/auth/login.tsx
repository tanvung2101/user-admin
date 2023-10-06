import React, { useState } from 'react'
import Container from '../../components/Container'
import { Switch, Button, Input } from 'antd'
import LogoIcon from '@/resources/images/logo/logo_icon.png'
import LogoText from '@/resources/images/logo/logo_text.svg'
import Page from '../../components/Page'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import LogoFull from '@/resources/images/logo/logosheshi.png'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import yup from '../../utils/yup'
import i18next from '../../locales/i18n'
import { yupResolver } from '@hookform/resolvers/yup'
import accountApis from '../../apis/accountApis'
import axiosClient from '../../apis/axiosClient'
import { useNavigate } from 'react-router-dom'
import { AuthResponse } from '../../interface'
import { useDispatch } from 'react-redux'
import { setToken } from '../../store/slices/accountSlice'
import { AppDispatch } from 'src/store'
import { storage } from '../../utils/storage'
import { STORAGE_KEY } from '../../constants/storage-key'

interface FormValues {
  email: string
  password: string
}

const schema = yup
  .object()
  .shape({
    email: yup
      .string()
      .email()
      .max(255)
      .required()
      .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, i18next.t('validations:email'))
      .trim(),
    password: yup.string().min(6).max(6).required().trim()
  })
  .required()

const Login = () => {
  const [loading, setLoading] = useState<boolean>()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<FormValues>({ resolver: yupResolver(schema) })

  // const onSubmit = handleSubmit((data) => console.log(data))
  const onSubmit: SubmitHandler<FormValues> = (values: FormValues) => {
    setLoading(true)
    accountApis
      .login({
        email: values.email,
        password: values.password
      })
      .then(function ({ user, token }: AuthResponse) {
        console.log(user)
        axiosClient.defaults.headers.common = {
          Authorization: `Bearer ${token}`
        }

        storage.setToken(STORAGE_KEY.TOKEN, token)
        storage.setUser(STORAGE_KEY.INFO, JSON.stringify(user))
        dispatch(setToken({ token: token }))
        navigate('/')
      })
      .catch((err) => {
        // errorHelper(err);
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }
  return (
    <Container title='Đăng nhập' className='login-container'>
      <header className='login-header'>
        <div className='login-header__left'>
          <div className='logo'>
            <div className='logo__icon'>
              <img src={LogoIcon} alt='logo icon' />
            </div>
            <div className='logo__text logo__text--light'>
              <img src={LogoText} alt='logo text' />
            </div>
          </div>
        </div>
        <div className='login-header__right'>
          <ul className='nav'>
            <li>
              <Switch
                checkedChildren={i18next.t('light')}
                unCheckedChildren={'dark'}
                // checked={theme === MODE_THEME.LIGHT}
                // onChange={onChangeTheme}
              />
            </li>
          </ul>
        </div>
      </header>
      <Page className='login-page'>
        <div className='login-page__col-left'>
          <div className='login-page__col-left__content'>
            <img className='login-page__logofull' src={LogoFull} alt='logo icon' />
            <h2 className="text-24">{i18next.t("slogan_text_1")}</h2>
            <p className="text-16">{i18next.t("slogan_text_2")}</p>
          </div>
        </div>

        <div className='login-page__col-right justify-center py-50 '>
          <form onSubmit={handleSubmit(onSubmit)} className='form-submit'>
            <div className='heading mb-5'>
              <h2 className='text-24'>
                {' '}
                <UserOutlined /> <strong>{i18next.t('login_now')}</strong>
              </h2>
              <p className='text-15'>{i18next.t('enter_your_credentials_to_login')}</p>
            </div>

            <div className='field mb-3'>
              <h4>Email</h4>
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    prefix={<UserOutlined />}
                    placeholder={i18next.t("email")}
                    // status={errors?.email?.message ? 'error' : null}
                  />
                )}
              />
              {errors?.email?.message && <p className='text-error'>{errors?.email?.message}</p>}
            </div>
            <div className='field mb-3'>
              <h4>Password</h4>
              <Controller
                name='password'
                control={control}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    prefix={<LockOutlined />}
                    placeholder={i18next.t('password')}
                    // status={errors?.password?.message ? 'error' : null}
                  />
                )}
              />
              {errors?.password?.message && <p className='text-error'>{errors?.password?.message}</p>}
            </div>

            <div className='d-block justify-content-center mt-5'>
              <Button
                // loading={loading}
                htmlType='submit'
                type='primary'
                shape='round'
                className='btn btn-primary btn-submit'
              >
                {'login'}
              </Button>
            </div>
          </form>
        </div>
      </Page>
    </Container>
  )
}

export default Login
