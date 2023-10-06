import { Button, Input, Modal, Select } from 'antd'
import { Ref, forwardRef, useImperativeHandle, useState } from 'react'
import i18next from '../../../locales/i18n'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import yup from '../../../utils/yup'
import { IMasterLevel } from '../../../interface/configData.interface'
import configDataApis from '../../../apis/configDataApis'
import { MASTER_DATA } from '../../../constants/index'
import { toast } from 'react-toastify'

interface RefObject {
  onOpen: (record: IMasterLevel) => void
}

type FormValues = {
  name: string
  nameMaster: number
  note?: string
}

const schema = yup.object({
  name: yup.string().trim().required().max(255),
  nameMaster: yup.number().required(),
  note: yup.string().max(255).trim()
})

const ModalConfigDataUpdate = (
  { onAfterUpdate }: { onAfterUpdate: () => void },
  ref: React.Ref<RefObject>
) => {
  const [visible, setVisible] = useState(false)
  console.log('visible', visible)
  const [loading, setLoading] = useState(false)
  const [dataConfigData, setDataConfigData] = useState<IMasterLevel | null>()
  const [errorConfigData, setErrorConfigData] = useState('')
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    reset
  } = useForm<FormValues>({
    resolver: yupResolver(schema)
  })


  const onOpen = (record: IMasterLevel) => {
    if (record) {
      console.log('record', record)
      setVisible(true)
      setDataConfigData(record)
      setLoading(true)
      configDataApis
        .getAllConfigData({ idMaster: record.idMaster, id: record.id })
        .then((res) => {
          const { name, note,idMaster } = res[0]
          setValue('name', name, { shouldValidate: true, shouldDirty: true })
          setValue('nameMaster', idMaster, { shouldValidate: true, shouldDirty: true })
          setValue('note', note, { shouldValidate: true, shouldDirty: true })
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  useImperativeHandle(ref, () => ({
    onOpen
  }))

  const handleOk = () => {
    setVisible(false)
  }

  const onClose = () => {
    setVisible(false)
    setLoading(false)
    reset()
    setDataConfigData(null)
    setErrorConfigData('')
  }

  const onChange = (value: string) => {
    console.log(`selected ${value}`)
  }

  const onSearch = (value: string) => {
    console.log('search:', value)
  }

  // Filter `option.label` match the user type `input`
  const filterOption = (input: string, option?: { label: string; value: number }) =>{
    console.log(input)
    return (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
  }

  const submitUpdateConfigData: SubmitHandler<FormValues> = (values) => {
    const { name, nameMaster: idMaster, note } = values
    const nameMaster: string | undefined = MASTER_DATA.find((e) => e.value === +idMaster)?.nameMaster
    console.log(dataConfigData,idMaster)
    if (!dataConfigData || !nameMaster) return;
    const payload = {
      name,
      id: dataConfigData.id,
      idMaster: +idMaster,
      nameMaster,
      note
    }
    console.log(dataConfigData, nameMaster)
    return configDataApis
      .updateConfigData(payload)
      .then((res) => {
        console.log(res)
        toast.success(i18next.t('update_success'))
        onClose()
        onAfterUpdate()
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }
  return (
    <Modal footer={null} destroyOnClose maskClosable={false} open={visible} onOk={handleOk} onCancel={onClose}>
      <h3 className='text-center'>{i18next.t('config_data_update')}</h3>
      <form onSubmit={handleSubmit(submitUpdateConfigData)}>
        <div className='field mb-3 flex flex-col'>
          <label>{i18next.t('code')}</label>
          <Controller
            name='nameMaster'
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                showSearch
                disabled
                status={errors?.nameMaster?.message ? 'error' : ''}
                optionFilterProp='children'
                // onChange={onChange}
                // onSearch={onSearch}
                placeholder={i18next.t('select_a_config_data')}
                filterOption={filterOption}
                options={MASTER_DATA.map((e) => ({
                  value: e.value,
                  label: e.nameMaster
                }))}
              />
            )}
          />
          {errors?.nameMaster?.message && <p className='text-error'>{errors?.nameMaster?.message}</p>}
        </div>
        <div className='field mb-3 flex flex-col'>
          <label>{i18next.t('name')}</label>
          <Controller
            name='name'
            control={control}
            render={({ field }) => <Input {...field} placeholder={i18next.t('name')} />}
          />
          {errors?.name?.message && <p className='text-error'>{errors?.name?.message}</p>}
        </div>
        <div className='field mb-3 flex flex-col'>
          <label>{i18next.t('note')}</label>
          <Controller
            name='note'
            control={control}
            render={({ field }) => <Input.TextArea {...field} placeholder={i18next.t('note')} />}
          />
          {errors?.note?.message && <p className='text-error'>{errors?.name?.message}</p>}
        </div>
        <div className='flex items-center justify-center'>
          <Button className='m-1 bg-red-500 hover:bg-red-400' htmlType='submit' type='primary' loading={loading}>
            {i18next.t('update')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default forwardRef(ModalConfigDataUpdate)
