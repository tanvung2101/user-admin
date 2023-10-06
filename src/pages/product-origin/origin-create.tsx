import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import i18next from '../../locales/i18n'
import { Button, Input } from 'antd'
import yup from '../../utils/yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { MASTER_DATA, MASTER_DATA_NAME } from '../../constants/index'
import configDataApis from '../../apis/configDataApis'
import { toast } from 'react-toastify'

type FormValues = {
  name: string
  note?: string
}

const OriginCreate = ({fetchList}: {fetchList: () => void}) => {
  const [loading, setLoading] = useState(false)
  const schema = yup.object({
    name: yup.string().trim().required().max(255),
    note: yup.string().max(255)
  })
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormValues>({
    resolver: yupResolver(schema)
  })

  const onSubmit: SubmitHandler<FormValues> = (values: FormValues) => {
    const { name, note } = values
    const nameMaster = MASTER_DATA.find((e) => e.value === MASTER_DATA_NAME.ORIGIN)?.nameMaster
    if (!nameMaster) return

    const payload: { name: string; nameMaster: string; note?: string } = {
      name,
      nameMaster,
      note
    }

    setLoading(true)
    return configDataApis
      .createConfigData(payload)
      .then(() => {
        toast.success(i18next.t('create_success'))
        reset()
        fetchList()
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='field mb-3'>
          <label>{i18next.t('name')}</label>
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <Input {...field} status={errors?.note?.message ? 'error' : ''} placeholder={i18next.t('name')} />
            )}
          />
          {errors?.name?.message && <p className='text-error'>{errors?.name?.message}</p>}
        </div>
        <div className='field mb-3'>
          <label>{i18next.t('note')}</label>
          <Controller
            name='note'
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                status={errors?.note?.message ? 'error' : ''}
                placeholder={i18next.t('note')}
              />
            )}
          />
          {errors?.note?.message && <p className='text-error'>{errors?.note?.message}</p>}
        </div>

        <div className='flex items-center justify-center'>
          <Button className='bg-red-500' type='primary' htmlType='submit' loading={loading}>
            {i18next.t('create')}
          </Button>
        </div>
      </form>
    </>
  )
}

export default OriginCreate
