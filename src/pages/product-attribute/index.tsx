import { Button, Card, Col, Row, Space, Table, Tooltip, Typography } from 'antd'
import i18next from '../../locales/i18n'
import CreateElement from './CreateElement'
import { MASTER_DATA, MASTER_DATA_NAME } from '../../constants'
import { ColumnsType } from 'antd/es/table'
import { useCallback, useEffect, useRef, useState } from 'react'
import configDataApis from '../../apis/configDataApis'
import { IMasterLevel } from '../../interface/configData.interface'
import { EditOutlined } from '@ant-design/icons'
import ModalCofigDataUpdate from '../config-data/modal-cofig-data-update/index'

const { Title } = Typography

type listConfigData = {
  idMaster?: number
  nameMaster?: string
  childrenMaster?: IMasterLevel[]
}

const ProductAttribute = () => {
  const [loading, setLoading] = useState(false)
  const [listConfigData, setListConfigData] = useState<listConfigData[]>([])
  const [countConfigData, setCountConfigData] = useState<number>()
  const [page, setPage] = useState(1)
  const refModalConfigDataUpdate = useRef<any>()
  const expandedRowRender = (row: listConfigData) => {
    const columns: ColumnsType<IMasterLevel> = [
      {
        title: i18next.t('name'),
        dataIndex: 'name',
        key: 'name',
        render: (value) => <Tooltip title={`${i18next.t('update')}: ${value}`}>{value}</Tooltip>,
        width: 200
      },
      {
        title: i18next.t('note'),
        dataIndex: 'note',
        key: 'note',
        render: (value) => <Tooltip title={value}>{value}</Tooltip>,
        width: 200
      },
      {
        title: i18next.t('action'),
        dataIndex: 'status',
        key: 'status',
        render: (_, record) => (
          <Space>
            <Tooltip title={i18next.t('update')}>
              <Button shape='round' className='mx-1 bg-red-500' size='small' icon={<EditOutlined />} onClick={() => refModalConfigDataUpdate.current.onOpen(record)}></Button>
            </Tooltip>
          </Space>
        )
      }
    ]

    return (
      <Table
        rowKey='id'
        columns={columns}
        dataSource={row.childrenMaster?.sort((a, b) => b.id - a.id)}
        pagination={false}
      ></Table>
    )
  }

  const columns: ColumnsType<listConfigData> = [
    {
      title: i18next.t('product_attribute'),
      dataIndex: 'nameMaster',
      key: 'nameMaster'
    }
  ]

  const onGetListCofigData = useCallback(async () => {
    const params = {
      idMaster: [MASTER_DATA_NAME.UNIT_PRODUCT, MASTER_DATA_NAME.CAPACITY_PRODUCT],
      page,
      size: 1000
    }
    setLoading(true)
    return configDataApis
      .getListPagingConfigData(params)
      .then(({ count, rows }) => {
        console.log(rows)
        if (page > 1 && rows.length === 0) {
          setPage(1)
        } else {
          setCountConfigData(count)
          const array = MASTER_DATA.map((md) => {
            if (rows.filter((row) => row.idMaster === md.value).length > 0) {
              return {
                idMaster: md.value,
                nameMaster: md.nameMaster,
                childrenMaster: rows.filter((row) => row.idMaster === md.value)
              }
            }
          }).filter((e) => e)
          if (array.length > 0) {
            setListConfigData(
              array.map((e) => ({
                idMaster: e?.idMaster,
                nameMaster: e?.nameMaster,
                childrenMaster: e?.childrenMaster
              }))
            )
          }
        }
        window.scroll({
          top: 0,
          behavior: 'smooth'
        })
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [page])

  useEffect(() => {
    onGetListCofigData()
  }, [])
  return (
    <>
      <Row gutter={[24, 12]} className='mb-3'>
        <Col md={12} sm={12} xs={24}>
          <Title level={3}>{i18next.t('product_attribute')}</Title>
        </Col>
      </Row>
      <Row gutter={[24, 12]} className='mb-3'>
        <Col md={12} sm={12} xs={24}>
          <Card title='Thêm thuộc tính'>
            <CreateElement />
          </Card>
        </Col>
        <Col md={12} sm={12} xs={24}>
          <Table
            columns={columns}
            rowKey='idMaster'
            dataSource={listConfigData}
            expandable={{
              defaultExpandedRowKeys: [MASTER_DATA_NAME.UNIT_PRODUCT, MASTER_DATA_NAME.CAPACITY_PRODUCT],
              expandedRowRender,
              expandRowByClick: true
            }}
            pagination={false}
            loading={loading}
          ></Table>
        </Col>
        <ModalCofigDataUpdate onAfterUpdate={() => onGetListCofigData()} ref={refModalConfigDataUpdate}/>
      </Row>
    </>
  )
}

export default ProductAttribute
