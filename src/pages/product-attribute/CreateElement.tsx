import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import i18next from '../../locales/i18n'
import { Button, Input, Select } from 'antd'
import { useState } from 'react'
import yup from '../../utils/yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { MASTER_DATA, MASTER_DATA_NAME } from '../../constants/index'
import configDataApis from '../../apis/configDataApis'
import { toast } from 'react-toastify'

type FormValues = {
  name: string
  nameMaster: string
  note?: string
}

const schema = yup.object({
  name: yup.string().required().trim().max(255),
  nameMaster: yup.string().max(255).required(),
  note: yup.string().trim().max(255)
})

const CreateElement = () => {
  const [loading, setLoading] = useState(false)
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm<FormValues>({
    resolver: yupResolver(schema)
  })
  const handleChange = (value: string) => {
    setValue('nameMaster', value, {
        shouldValidate:true,
        shouldDirty:true,
    })
  }
  const onSubmit:SubmitHandler<FormValues> = (values) => {
    const {name, nameMaster:idMaster, note} = values
    const nameMaster = MASTER_DATA.find((e) => e.value === +idMaster)?.nameMaster
    if(!nameMaster) return;
    const payload = {
        name,
        nameMaster,
        note,
    }
    setLoading(true)
    return configDataApis
      .createConfigData(payload)
      .then(() => {
        toast.success(i18next.t('create_success'))
        reset()
        // fetchList()
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
            name='nameMaster'
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                style={{ width: '100%' }}
                onChange={handleChange}
                placeholder={i18next.t("select_a_config_data")}
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                options={MASTER_DATA.filter(
                  (e) => e.value === MASTER_DATA_NAME.UNIT_PRODUCT || e.value === MASTER_DATA_NAME.CAPACITY_PRODUCT
                ).map((e) => ({
                  value: e.value,
                  label: e.nameMaster
                }))}
              />
            )}
          />
          {errors?.nameMaster?.message && <p className='text-error'>{errors?.nameMaster?.message}</p>}
        </div>
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

export default CreateElement
