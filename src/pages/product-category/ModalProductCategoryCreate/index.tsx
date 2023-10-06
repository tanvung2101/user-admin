import { Button, Image, Input, Modal, Spin, Tooltip } from 'antd'
import i18next from '../../../locales/i18n'
import { ChangeEvent, forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form'
import yup from '../../../utils/yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { CameraOutlined, LoadingOutlined } from '@ant-design/icons'
import commonApis from '../../../apis/commonApis'
import Compressor from 'compressorjs'

interface RefObject {
  onOpen: () => void
}
interface RefClick {
  onClick: () => void
}

type FormValues = {
  name: string
  categorySlug: string
  description?: string
  thumbnail?: string
}

const schema = yup.object({
  name: yup.string().trim().required().max(255),
  categorySlug: yup.string().trim().required().max(255),
  description: yup.string().trim().max(255),
  thumbnail: yup.string().trim().max(255)
})

const ModalProductCategoryCreate = (
  {
    onAfterCreate,
    onSubmit
  }: {
    onAfterCreate: () => void
    onSubmit: (payload: { name: string; categorySlug: string; description?: string; image?: string }) => void
  },
  ref: React.Ref<RefObject>
) => {
  const [categorySlug, setSlug] = useState('')
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorProductCategory, setErrorProductCategory] = useState('')

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm<FormValues>({
    resolver: yupResolver(schema)
  })

  // const onSubmit: SubmitHandler<FormValues> = (values) => {}

  const handleSetSlug = (value: string) => {
    setValue('name', value, {
      shouldValidate: true,
      shouldDirty: true
    })
    setValue('categorySlug', value, {
      shouldValidate: true,
      shouldDirty: true
    })
  }

  const onOpen = () => {
    setVisible(true)
  }

  useImperativeHandle(ref, () => ({
    onOpen
  }))

  const onClose = () => {
    setVisible(false)
    reset({
      name: '',
      categorySlug: '',
      description: '',
      thumbnail: ''
    })
    setLoading(false)
    setErrorProductCategory('')
  }
  const handleOk = () => {
    setVisible(false)
  }

  const { thumbnail } = useWatch({ control })
  const refThumbnail = useRef<any>()
  const [isUpdateThumbnail, setIsUpdateThumbnail] = useState(false)
  const onchangeThumbnail = (e:ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as FileList
    if (files.length > 0) {
      new Compressor(files[0], {
        quality: 0.8,
        success: (compressedImg) => {
          // compressedResult has the compressed file.
          // Use the compressed file to upload the images to your server.
          onUploadThumbnail(compressedImg)
            .then((response:any) => {
              setValue('thumbnail', response, {
                shouldValidate: true,
                shouldDirty: true
              })
            })
            .finally(() => {
              setIsUpdateThumbnail(false)
            })
        }
      })
    }
    (e.target as any).value = null
  }
  const onUploadThumbnail = async (file:any ) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileName', file.name)
    try {
      const res = await commonApis.preUploadFile(formData)
      return res
    } catch (ex) {
      console.log(ex)
    }
  }

  const submitProductCategoryCreate:SubmitHandler<FormValues> = (values:{ name: string; categorySlug: string; description?: string; thumbnail?: string }) => {
    const { name, categorySlug, description, thumbnail } = values

    const payload: { name: string; categorySlug: string; description?: string; image?: string } = {
      name: name.trim(),
      categorySlug: categorySlug?.trim(),
      description: description?.trim(),
      image: thumbnail
    }

    setLoading(true)

    return onSubmit(payload)
      // .then(() => {
      //   // successHelper(t("create_success"));
      //   onClose()
      //   onAfterCreate();
      // })
      // .catch((err) => {
      //   if (err?.response?.data?.code && err?.response?.data?.code === 'PRODUCT_CATEGORY_IS_EXISTED') {
      //     setErrorProductCategory(i18next.t('errors:PRODUCT_CATEGORY_IS_EXISTED'))
      //   } else {
      //     // errorHelper(err);
      //   }
      // })
      // .finally(() => setLoading(false))
  }

  return (
    <>
      <Modal footer={null} destroyOnClose maskClosable={false} open={visible} onOk={handleOk} onCancel={onClose}>
        <h3>{i18next.t('category_add')}</h3>
        <form onSubmit={handleSubmit(submitProductCategoryCreate)}>
          <div className='field mb-3'>
            <label>{i18next.t('name')}</label>
            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder={i18next.t('name')} onChange={(e) => handleSetSlug(e.target.value)} />
              )}
            />
            {errors?.name?.message && <p className='text-error'>{errors?.name?.message}</p>}
          </div>
          <div className='field mb-3'>
            <label>{i18next.t('slug')}</label>
            <Controller
              name='categorySlug'
              control={control}
              render={({ field }) => <Input {...field} placeholder={i18next.t('slug')} disabled />}
            />
            {errors?.categorySlug?.message && <p className='text-error'>{errors?.categorySlug?.message}</p>}
            {/* {errorProductCategory && <p className='text-error'>{errorProductCategory}</p>} */}
          </div>
          <div className='field mb-3'>
            <label>{i18next.t('description')}</label>
            <Controller
              name='description'
              control={control}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  // status={errors?.description?.message ? "error" : null}
                  placeholder={i18next.t('description')}
                />
              )}
            />
            {errors?.description?.message && <p className='text-error'>{errors?.description?.message}</p>}
          </div>
          <div className='field mb-3'>
            <label>{i18next.t('thumbnail')}</label>
            <div className='thumbnail-upload'>
              <Image
                className='img-thumbnail'
                src={
                  thumbnail ||
                  'data:image/png;base64,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'
                }
                alt=''
              />
              <Tooltip placement='left' title={i18next.t('thumbnail_action_note')}>
                <button
                  type={'button'}
                  disabled={isUpdateThumbnail}
                  onClick={() => refThumbnail.current.click()}
                  className='button-camera'
                >
                  {isUpdateThumbnail ? (
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                  ) : (
                    <CameraOutlined />
                  )}
                  <input
                    ref={refThumbnail}
                    type='file'
                    accept='image/*'
                    onChange={onchangeThumbnail}
                    style={{ display: 'none' }}
                  />
                </button>
              </Tooltip>
            </div>
            {errors?.thumbnail?.message && <p className='text-error'>{errors?.thumbnail?.message}</p>}
          </div>
          <div className='flex items-center justify-center'>
            <Button htmlType='submit' type='primary' loading={loading}>
              {i18next.t('create')}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default forwardRef(ModalProductCategoryCreate)
