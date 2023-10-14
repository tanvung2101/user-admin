import {
  Button,
  Col,
  Collapse,
  DatePicker,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tooltip,
  Typography
} from 'antd'
import i18next from '../../locales/i18n'
import React, { useEffect, useRef, useState } from 'react'
import { Controller, ControllerRenderProps, FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { IParamsListUser, Users } from '../../interface/user.interface'
import userApis from '../../apis/userApis'
import moment from 'moment'
import yup from '../../utils/yup'
import { yupResolver } from '@hookform/resolvers/yup'
import configDataApis from '../../apis/configDataApis'
import { ACCOUNT_STATUS, MASTER_DATA_NAME } from '../../constants/index'
import { IMasterLevel } from '../../interface/configData.interface'
import { InfoOutlined, SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import type { FilterConfirmProps, TablePaginationConfig } from 'antd/es/table/interface'
import type { InputRef } from 'antd'
import ModalUserChangeStatus from './modal-user-change-status'

interface IListUser extends Users {
  phone: string
  fullName: string
  referralCode: string
  countReferral: number
}

type FormValues = {
  search?: string
  level?: number
  role?: number
  filter?: any[]
}

const schema = yup.object({
  search: yup.string().max(255),
  level: yup.number(),
  role: yup.number()
})

type DataIndex = keyof IListUser

const User = () => {
  const { Title } = Typography
  const [loading, setLoading] = useState(false)
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [page, setPage] = useState<number | undefined>(1)

  const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('checkbox')

  const [listUser, setListUser] = useState<IListUser[]>()

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)

  const refModalUserChangeStatus = useRef<any>()

  const { control, handleSubmit, getValues } = useForm<FormValues>({
    resolver: yupResolver(schema)
  })

  const [masterLevelUser, setMasterLevelUser] = useState<IMasterLevel[]>()
  const [masterRoleUser, setMasterRoleUser] = useState<IMasterLevel[]>()

  const fetchMasterData = async () => {
    const masterLevel = await configDataApis.getAllConfigData({
      idMaster: MASTER_DATA_NAME.LEVEL_USER
    })
    const masterRole = await configDataApis.getAllConfigData({
      idMaster: MASTER_DATA_NAME.ROLE
    })
    if (masterLevel && masterRole) {
      setMasterLevelUser(masterLevel)
      setMasterRoleUser(masterRole)
    }
  }

  const handleChange = (value: string) => {
    console.log(`selected ${value}`)
    setTypeFilter(value)
  }

  const Filter = (field: ControllerRenderProps<FieldValues, 'filter'>) => {
    if (!typeFilter) return
    if (typeFilter === 'createdAt') {
      return <DatePicker.RangePicker {...field} />
    } else {
      return <Input {...field} />
    }
  }

  const onSubmit: SubmitHandler<FormValues> = (values: FormValues) => {
    const params = {
      ...values,
      size: 1000
    }
    setPage(1)
    return onGetListUser(params)
  }

  const renderSerach = () => {
    return (
      <Collapse bordered={false}>
        <Collapse.Panel header={i18next.t('search')} key='1'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row gutter={[24, 12]} align='bottom'>
              <Col xs={24} sm={12} md={12} xl={8}>
                <Controller
                  name='search'
                  control={control}
                  render={({ field }) => (
                    <Input className='w-full' {...field} placeholder={`${i18next.t('search')}...`}></Input>
                  )}
                ></Controller>
              </Col>
              <Col xs={24} sm={12} md={12} xl={4}>
                <Controller
                  name='level'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      showSearch
                      className='w-full'
                      placeholder='Cấp bậc User'
                      optionFilterProp='children'
                      filterOption={(input, option) => (option?.label ?? '').includes(input)}
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                      }
                      options={masterLevelUser?.map((e) => ({
                        value: e.idMaster,
                        label: e.name
                      }))}
                    />
                  )}
                ></Controller>
              </Col>
              <Col xs={24} sm={12} md={12} xl={4}>
                <Controller
                  name='role'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      showSearch
                      className='w-full'
                      placeholder='Quyền'
                      optionFilterProp='children'
                      filterOption={(input, option) => (option?.label ?? '').includes(input)}
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                      }
                      options={masterRoleUser?.map((e) => ({
                        value: e.idMaster,
                        label: e.name
                      }))}
                    />
                  )}
                ></Controller>
              </Col>
              <Col xs={24} sm={12} md={12} xl={8}>
                <Input.Group>
                  <Row>
                    <Col xs={8} sm={8} md={8} xl={8}>
                      <Select
                        style={{ width: 120 }}
                        onChange={handleChange}
                        options={[
                          { value: 'createdAt', label: 'Tạo ngày' },
                          { value: 'referral', label: 'Tổng giới thiệu' }
                        ]}
                      />
                    </Col>
                    <Col xs={16} sm={16} md={16} xl={16}>
                      <Controller name='filter' control={control} render={({ field }) => <Filter {...field} />} />
                    </Col>
                  </Row>
                </Input.Group>
              </Col>
              <Col xs={24} sm={8} md={6} className='d-flex justify-content-end'>
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

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<IListUser> => ({
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
          <Button
            type='primary'
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90 }}
            className='bg-red-500'
          >
            Tìm kiếm
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size='small' style={{ width: 90 }}>
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
          </Button>
          <Button
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

  const columns: ColumnsType<IListUser> = [
    {
      title: i18next.t('email'),
      dataIndex: 'email',
      key: 'email',
      width: 200,
      sorter: (a, b) => a.email.localeCompare(b.email),
      render: (text) => <a>{text}</a>,
      ...getColumnSearchProps('email')
    },
    {
      title: i18next.t('full_name'),
      dataIndex: 'fullName',
      key: 'fullName',
      width: 200,
      align: 'center',
      sorter: (a, b) => a.fullName?.localeCompare(b.fullName),
      ...getColumnSearchProps('fullName')
    },
    {
      title: i18next.t('user_code'),
      dataIndex: 'userCode',
      key: 'userCode',
      width: 200,
      align: 'center',
      sorter: (a, b) => a.userCode?.localeCompare(b.userCode),
      ...getColumnSearchProps('userCode')
    },
    {
      title: i18next.t('Mã người giới thiêu'),
      key: 'referralCode',
      dataIndex: 'referralCode',
      width: 200,
      align: 'center',
      sorter: (a, b) => a.referralCode?.localeCompare(b.referralCode),
      ...getColumnSearchProps('referralCode')
    },
    {
      title: 'Số người giới thiệu',
      key: 'countReferral',
      dataIndex: 'countReferral',
      width: 200,
      align: 'center',
      sorter: (a, b) => a.countReferral - b.countReferral,
      ...getColumnSearchProps('countReferral')
    },
    {
      title: i18next.t('phone'),
      key: 'phone',
      dataIndex: 'phone',
      width: 200,
      align: 'center',
      sorter: (a, b) => a.phone?.localeCompare(b.phone),
      ...getColumnSearchProps('phone')
    },
    {
      title: i18next.t('active'),
      key: 'status',
      dataIndex: 'status',
      render: (item) => (
        <div className='flex justify-content-center'>
          <Switch checked={item === ACCOUNT_STATUS.ACTIVATE} disabled />
        </div>
      ),
      align: 'center',
      width: 200,
      sorter: (a, b) => a.status - b.status
    },
    {
      title: 'Cấp bậc',
      key: 'level',
      dataIndex: 'level',
      width: 200,
      align: 'center',
      render: (value) => masterLevelUser?.find((e) => e.id === value)?.name,
      sorter: (a, b) => a.level - b.level
    },
    {
      title: 'Quyền',
      key: 'role',
      dataIndex: 'role',
      width: 200,
      align: 'center',
      sorter: (a, b) => a.role - b.role,
      render: (value: number, record) => {
        return (
          <Select
            className='w-[150px]'
            showSearch
            placeholder={masterRoleUser?.find((e) => e.id === value)?.name}
            defaultValue={masterRoleUser?.find((e) => e.id === value)?.name}
            optionFilterProp='children'
            onChange={(e) => refModalUserChangeStatus.current.onOpen(record.id, +e, MASTER_DATA_NAME.ROLE)}
            onSearch={(value: string) => {
              console.log(`selected ${value}`)
            }}
            filterOption={(input: string, option?: { label: string; value: number }) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={masterRoleUser?.map((e) => ({ value: e.id, label: e.name }))}
            
          />
        )
      }
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
      render: (_, record) => (
        <div className='flex justify-center items-center'>
          <Tooltip title={i18next.t('account_detail')}>
            <Button shape='round' className='mx-1' size='small' icon={<InfoOutlined />} />
          </Tooltip>
        </div>
      ),
      fixed: 'right',
      align: 'center'
    }
  ]

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: IListUser[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    },
    getCheckboxProps: (record: IListUser) => ({
      disabled: record.email === 'Disabled User', // Column configuration not to be checked
      name: record.email
    })
  }

  const onGetListUser = (values?: IParamsListUser) => {
    const params = {
      ...values,
      size: 1000
    }
    setLoading(true)

    return userApis
      .getListUser(params)
      .then(({ count, rows }) => {
        let result = rows
          .map((row) => ({
            ...row,
            phone: row.phoneCode ? `+${row.phoneCode}${row.phoneNumber}` : '',
            fullName: row.userInformation.fullName || '',
            referralCode: row.userReferral?.referrerCode || '',
            countReferral: row.userReferrer?.length
          }))
          .sort((a, b) => b.countReferral - a.countReferral)
        setListUser(result)
      })
      .catch((error) => {
        console.log(error)
      })
      .then(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    onGetListUser(getValues())
    fetchMasterData()
  }, [])

  const handleTableChange = (pagination: TablePaginationConfig): void => {
    console.log('pagination', pagination)
    setPage(pagination?.current)
  }
  return (
    <>
      <div style={{ width: '100%' }}>
        {renderSerach()}
        <Title className='mb-3' level={3}>
          {i18next.t('list_users')}
        </Title>
        <Table
          rowSelection={{
            type: selectionType,
            ...rowSelection
          }}
          rowKey='id'
          pagination={{
            current: page,
            position: ['bottomCenter']
          }}
          columns={columns}
          dataSource={listUser}
          scroll={{ x: 'max-content' }}
          loading={loading}
          onChange={handleTableChange}
        />
        <ModalUserChangeStatus ref={refModalUserChangeStatus} onAfterChangeStatus={() => onGetListUser(getValues())} />
      </div>
    </>
  )
}

export default User
