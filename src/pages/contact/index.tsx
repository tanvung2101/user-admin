import { Button, Input, Typography } from 'antd'
import i18next from '../../locales/i18n'
import React, { useEffect, useRef, useState } from 'react'
import { Space, Table, Tag } from 'antd'
import { IContact } from '../../interface/contact.interface'
import contactApis from '../../apis/contactApi'
import type { InputRef } from 'antd';
import Highlighter from 'react-highlight-words'
import { SearchOutlined } from '@ant-design/icons'
import type { ColumnType, ColumnsType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';

type DataIndex = keyof IContact;
const Contact = () => {
  const { Title } = Typography

  const [page, setPage] = useState<number>(1)

  const [loading, setLoading] = useState(false)

  const [listContacts, setListContacts] = useState<IContact[]>()
  const [countListContacts, setCountListContacts] = useState<number>()

  const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('checkbox');

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);


  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<IContact> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Tìm kiếm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
            className='bg-red-500'
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
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
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
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
      ),
  });
  const columns: ColumnsType<IContact> = [
    {
      title: i18next.t('full_name'),
      dataIndex: 'fullName',
      key: 'fullName',
      width:200,
      sorter: (a,b) => a.fullName.localeCompare(b.fullName),
      render: (text) => <a>{text}</a>,
      ...getColumnSearchProps('fullName'),
    },
    {
      title: i18next.t('email'),
      dataIndex: 'email',
      key: 'email',
      width:200,
      sorter: (a,b) => a.email.localeCompare(b.email),
      ...getColumnSearchProps('email'),
    },
    {
      title: i18next.t('phone'),
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width:150,
      sorter: (a,b) => a.phoneNumber.localeCompare(b.phoneNumber),
      ...getColumnSearchProps('phoneNumber'),
    },
    {
      title: i18next.t('content'),
      key: 'content',
      dataIndex: 'content',
      width:300,
    },
    {
      title: i18next.t('status'),
      key: 'status',
      dataIndex: 'status',
      sorter: (a,b) => a.status - b.status,
      width:200,
    },
    {
      title: i18next.t('created_at'),
      key: 'createdAt',
      dataIndex: 'createdAt',
      width:200,
      sorter: (a,b) => a.createdAt.localeCompare(b.createdAt),
    },
    {
      title: i18next.t('action'),
      key: 'action'
    }
  ]

  const onGetListContact = () => {
    const params = {
      page,
      size: 1000
    }
    setLoading(true)
    return contactApis
      .getListContacts(params)
      .then(({ count, rows }) => {
        if (page > 1 && rows.length === 0) {
          setPage(1)
        } else {
          setCountListContacts(count)
          setListContacts(rows)
        }
      })
      .catch((error) => {
        console.log(error)
      })
      .then(() => {
        setLoading(false)
      })
  }

  // rowSelection object indicates the need for row selection
const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: IContact[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record: IContact) => ({
      disabled: record.email === 'Disabled User', // Column configuration not to be checked
      name: record.email,
    }),
  };

  

  useEffect(() => {
    onGetListContact()
  }, [])
  return (
    <div className='mt-8'>
      <Title className='mb-3' level={3}>
        {i18next.t('contact_list')}
      </Title>
      <Table
        rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
        columns={columns}
        dataSource={listContacts}
        pagination={{
          current: page,
          position: ['bottomCenter']
        }}
        loading={loading}
      />
    </div>
  )
}

export default Contact
