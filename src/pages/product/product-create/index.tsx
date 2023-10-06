import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import {
  Button,
  Card,
  Col,
  Divider,
  Image,
  Input,
  InputRef,
  Modal,
  Radio,
  RadioChangeEvent,
  Row,
  Select,
  Space,
  Spin,
  Tabs,
  TabsProps,
  Tooltip,
  Upload
} from 'antd'
import i18next from '../../../locales/i18n'
import {
  ArrowLeftOutlined,
  CameraOutlined,
  CheckOutlined,
  LoadingOutlined,
  PlusOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import type { UploadFile } from 'antd/es/upload/interface'
import type { RcFile, UploadProps } from 'antd/es/upload'
import { Link, useNavigate } from 'react-router-dom'
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form'
// import ReactQuill from 'react-quill'
// import { Editor } from '@tinymce/tinymce-react'
import yup from '../../../utils/yup'
import { yupResolver } from '@hookform/resolvers/yup'
import productCategoryApis from '../../../apis/productCategoryApis'
// import { IProductCategory } from '../../../interface/productCategory.interface'
import configDataApis from '../../../apis/configDataApis'
import { MASTER_DATA, MASTER_DATA_NAME } from '../../../constants'
// import { IMasterLevel } from '../../../interface/configData.interface'
import { convertToSlug } from '../../../utils/funcs'
import ProductTableRows from '../../../components/ProductTableRows'
import productApis from '../../../apis/productApis'
import Compressor from 'compressorjs'
import commonApis from '../../../apis/commonApis'
import ReactQuill from 'react-quill'

let index = 0

const REMOVED = 'removed'

interface RefObject {
  getContent: () => void
}

type FormValues = {
  name: string
  acronym?: string
  nameVi?: string
  expiry?: string
  slug: string
  thumbnail?: string
  categoryId: number
  description: string
  outstanding: number
  element?: string
  uses?: string
  guide?: string
  originId?: number
}

const ProductCreate = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [slug, setSlug] = useState('')
  const refThumbnail = useRef<any>(null)
  const [errorProductDetail, setErrorProductDetail] = useState<string | null>()
  const [listCategory, setListCategory] = useState<{ id: number; category: string }[]>([])
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    },
    {
      uid: '-2',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    },
    {
      uid: '-3',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    },
    {
      uid: '-4',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    },
    {
      uid: '-xxx',
      percent: 50,
      name: 'image.png',
      status: 'uploading',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    },
    {
      uid: '-5',
      name: 'image.png',
      status: 'error'
    }
  ])
  const [compressedFile, setCompressedFile] = useState<any | null>(null)
  const [originList, setOriginList] = useState<{ id: number; origin: string }[]>()

  // const [value, setValue] = useState('')
  const editorRef = useRef<RefObject | null>(null)

  const [category, setCategory] = useState([''])
  const [origin, setOrigin] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [originName, setOriginName] = useState('')
  const inputRef = useRef<InputRef>(null)

  const schema = yup.object().shape({
    name: yup.string().max(100).required(),
    acronym: yup.string().max(15),
    nameVi: yup.string().max(255),
    expiry: yup.string().max(30),
    slug: yup.string().max(100).required(),
    thumbnail: yup.string().max(255),
    categoryId: yup.number().required(),
    description: yup.string().trim().required(),
    outstanding: yup.number().max(2).required(),
    element: yup.string(),
    uses: yup.string(),
    guide: yup.string(),
    originId: yup.number()
  })
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset
  } = useForm<FormValues>({
    resolver: yupResolver(schema)
  })

  const getListCategory = async () => {
    const categoryId = await productCategoryApis.getAllCategory()
    setListCategory(
      categoryId.map((ca) => {
        return { id: ca.id, category: ca.name }
      })
    )
  }

  const getListOrigin = async () => {
    const originList = await configDataApis.getAllConfigData({
      idMaster: [MASTER_DATA_NAME.ORIGIN]
    })
    setOriginList(
      originList.map((or) => {
        return { id: or.id, origin: or.name }
      })
    )
  }

  useEffect(() => {
    setValue('outstanding', 0)
    getListCategory()
    getListOrigin()
  }, [])

  const handleSetSlug = (value: string) => {
    console.log('name', value)
    console.log('slug', value)
    setValue('name', value, {
      shouldValidate: true,
      shouldDirty: true
    })

    setValue('slug', value, {
      shouldValidate: true,
      shouldDirty: true
    })
  }

  const onChangeCategory = (value: number) => {
    console.log('categoryId', value)
    setValue('categoryId', value, {
      shouldValidate: true,
      shouldDirty: true
    })
  }
  const onChangeOrigin = (value: number) => {
    setValue('originId', value)
  }

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')

  const handleCancel = () => setPreviewOpen(false)

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1))
  }
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8
        }}
      >
        Upload
      </div>
    </div>
  )

  const [value, setValue1] = useState('')
  useEffect(() => {
    setValue('description', value)
    setValue('element', value)
    setValue('uses', value)
    setValue('guide', value)
  }, [value])
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Mô tả sản phẩm',
      children: (
        <div className='field mb-3'>
          <Controller
            name='description'
            control={control}
            render={({ field }) => <ReactQuill {...field} theme='snow' value={value} onChange={setValue1} />}
          />
        </div>
      )
    },
    {
      key: '2',
      label: 'Thành phần',
      children: (
        <div className='field mb-3'>
          <Controller
            name='element'
            control={control}
            render={({ field }) => <ReactQuill {...field} theme='snow' value={value} onChange={setValue1} />}
          />
          {errors?.element?.message && <p className='text-error'>{errors?.element?.message}</p>}
        </div>
      )
    },
    {
      key: '3',
      label: 'Công dụng',
      children: (
        <div className='field mb-3'>
          <Controller
            name='uses'
            control={control}
            render={({ field }) => <ReactQuill {...field} theme='snow' value={value} onChange={setValue1} />}
          />
          {errors?.uses?.message && <p className='text-error'>{errors?.uses?.message}</p>}
        </div>
      )
    },
    {
      key: '4',
      label: 'Hướng dẫn sử dụng',
      children: (
        <div className='field mb-3'>
          <Controller
            name='guide'
            control={control}
            render={({ field }) => <ReactQuill {...field} theme='snow' value={value} onChange={setValue1} />}
          />
          {errors?.guide?.message && <p className='text-error'>{errors?.guide?.message}</p>}
        </div>
      )
    }
  ]

  // add category chọn danh mục
  const onNameChangeCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryName(event.target.value)
  }
  const addCategory = async (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault()
    setCategory([...category, categoryName || `New item ${index++}`])

    const payload = {
      name: categoryName.trim(),
      categorySlug: convertToSlug(categoryName.trim())
    }
    await productCategoryApis.createProductCategory(payload), getListCategory()
    setCategoryName('')
  }
  // add xuất xứ
  const onNameChangeOrigin = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOriginName(event.target.value)
  }
  const addOrigin = async (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault()
    const nameMaster = MASTER_DATA.find((e) => e.value === MASTER_DATA_NAME.ORIGIN)?.nameMaster
    if (!nameMaster) return
    const payload = {
      name: originName.trim(),
      nameMaster
    }
    console.log(payload)
    await configDataApis.createConfigData(payload)
    getListOrigin()
    setOriginName('')
  }
  // const log = () => {
  //   if (editorRef.current) {
  //     // console.log(editorRef.current.getContent())
  //   }
  // }

  const onChange_Radio = (event:RadioChangeEvent) => {
    setValue('outstanding', +event.target.value)
    // (e.target as any).value = null
  };

  const onSubmit: SubmitHandler<FormValues> = (values: FormValues) => {
    const {
      name,
      description,
      slug,
      thumbnail,
      outstanding,
      categoryId,
      uses,
      element,
      guide,
      expiry,
      nameVi,
      acronym,
      originId
    } = values

    console.log(values)

    let failCreate
    if (rowsData.length === 0) {
      setErrorProductDetail('Cần nhập tối thiểu 1 sản phẩm phụ')
      return
    }
    rowsData.map((row) => {
      if (row.capacityId === 0 || row.unitId === 0 || row.price === 0 || row.quantity === 0) {
        setErrorProductDetail('Có 1 trường nào đó chưa được nhập')
        failCreate = true
        return
      }
      const checkExists = rowsData.filter((e) => e.unitId === row.unitId && e.capacityId === row.capacityId)
      if (checkExists.length > 1) {
        setErrorProductDetail('Đã trùng sản phẩm có cùng dung tích và khối lượng trước đó')
        failCreate = true
      }
    })

    if (failCreate) {
      return
    }

    const productDetail = rowsData.filter(
      (row) => row.capacityId !== 0 && row.unitId !== 0 && row.price !== 0 && row.quantity !== 0
    )
    console.log(productDetail)

    const payload = {
      name: name,
      description: description,
      productSlug: slug,
      subImage: fileList,
      mainImage: 'https://images.unsplash.com/photo-1682687982049-b3d433368cd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHx8&auto=format&fit=crop&w=500&q=60',
      outstanding: outstanding,
      element: element,
      guide: guide,
      uses: uses,
      expiry: expiry,
      nameVi: nameVi,
      acronym: acronym,
      categoryId: categoryId,
      productDetail,
      originId
    }
    console.log('payload', payload)

    return productApis
      .createProduct(payload)
      .then(() => {
        console.log('hello')
        // successHelper(t("create_success"));
        navigate('/product')
      })
      .catch((err) => {
        console.log(err)
        // errorHelper(err);
      })
      .finally(() => {
        setLoading(false)
      })
  }

  

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList)
    console.log('newlisst', newFileList)
  }
  // const changeListImage = async (file:any) => {
  //   if (!compressedFile) return null;
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("fileName", file.name);
  //   return commonApis
  //     .preUploadFile(formData)
  //     .then(async (response) => {
  //       await commonApis.uploadFile({
  //         urlUpload,
  //         file: file,
  //       });

  //       setFileList([...fileList, { url: response }]);
  //     })
  //     .catch((err) => {
  //       errorHelper(err);
  //     });
  // };

  const { thumbnail } = useWatch({ control })
  const [isUpdateThumbnail, setIsUpdateThumbnail] = useState(false)
  const onchangeThumbnail = (e: ChangeEvent<HTMLInputElement | null>) => {
    const files = e.target.files
    if (!files) return
    console.log(e.target.files)
    if (files.length > 0) {
      new Compressor(files[0], {
        quality: 0.8,
        success: (compressedImg) => {
          // compressedResult has the compressed file.
          // Use the compressed file to upload the images to your server.
          onUploadThumbnail(compressedImg)
            .then((response: any) => {
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
    ;(e.target as any).value = null
  }

  const onUploadThumbnail = async (file: any) => {
    setIsUpdateThumbnail(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileName', file.name)
    console.log(formData)
    return commonApis
      .preUploadFile(formData)
      .then(async (response) => {
        console.log(response)
        return response
      })
      .catch((err) => {
        // errorHelper(err);
      })
  }

  // add table row
  const [rowsData, setRowsData] = useState<
    {
      price: number
      quantity: number
      unitId: number
      capacityId: number
    }[]
  >([])
  const addTableRows = () => {
    const rowsInput = {
      price: 0,
      quantity: 0,
      unitId: 0,
      capacityId: 0
    }
    setErrorProductDetail('')
    setRowsData([...rowsData, rowsInput])
  }

  const deleteTableRows = (index: number) => {
    // console.log('hahahahahah',index)
    const rows = [...rowsData]
    rows.splice(index, 1)
    setRowsData(rows)
    setErrorProductDetail('')
  }

  const handleChangeTableRows = (index: number, name: string, value: number) => {
    const rowsInput = [...rowsData]
    if (name === 'price') rowsInput[index]['price'] = value
    else rowsInput[index]['quantity'] = value
  }

  const handleChangeTableRowsCombobox = (index: number, name: string, value: number) => {
    const rowsInput: { price: number; quantity: number; unitId: number; capacityId: number }[] = [...rowsData]
    if (name === 'capacityId') rowsInput[index]['capacityId'] = value
    else rowsInput[index]['unitId'] = value
    setRowsData(rowsInput)
    setErrorProductDetail('')
  }
console.log('previewImage', previewImage)
  return (
    <form className='p-10' onSubmit={handleSubmit(onSubmit)}>
      <Row gutter={[16, 24]}>
        <Col className='gutter-row flex items-center gap-5' span={12}>
          <Link to={'/product'}>
            <ArrowLeftOutlined size={30} style={{ fontSize: '20px', padding: '5px' }} />
          </Link>
          <h3 className='text-xl text-center font-semibold'>Thêm sản phẩm</h3>
          {/* <Titl */}
        </Col>
        <Col className='gutter-row flex items-center justify-end gap-5' span={12}>
          <Button icon={<CheckOutlined />} key='1' htmlType='submit' className='bg-red-500' type='primary'>
            {i18next.t('submit')}
          </Button>
          <Button
            icon={<ReloadOutlined />}
            // onClick={() => {
            //   reset();
            // }}
            htmlType='reset'
            key='2'
          >
            {i18next.t('reset')}
          </Button>
        </Col>
      </Row>
      <Row gutter={[24, 12]} align='top'>
        <Col xs={24} sm={24} md={17} xl={17}>
          <Card bordered={false} className='mb-3'>
            <div className='mb-3'>
              <label>{i18next.t('product_name')}</label>
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    onChange={(event) => handleSetSlug(event.target.value)}
                    // status={errors?.name?.message}
                    placeholder={i18next.t('product_name')}
                  />
                )}
              />
              {errors?.name?.message && <p className='text-error'>{errors?.name?.message}</p>}
            </div>

            <div id='edit-slug' className='field mb-3'>
              <label>{i18next.t('slug')}</label>
              <Controller
                name='slug'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    // status={errors?.slug?.message}
                    placeholder={i18next.t('slug')}
                    disabled
                  />
                )}
              />
              {errors?.slug?.message && <p className='text-error'>{errors?.slug?.message}</p>}
            </div>

            <div className='field mb-3'>
              <Tabs defaultActiveKey='1' items={items} />
            </div>
          </Card>

          <Card
            bordered={false}
            className='mb-3'
            title={
              <div className='flex'>
                <p>Thêm sản phẩm phụ</p>
                <p style={{ color: 'red' }}>&nbsp;&nbsp;*</p>
              </div>
            }
          >
            <table className='table-product-child'>
              <thead>
                <tr>
                  <th>Giá bán</th>
                  <th>Số lượng</th>
                  <th>Dung tích/ Trọng lượng</th>
                  <th>
                    <Button type='primary' className='bg-red-500' onClick={addTableRows} icon={<PlusOutlined />}>
                      Thêm
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                <ProductTableRows
                  rowsData={rowsData}
                  deleteTableRows={deleteTableRows}
                  handleChangeTableRows={handleChangeTableRows}
                  handleChangeTableRowsCombobox={handleChangeTableRowsCombobox}
                />
              </tbody>
            </table>
            {errorProductDetail && <p className='text-error'>{errorProductDetail}</p>}
          </Card>

          <Card bordered={false} className='mb-3' title={i18next.t('product_image')}>
            <Upload
              // action='https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188'
              listType='picture-card'
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
              <img alt='example' style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={7} xl={7}>
          <Card className='mb-3' title={i18next.t('product_category')} bordered={false}>
            <Controller
              name='categoryId'
              control={control}
              render={({ field }) => (
                <Select
                  style={{ width: '100%' }}
                  {...field}
                  onChange={onChangeCategory}
                  placeholder={i18next.t('select_a_category')}
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider style={{ margin: '8px 0' }} />
                      <Space style={{ padding: '0 8px 4px' }}>
                        <Input
                          placeholder={i18next.t('category_name')}
                          ref={inputRef}
                          value={categoryName}
                          onChange={onNameChangeCategory}
                        />
                        <Button type='text' icon={<PlusOutlined />} onClick={addCategory}>
                          {i18next.t('create')}
                        </Button>
                      </Space>
                    </>
                  )}
                  options={listCategory.map((item) => ({ label: item.category, value: item.id }))}
                />
              )}
            />
            {errors?.categoryId?.message && <p className='text-error'>{errors?.categoryId?.message}</p>}
          </Card>

          <Card bordered={false} title={i18next.t('shows')} className='mb-3'>
            <div className='field mb-3'>
              <label>Mã sản phẩm</label>
              <Controller
                name='acronym'
                control={control}
                render={({ field }) => <Input {...field} placeholder='SSPRO001' />}
              />
              {errors?.acronym?.message && <p className='text-error'>{errors?.acronym?.message}</p>}
            </div>
            <div className='field mb-3'>
              <label>Tên Tiếng Việt</label>
              <Controller
                name='nameVi'
                control={control}
                render={({ field }) => <Input {...field} placeholder='Tên Tiếng Việt' />}
              />
              {errors?.nameVi?.message && <p className='text-error'>{errors?.nameVi?.message}</p>}
            </div>
            <div className='field mb-3'>
              <label>Hạn sử dụng</label>
              <Controller
                name='expiry'
                control={control}
                render={({ field }) => <Input {...field} placeholder='36 tháng' />}
              />
              {errors?.expiry?.message && <p className='text-error'>{errors?.expiry?.message}</p>}
            </div>
            <div className='field mb-3'>
              <label>Xuất sứ</label>
              <Controller
                name='originId'
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    onChange={onChangeOrigin}
                    style={{ width: '100%' }}
                    placeholder={i18next.t('select_a_category')}
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <Divider style={{ margin: '' }} />
                        <Space style={{ padding: '0 8px 4px' }}>
                          <Input
                            placeholder={i18next.t('category_name')}
                            ref={inputRef}
                            value={originName}
                            onChange={onNameChangeOrigin}
                          />
                          <Button type='text' icon={<PlusOutlined />} onClick={addOrigin}>
                            {i18next.t('create')}
                          </Button>
                        </Space>
                      </>
                    )}
                    options={originList?.map((item) => ({ label: item.origin, value: item.id }))}
                  />
                )}
              />
              {errors?.originId?.message && <p className='text-error'>{errors?.originId?.message}</p>}
            </div>
            <div className='field mb-3'>
              <Space size='large'>
                {i18next.t('featured')}
                <Controller
                  name='outstanding'
                  control={control}
                  render={({}) => (
                    <Radio.Group name='radiogroup' onChange={onChange_Radio}>
                      <Radio value={0}>{i18next.t('off')}</Radio>
                      <Radio value={1}>{i18next.t('on')}</Radio>
                    </Radio.Group>
                  )}
                />
              </Space>
              {errors?.outstanding?.message && <p className='text-error'>{errors?.outstanding?.message}</p>}
            </div>
          </Card>

          <Card className='mb-3' title={i18next.t('thumbnail')} bordered={false}>
            <div className='field mb-3'>
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
          </Card>
        </Col>
      </Row>
      <Row justify='end'>
        <Col span={24} className='layout-btn-action'>
          <Space size='small'>
            <Button icon={<CheckOutlined />} key='1' htmlType='submit'>
              {i18next.t('submit')}
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                reset()
              }}
              htmlType='reset'
              key='2'
            >
              {i18next.t('reset')}
            </Button>
          </Space>
        </Col>
      </Row>
    </form>
  )
}

export default ProductCreate
