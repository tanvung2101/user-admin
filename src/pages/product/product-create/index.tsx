import React, { useRef, useState } from 'react'
import { Button, Card, Col, Divider, Input, InputRef, Modal, Row, Select, Space, Tabs, Upload } from 'antd'
import i18next from '../../../locales/i18n'
import { ArrowLeftOutlined, CheckOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import TabPane from 'antd/es/tabs/TabPane'
import ReactQuill from 'react-quill'
import { Editor } from '@tinymce/tinymce-react'

let index = 0

const ProductCreate = () => {
  const [value, setValue] = useState('')
  const editorRef = useRef(null)

  const [items, setItems] = useState(['jack', 'lucy'])
  const [name, setName] = useState('')
  const inputRef = useRef<InputRef>(null)

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }
  const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault()
    setItems([...items, name || `New item ${index++}`])
    setName('')
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent())
    }
  }

  const {
    control,
    formState: { errors }
  } = useForm({})
  return (
    <form className='p-10'>
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
                    // onChange={(event) => handleSetSlug(event.target.value)}
                    // status={errors?.name?.message}
                    placeholder={i18next.t('product_name')}
                  />
                )}
              />
              {/* {errors?.name?.message && <p className='text-error'>{errors?.name?.message}</p>} */}
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
              {/* {errors?.slug?.message && <p className='text-error'>{errors?.slug?.message}</p>} */}
            </div>

            <div className='field mb-3'>
              <Tabs defaultActiveKey='1'>
                <TabPane tab='Mô tả sản phẩm' key='1'>
                  <Controller
                    name='element'
                    control={control}
                    render={({ field }) => (
                      <Editor
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        initialValue='<p>This is the initial content of the editor.</p>'
                        init={{
                          height: 500,
                          menubar: false,
                          plugins: [
                            'advlist autolink lists link image charmap print preview anchor',
                            'searchreplace visualblocks code fullscreen',
                            'insertdatetime media table paste code help wordcount'
                          ],
                          toolbar:
                            'undo redo | formatselect | ' +
                            'bold italic backcolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | help',
                          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}
                      />
                    )}
                  />
                </TabPane>
                <TabPane tab='Thành phần' key='2'>
                  <Controller
                    name='description'
                    control={control}
                    render={({ field }) => (
                      <Editor
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        initialValue='<p>This is the initial content of the editor.</p>'
                        init={{
                          height: 500,
                          menubar: false,
                          plugins: [
                            'advlist autolink lists link image charmap print preview anchor',
                            'searchreplace visualblocks code fullscreen',
                            'insertdatetime media table paste code help wordcount'
                          ],
                          toolbar:
                            'undo redo | formatselect | ' +
                            'bold italic backcolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | help',
                          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}
                      />
                    )}
                  />
                </TabPane>
                <TabPane tab='Công dụng' key='3'>
                  <Controller
                    name='uses'
                    control={control}
                    render={({ field }) => (
                      <Editor
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        initialValue='<p>This is the initial content of the editor.</p>'
                        init={{
                          height: 500,
                          menubar: false,
                          plugins: [
                            'advlist autolink lists link image charmap print preview anchor',
                            'searchreplace visualblocks code fullscreen',
                            'insertdatetime media table paste code help wordcount'
                          ],
                          toolbar:
                            'undo redo | formatselect | ' +
                            'bold italic backcolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | help',
                          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}
                      />
                    )}
                  />
                </TabPane>
                <TabPane tab='Hướng dẫn sử dụng' key='4'>
                  <Controller
                    name='guide'
                    control={control}
                    render={({ field }) => (
                      <Editor
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        initialValue='<p>This is the initial content of the editor.</p>'
                        init={{
                          height: 500,
                          menubar: false,
                          plugins: [
                            'advlist autolink lists link image charmap print preview anchor',
                            'searchreplace visualblocks code fullscreen',
                            'insertdatetime media table paste code help wordcount'
                          ],
                          toolbar:
                            'undo redo | formatselect | ' +
                            'bold italic backcolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | help',
                          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}
                      />
                    )}
                  />
                </TabPane>
              </Tabs>
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
                    <Button
                      type='primary'
                      // onClick={addTableRows}
                      icon={<PlusOutlined />}
                    >
                      Thêm
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* <ProductTableRows
                  rowsData={rowsData}
                  deleteTableRows={deleteTableRows}
                  handleChangeTableRows={handleChangeTableRows}
                  handleChangeTableRowsCombobox={handleChangeTableRowsCombobox}
                /> */}
              </tbody>
            </table>
          </Card>

          <Card bordered={false} className='mb-3' title={i18next.t('product_image')}>
            <Upload
              name='avatar'
              listType='picture-card'
              className='avatar-uploader'
              showUploadList={false}
              action='https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188'
              // beforeUpload={beforeUpload}
              // onChange={handleChange}
            >
              {/* {imageUrl ? <img src={imageUrl} alt='avatar' style={{ width: '100%' }} /> : uploadButton} */}
            </Upload>
            <Modal
              // visible={previewVisible}
              footer={null}
              // onCancel={handleCancel}
            >
              <img
                alt='example'
                style={{
                  width: '100%'
                }}
                // src={previewImage}
              />
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
                  style={{ width: 300 }}
                  placeholder={i18next.t('select_a_category')}
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider style={{ margin: '8px 0' }} />
                      <Space style={{ padding: '0 8px 4px' }}>
                        <Input
                          placeholder={i18next.t('category_name')}
                          ref={inputRef}
                          value={name}
                          onChange={onNameChange}
                        />
                        <Button type='text' icon={<PlusOutlined />} onClick={addItem}>
                          {i18next.t('create')}
                        </Button>
                      </Space>
                    </>
                  )}
                  options={items.map((item) => ({ label: item, value: item }))}
                />
              )}
            />
            {/* {errors?.categoryId?.message && <p className='text-error'>{errors?.categoryId?.message}</p>} */}
          </Card>

          <Card bordered={false} title={i18next.t('shows')} className='mb-3'>
            <div className='field mb-3'>
              <label>Mã sản phẩm</label>
              <Controller
                name='acronym'
                control={control}
                render={({ field }) => <Input {...field} placeholder='SSPRO001' />}
              />
              {/* {errors?.acronym?.message && <p className='text-error'>{errors?.acronym?.message}</p>} */}
            </div>
            <div className='field mb-3'>
              <label>Tên Tiếng Việt</label>
              <Controller
                name='nameVi'
                control={control}
                render={({ field }) => <Input {...field} placeholder='Tên Tiếng Việt' />}
              />
              {/* {errors?.nameVi?.message && <p className='text-error'>{errors?.nameVi?.message}</p>} */}
            </div>
            <div className='field mb-3'>
              <label>Hạn sử dụng</label>
              <Controller
                name='expiry'
                control={control}
                render={({ field }) => <Input {...field} placeholder='36 tháng' />}
              />
              {/* {errors?.expiry?.message && <p className='text-error'>{errors?.expiry?.message}</p>} */}
            </div>
            <div className='field mb-3'>
              <label>Xuất sứ</label>
              <Controller
                name='originId'
                control={control}
                render={({ field }) => <Input {...field} placeholder='Chọn nơi xuất xứ' />}
              />
              {/* {errors?.expiry?.message && <p className='text-error'>{errors?.expiry?.message}</p>} */}
            </div>
            <div className='field mb-3'>
              <label>Hạn sử dụng</label>
              <Controller
                name='originId'
                control={control}
                render={({ field }) => <Input {...field} placeholder='36 tháng' />}
              />
              {/* {errors?.expiry?.message && <p className='text-error'>{errors?.expiry?.message}</p>} */}
            </div>
          </Card>
        </Col>
      </Row>
    </form>
  )
}

export default ProductCreate
