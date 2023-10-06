import { Button, Col, Collapse, Input, Row, Space, Table, Tooltip, Typography, Select, Switch } from 'antd'
import i18next from '../../locales/i18n'
import { Link, useNavigate } from 'react-router-dom'
import type { FilterConfirmProps, TablePaginationConfig, TableRowSelection } from 'antd/es/table/interface'
import React, { useEffect, useRef, useState } from 'react'
import productApis from '../../apis/productApis'
import { IProduct, IProductDetail, IProductImage } from '../../interface/product.interface'
import { GLOBAL_STATUS, IMAGE_TYPE, MASTER_DATA_NAME } from '../../constants'
import moment from 'moment'
import { EditOutlined, SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import type { InputRef } from 'antd'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import yup from '../../utils/yup'
import { yupResolver } from '@hookform/resolvers/yup'
// import Select from 'react-select'
import productCategoryApis from '../../apis/productCategoryApis'
import { IProductCategory } from '../../interface/productCategory.interface'
import configDataApis from '../../apis/configDataApis'
import { IMasterLevel } from '../../interface/configData.interface'
import ModalProductChangeStatus from './modal-product-change-status'

// const data: DataType[] = []
interface FormValues {
  search?: string
  categoryId?: number
}
type DataIndex = keyof IProduct
const Product = () => {
  const schema = yup.object({ search: yup.string().max(255), categoryId: yup.number() })
  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      search: ''
    }
  })
  interface RefObject {
    onOpen: (id:number, status:IProduct) => void
  }
  const { Title } = Typography
  const refModalAccountDetail = useRef<any>(null)
  const navigation = useNavigate()
  const [page, setPage] = useState<number | undefined>(1)
  const [loading, setLoading] = useState(false)
  const [rowKeySelect, setRowKeySelect] = useState<React.Key[]>([])

  const [listDetailProducts, setListDetailProducts] = useState<IProductDetail[]>([])
  const [listProducts, setListProducts] = useState<IProduct[]>([])

  // search table
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)

  const [masterUnit, setMasterUnit] = useState<IMasterLevel[]>([])
  const [masterCapacity, setMasterCapactity] = useState<IMasterLevel[]>()

  const [listCategory, setListCategory] = useState<{ id: number; category: string }[]>([])

  const fetchMasterData = async () => {
    const fetchMasterCapacity = await configDataApis.getAllConfigData({
      idMaster: MASTER_DATA_NAME.CAPACITY_PRODUCT
    })
    const fetchMasterUnit = await configDataApis.getAllConfigData({
      idMaster: MASTER_DATA_NAME.UNIT_PRODUCT
    })
    setMasterCapactity(fetchMasterCapacity)
    setMasterUnit(fetchMasterUnit)
  }

  const getListCategory = async () => {
    const categoryId: IProductCategory[] = await productCategoryApis.getAllCategory()
    console.log(categoryId)
    // setListCategory(categoryId);
    setListCategory(
      categoryId.map((e) => {
        // console.log('categoryId', e)
        return {
          id: e.id,
          category: e.name
        }
      })
    )
  }

  
  // console.log('first', listCategory)
  useEffect(() => {
    onGetListProduct()
    getListCategory()
    fetchMasterData()
  }, [])

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

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<IProduct> => ({
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

  const expandedRowRender = (rows: IProduct) => {
    const productDetail = listDetailProducts
      .filter((item) => {
        return item.productId === rows.id
      })
      .map((e) => {
        const capacity = masterCapacity?.find(i => i.id === e.capacityId)?.name + ' ' + masterUnit.find(u => u.id === e.unitId)?.name
        return {
          name: rows.name,
          id: e.id,
          capacity,
          productId: e.productId,
          price: e.price,
          quantity: rows.productInventory.find((pi) => pi.productId === e.productId && pi.subProductId === e.id)
            ?.quantity
        }
      })
    // console.log(productDetail)
    const columns = [
      {
        title: i18next.t('name'),
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: i18next.t('capacity'),
        dataIndex: 'capacity',
        key: 'capacity'
      },
      {
        title: i18next.t('price'),
        dataIndex: 'price',
        key: 'price'
      },
      {
        title: i18next.t('quantity'),
        dataIndex: 'quantity',
        key: 'quantity'
      }
    ]
    return <Table columns={columns} dataSource={productDetail} rowKey='id' pagination={false}></Table>
  }

  const rowSelection: TableRowSelection<IProduct> = {
    onChange: (selectedRowKeys) => {
      setRowKeySelect(selectedRowKeys)
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name
    })
  }

  const onChange = (id:number,item:IProduct) => {
    console.log(`switch to ${id} ${item}`);
  };

  const onSubmit: SubmitHandler<FormValues> = (values: FormValues) => {
    console.log(values)
    const params = { categoryId: values.categoryId, name: values.search, admin: true }
    console.log(params)
    setPage(1)
    return onGetListProduct(params)
  }
  const columns: ColumnsType<IProduct> = [
    Table.SELECTION_COLUMN,
    {
      title: i18next.t('image'),
      key: 'productImage',
      dataIndex: 'productImage',
      width: 200,
      align: 'center',
      render: (item) => {
        return item.map((i: IProductImage) => {
          if (i.isMain === IMAGE_TYPE.MAIN) {
            return <img key={i.id} width={100} src={i.image} />
          }
        })
      }
    },
    {
      title: i18next.t('name'),
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      width: 300,
      sorter: (a, b) => a.name?.localeCompare(b.name)
    },
    {
      title: i18next.t('product_category'),
      dataIndex: 'productCategory',
      key: 'productCategory',
      render: (item) => <span>{item.name}</span>,
      sorter: (a, b) => a.productCategory.name?.localeCompare(b.productCategory.name)
    },
    {
      title: 'Nổi bật',
      key: 'outstanding',
      dataIndex: 'outstanding',
      render: (item) => (item === 0 ? 'Binh thường' : 'Nổi bất'),
      sorter: (a, b) => a.outstanding - b.outstanding
    },
    {
      title: i18next.t('active'),
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render(item, record) {
        console.log(record)
        return (
          <Switch onChange={() =>
            refModalAccountDetail.current.onOpen(record.id, record)
          } checked={item === GLOBAL_STATUS.ACTIVE}  />
        )
      },
    },
    {
      title: i18next.t('created_at'),
      dataIndex: 'createdAt',
      key: 'created_at',
      render: (item) => moment(item).format('YYYY-MM-DD HH:mm:ss'),
      width: 200,
      sorter: (a, b) => a.createdAt?.localeCompare(b.createdAt)
    },
    {
      title: i18next.t('action'),
      key: 'action',
      render: (_, record) => {
        // console.log(item)
        return (
          <div className='flex items-center justify-center flex-col'>
            <div className='flex items-center justify-center'>
              <Tooltip title={i18next.t('update')}>
                <Button
                  className='mx-1 bg-red-500'
                  shape='round'
                  type='primary'
                  size='small'
                  icon={<EditOutlined />}
                  onClick={() => navigation(`/product/update/${record.id}`)}
                ></Button>
              </Tooltip>
            </div>
          </div>
        )
      },
      fixed: 'right'
    }
  ]
  const onGetListProduct = (values?: { categoryId?: number; name?: string; size?: number }) => {
    const params = {
      ...values,
      admin: true,
      size: 10000
    }
    setLoading(true)
    productApis
      .getListProduct(params)
      .then(({ rows }: { rows: IProduct[] }) => {
        const detailsProduct: IProductDetail[] = []
        setListProducts(
          rows.map((e) => {
            e.productDetail.map((a) => detailsProduct.push(a))
            return {
              ...e
              // productCategoryName: e.productCategory.name,
              // productImage: e.productImage.find(
              //   (e) => e.isMain === IMAGE_TYPE.MAIN
              // )?.image,
            }
          })
        )
        setListDetailProducts(detailsProduct)

        window.scroll({
          top: 0,
          behavior: 'smooth'
        })
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false)
      })
  }

  const renderSearch = () => {
    return (
      <Collapse defaultActiveKey={['1']} className='collapse-custom-style mb-5'>
        <Collapse.Panel header={i18next.t('search')} key='1'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row gutter={[24, 12]} align='bottom'>
              <Col xs={24} sm={12} md={12} xl={8}>
                <Controller
                  name='search'
                  control={control}
                  render={({ field }) => (
                    <>
                      <div className='label-field'>{i18next.t('search')}</div>
                      <Input {...field} placeholder={i18next.t('search_dot3')} />
                    </>
                  )}
                />
                {errors?.search?.message && <p className='text-error'>{errors?.search?.message}</p>}
              </Col>
              <Col xs={24} sm={12} md={12} xl={8}>
                <Controller
                  name='categoryId'
                  control={control}
                  render={({ field: { onChange } }) => (
                    <Select
                      // showSearch
                      // status={errors?.categoryId?.message}
                      // control={control}
                      allowClear={true}
                      onChange={onChange}
                      style={{ width: 200 }}
                      placeholder={i18next.t('select_a_category')}
                      optionFilterProp='children'
                      filterOption={(input, option) => (option?.label ?? '').includes(input)}
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                      }
                      options={listCategory.map((e) => {
                        return {
                          value: e.id,
                          label: e.category
                        }
                      })}
                    />
                  )}
                />
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
  const handleTableChange = (pagination:TablePaginationConfig):void => {
    console.log("pagination", pagination)
    setPage(pagination?.current)
  }
  const [fixedTop, setFixedTop] = useState(false);
  return (
    <>
      {renderSearch()}
      <Row className='' gutter={[24, 12]}>
        <Col className='gutter-row' md={12} sm={12} xs={24}>
          <Title level={3}>{i18next.t('product_management')}</Title>
        </Col>
        <Col span={6} md={12} sm={12} xs={24} className='button_create' flex={'end'}>
          <Link to={`/product/create`} className='block'>
            <Button danger style={{ float: 'right', marginBottom: '0.5em' }} type='primary'>
              {i18next.t('product_add')}
            </Button>
          </Link>
        </Col>
      </Row>
      <Table
        rowSelection={{
          type: 'checkbox',
          ...rowSelection
        }}
        columns={columns}
        dataSource={listProducts}
        rowKey='id'
        expandable={{
          expandedRowRender,
          // rowExpandable: (record) => record.name !== 'Not Expandable',
          expandIcon: () => <div />,
          expandRowByClick: true
        }}
        // scroll={{ x: "max-content" }}
        // className='overflow-x-auto max-w-none'
        pagination={{
          current: page,
          position: ['bottomCenter']
        }}
        onChange={handleTableChange}
        summary={() => (
          <Table.Summary fixed={fixedTop ? 'top' : 'bottom'}>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={2}>
                <Switch
                  checkedChildren="Fixed Top"
                  unCheckedChildren="Fixed Top"
                  checked={fixedTop}
                  onChange={() => {
                    setFixedTop(!fixedTop);
                  }}
                />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2} colSpan={8}>
                Scroll Context
              </Table.Summary.Cell>
              <Table.Summary.Cell index={10}>Fix Right</Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
      <ModalProductChangeStatus ref={refModalAccountDetail} onAfterChangeStatus={() => {
        onGetListProduct(getValues())
      }}/>
    </>
  )
}

export default Product
