import { Button, Col, Collapse, Input, InputRef, Row, Select, Space, Table, Tooltip, Typography } from 'antd'
import i18next from '../../locales/i18n'
import { useEffect, useRef, useState } from 'react'
import orderApis from '../../apis/orderApis'
import { IOrder } from '../../interface/order.interface'
import { InfoOutlined, SearchOutlined } from '@ant-design/icons'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import type { FilterConfirmProps, TablePaginationConfig } from 'antd/es/table/interface'
import Highlighter from 'react-highlight-words'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import configDataApis from '../../apis/configDataApis'
import { MASTER_DATA_NAME, STATUS_ORDER } from '../../constants/index'
import { IMasterLevel } from '../../interface/configData.interface'
import ModalOrderChangeStatus from './modal-order-change-status/index'

type Values = {
  fullName?: string
  orderStatus?: number
  size?: number
}

type FormValues = {
  search: string
  orderStatus: number
}

type DataIndex = keyof IOrder

const Order = () => {
  const { Title } = Typography

  const {
    formState: { errors },
    control,
    handleSubmit,
    getValues
  } = useForm<FormValues>()
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState<number | undefined>(1)

  const [listOrder, setListOrder] = useState<IOrder[]>([])
  const [countListOrder, setCountListOrder] = useState<number>()

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)

  const [masterOrderStatus, setOrderStatus] = useState<IMasterLevel[]>([])

  const refModalOrderChangeStatus = useRef<any>()

  const fetchMasterData = async () => {
    const masterOrder = await configDataApis.getAllConfigData({
      idMaster: MASTER_DATA_NAME.STATUS_ORDER
    })
    setOrderStatus(masterOrder)
  }

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

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<IOrder> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          {/* <Button
            type='link'
            size='small'
            onClick={() => {
              confirm({ closeDropdown: false })
              setSearchText((selectedKeys as string[])[0])
              setSearchedColumn(dataIndex)
            }}
          >
            Filter
          </Button> */}
          <Button
            type='primary'
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90 }}
            className='bg-red-500'
          >
            Tìm Kiếm
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size='small' style={{ width: 90 }}>
            Làm lại
          </Button>
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
      record[dataIndex]
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

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    const params = {
      fullName: values.search,
      orderStatus: values.orderStatus,
      size: 1000
    }

    // setPage(1)
    return onGetListOrder(params)
  }

  const columns: ColumnsType<IOrder> = [
    {
      title: i18next.t('order_code'),
      dataIndex: 'orderCode',
      key: 'orderCode',
      sorter: (a, b) => a.orderCode.localeCompare(b.orderCode),
      ...getColumnSearchProps('orderCode'),
      width: 200
    },
    {
      title: i18next.t('full_name'),
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
      ...getColumnSearchProps('fullName')
    },
    {
      title: i18next.t('email'),
      dataIndex: 'email',
      key: 'email',
      ...getColumnSearchProps('email'),
      sorter: (a, b) => a.email.localeCompare(b.email)
    },
    {
      title: i18next.t('order_total'),
      dataIndex: 'total',
      key: 'price',
      sorter: (a, b) => a.total - b.total
    },
    {
      title: i18next.t('status'),
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      sorter: (a, b) => a.orderStatus - b.orderStatus,
      render: (item, record) => {
        console.log(record)
        return (
          <Select
            showSearch
            defaultValue={masterOrderStatus.find((e) => e.id === item)?.name}
            disabled={item === STATUS_ORDER.REJECT || item === STATUS_ORDER.DELIVERED}
            className='w-[200px]'
            optionFilterProp='children'
            // onChange={(value: string) => {
            //   console.log(`selected ${value}`)
            // }}
            onChange={(e) => refModalOrderChangeStatus.current.onOpen(record.id, +e, record)}
            onSearch={(value: string) => {
              console.log('search:', value)
            }}
            filterOption={(input: string, option?: { label: string; value: string }) => {
                console.log(input)
                return (option?.value ?? '').toLowerCase().includes(input.toLowerCase())
            } 
            }
            options={masterOrderStatus.map((e) => {
              return {
                value: String(e.id),
                label: e.name
              }
            })}
            
          />
        )
      }
    },
    {
      title: i18next.t('created_at'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (item) => moment(item).format('DD-MM-YYYY HH:mm:ss'),
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
      fixed: 'right',
      align: 'center',
      width: 100
    },
    {
      title: i18next.t('action'),
      key: 'action',
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Tooltip>
            <Link to={`/order-detail/${record.orderCode}`}>
              <Button shape='round' className='mx-1' size='small' icon={<InfoOutlined />} />
            </Link>
          </Tooltip>
        </Space>
      ),
      width: 100
    }
  ]

  const onGetListOrder = async (values: Values) => {
    const params = {
      fullName: values.fullName,
      orderStatus: values.orderStatus,
      size: 1000,
    }

    setLoading(true)
    return orderApis
      .getListPagingOrder(params)
      .then(({ rows, count }) => {
        setCountListOrder(count)
        setListOrder(rows)

        window.scroll({
          top:0,
          behavior:'smooth',
        })
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
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
                {/* {errors?.search?.message && <p className='text-error'>{errors?.search?.message}</p>} */}
              </Col>
              <Col xs={24} sm={12} md={12} xl={8}>
                <Controller
                  name='orderStatus'
                  control={control}
                  render={({ field: { onChange } }) => (
                    <Select
                      // showSearch
                      // status={errors?.categoryId?.message}
                      // control={control}
                      allowClear={true}
                      onChange={onChange}
                      style={{ width: 200 }}
                      placeholder='Trạng thái đơn hàng'
                      optionFilterProp='children'
                      filterOption={(input, option) => (option?.label ?? '').includes(input)}
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                      }
                      options={masterOrderStatus.map((e) => {
                        return {
                          value: e.id,
                          label: e.name
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

  useEffect(() => {
    fetchMasterData()
    onGetListOrder(getValues())
  }, [])

  const handleTableChange = (pagination: TablePaginationConfig): void => {
    console.log('pagination', pagination)
    setPage(pagination?.current)
  }
  return (
    <>
      {renderSearch()}
      <Title className='mb-3' level={3}>
        {i18next.t('order_list')}
      </Title>
      <Table
        rowKey='id'
        pagination={{ current: page, position: ['bottomCenter'] }}
        rowSelection={{ type: 'checkbox', ...rowSelection }}
        columns={columns}
        dataSource={listOrder}
        onChange={handleTableChange}
      ></Table>
    <ModalOrderChangeStatus ref={refModalOrderChangeStatus} onAfterChangeStatus={() => onGetListOrder(getValues())}/>
    </>
  )
}

export default Order
