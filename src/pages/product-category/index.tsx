import { Button, Col, Collapse, Input, InputRef, Row, Space, Switch, Table, Tooltip, Typography } from 'antd'
import i18next from '../../locales/i18n'
import { useEffect, useRef, useState } from 'react'
import { FilterConfirmProps, TablePaginationConfig, TableRowSelection } from 'antd/es/table/interface'
import { IProduct } from '../../interface/product.interface'
import productCategoryApis from '../../apis/productCategoryApis'
import { IProductCategory } from '../../interface/productCategory.interface'
import yup from '../../utils/yup'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { EditOutlined, SearchOutlined } from '@ant-design/icons'
import { GLOBAL_STATUS } from '../../constants'
import ModalProductCategoryChangeStatus from './modal-product-category-change-status/ModalProductCategoryChangeStatus'
import Highlighter from 'react-highlight-words'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import ModalProductCategoryCreate from './ModalProductCategoryCreate/index'
import ModalProductCategoryUpdate from './ModalProductCategoryUpdate'

// interface DataType {
//   key: React.Key;
//   name: string;
//   age: number;
//   address: string;
// }

interface FormValues {
  name?: string
}

interface RefObject {
  onOpen: (id: number, status: IProductCategory) => void
}

const ProductCategory = () => {
  const { Title } = Typography
  const [loading, setLoading] = useState(false)
  const [rowKeySelect, setRowKeySelect] = useState<React.Key[]>([])
  const [listProductCategory, setListProductCategory] = useState<IProductCategory[]>([])
  const [page, setPage] = useState<number | undefined>(1)
  const refModalProductCategoryChangeStatus = useRef<RefObject | null>(null)
  const refModalProductCategoryCreate = useRef<any>(null)
  const refModalProductCategoryUpdate = useRef<any>(null)

  const schema = yup.object({ name: yup.string().max(255) })
  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: yupResolver(schema)
    // defaultValues: {
    //   name: ''
    // }
  })
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)
  type DataIndex = keyof IProductCategory
  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
    setSearchText('')
  }

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<IProductCategory> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Tìm Kiếm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 100, backgroundColor: 'red' }}
          >
            Tìm Kiếm
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size='small' style={{ width: 80 }}>
            Làm lại
          </Button>
          {/* <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button> */}
          {/* <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button> */}
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
    onFilter: (value, record) =>
      record.name
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      )
  })

  const rowSelection: TableRowSelection<IProductCategory> = {
    onChange: (selectedRowKeys) => {
      setRowKeySelect(selectedRowKeys)
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name
    })
  }

  const onSubmit: SubmitHandler<FormValues> = (values: FormValues) => {
    console.log(values)
    const params = { name: values.name }
    console.log(params)
    setPage(1)
    return onGetListProductCategory(params)
  }

  const columns: ColumnsType<IProductCategory> = [
    {
      title: i18next.t('image'),
      key: 'image',
      dataIndex: 'image',
      width: 150,
      align: 'center',
      render: (item) => <img width={100} src={item} />
    },
    {
      title: i18next.t('name'),
      key: 'name',
      dataIndex: 'name',
      ...getColumnSearchProps('name'),
      width: 300,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      sorter: (a, b) => a.name?.localeCompare(b.name)
    },
    {
      title: i18next.t('slug'),
      dataIndex: 'categorySlug',
      key: 'slug',
      render: (text) => (
        <Tooltip placement='topLeft' title={text}>
          {text}
        </Tooltip>
      ),
      width: 200,
      sorter: (a, b) => a.categorySlug?.localeCompare(b.categorySlug)
    },
    {
      title: i18next.t('description'),
      key: 'description',
      dataIndex: 'description',
      width: 200,
      render: (text) => (
        <Tooltip placement='topLeft' title={text}>
          {text}
        </Tooltip>
      ),
      sorter: (a, b) => a.description?.localeCompare(b.description)
    },
    {
      title: i18next.t('status'),
      key: 'status',
      dataIndex: 'status',
      render: (item, record) => (
        <div className='d-flex justify-content-center'>
          <Switch
            checked={item === GLOBAL_STATUS.ACTIVE}
            onChange={() => refModalProductCategoryChangeStatus.current.onOpen(record.id, record)}
          />
        </div>
      ),
      align: 'center',
      width: 200,
      sorter: (a, b) => a.status - b.status
    },
    {
      title: i18next.t('action'),
      key: 'action',
      render: (_, record) => (
        <Tooltip title={i18next.t('update')}>
          <Button
            shape='round'
            className='mx-1 bg-red-500'
            size='small'
            onClick={() => refModalProductCategoryUpdate.current.onOpen(record.id)}
            icon={<EditOutlined />}
            type='primary'
          />
        </Tooltip>
      ),
      fixed: 'right',
      align: 'center',
      width: 100
    }
  ]

  const onGetListProductCategory = async (values: { name?: string }) => {
    const params = {
      ...values,
      size: 1000
    }
    setLoading(true)

    return productCategoryApis
      .getListPagingProductCategory(params)
      .then(({ rows }) => {
        setListProductCategory(rows)

        window.scroll({
          top: 0,
          behavior: 'smooth'
        })
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }
  useEffect(() => {
    onGetListProductCategory(getValues())
  }, [])

  const handleTableChange = (pagination: TablePaginationConfig): void => {
    console.log('pagination', pagination)
    setPage(pagination?.current)
  }

  const renderSearch = () => {
    return (
      <Collapse defaultActiveKey={['1']} className='collapse-custom-style mb-5'>
        <Collapse.Panel header={i18next.t('search')} key='1'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row gutter={[24, 12]} align='bottom'>
              <Col xs={24} sm={12} md={12} xl={8}>
                <Controller
                  name='name'
                  control={control}
                  render={({ field }) => (
                    <>
                      <div className='label-field'>{i18next.t('search')}</div>
                      <Input {...field} placeholder={i18next.t('search_dot3')} />
                    </>
                  )}
                />
                {errors?.name?.message && <p className='text-error'>{errors?.name?.message}</p>}
              </Col>
              <Col xs={24} sm={8} md={6}>
                <Button loading={loading} htmlType='submit' type='primary' className='bg-red-500'>
                  {i18next.t('search')}
                </Button>
              </Col>
            </Row>
          </form>
        </Collapse.Panel>
      </Collapse>
    )
  }
  return (
    <>
      {renderSearch()}
      <Row gutter={[24, 12]} className='mb-3'>
        <Col md={12} sm={12} xs={24}>
          <Title level={3}>{i18next.t('product_category')}</Title>
        </Col>

        <Col md={12} sm={12} xs={24} className='button_create' flex='end'>
          <Button
            htmlType='submit'
            type='primary'
            className='w-20 float-right mb-2'
            onClick={() => refModalProductCategoryCreate.current.onOpen()}
          >
            {i18next.t('category_add')}
          </Button>
        </Col>
      </Row>
      <Table
        rowSelection={{
          type: 'checkbox',
          ...rowSelection
        }}
        dataSource={listProductCategory}
        columns={columns}
        rowKey='id'
        pagination={{
          current: page,
          position: ['bottomCenter']
        }}
        loading={loading}
        onChange={handleTableChange}
      ></Table>
      <ModalProductCategoryChangeStatus
        ref={refModalProductCategoryChangeStatus}
        onAfterChangeStatus={() => {
          onGetListProductCategory(getValues())
        }}
      />
      <ModalProductCategoryCreate
        ref={refModalProductCategoryCreate}
        onSubmit={(payload: { name: string; categorySlug: string; description?: string; image?: string }) =>
          productCategoryApis.createProductCategory(payload)
        }
        onAfterCreate={() => {
          onGetListProductCategory(getValues())
        }}
      />

      <ModalProductCategoryUpdate
        ref={refModalProductCategoryUpdate}
        onAfterUpdate={() => {
          onGetListProductCategory(getValues())
        }}
      />
    </>
  )
}

export default ProductCategory
