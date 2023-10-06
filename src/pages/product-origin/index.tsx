import { Button, Card, Col, Row, Space, Table, Tag, Tooltip, Typography } from 'antd'
import i18next from '../../locales/i18n'
import OriginCreate from './origin-create'
import { ColumnsType } from 'antd/es/table'
import { MASTER_DATA_NAME } from '../../constants/index'
import { useCallback, useEffect, useRef, useState } from 'react'
import configDataApis from '../../apis/configDataApis'
import { IMasterLevel } from '../../interface/configData.interface'
import { EditOutlined } from '@ant-design/icons'
import ModalConfigDataUpdate from '../config-data/modal-cofig-data-update/index'

const { Title } = Typography

interface RefObject {
  onOpen: () => void
}

const ProductOrigin = () => {
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [listConfigData, setListConfigData] = useState<IMasterLevel[]>([])
  const [countConfigData, setCountConfigData] = useState<number>()
  const refModalConfigDataUpdate = useRef<any>()
  const columns: ColumnsType<IMasterLevel> = [
    {
      title: i18next.t('name'),
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Tooltip title={i18next.t('update') + ': ' + text}>{text}</Tooltip>,
      width: 200
    },
    {
      title: i18next.t('note'),
      dataIndex: 'note',
      key: 'note',
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      width: 200
    },
    {
      title: i18next.t('action'),
      dataIndex: 'status',
      key: 'status',
      render: (value, record) => {
        // console.log(record)
        return (
          <Space>
            <Tooltip title={i18next.t('update')}>
              <Button
                shape='round'
                className='mx-1'
                size='small'
                icon={<EditOutlined />}
                onClick={() => refModalConfigDataUpdate.current.onOpen(record)}
              ></Button>
            </Tooltip>
          </Space>
        )
      },
      fixed: 'right',
      width: 100
    }
  ]

  const onGetListCofigData = useCallback(async () => {
    console.log('hellll')
    const params = {
      idMaster: MASTER_DATA_NAME.ORIGIN,
      page,
      size: 1000
    }
    setLoading(true);
    return configDataApis
      .getListPagingConfigData(params)
      .then(({ count, rows }) => {
        if (page > 1 && rows.length === 0) {
          setPage(1)
        } else {
          setListConfigData(rows)
          setCountConfigData(count)
        }
        window.scroll({
          top:0,
          behavior:"smooth"
        })
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setLoading(false)
      })
  },[page])

 
  useEffect(() => {
    onGetListCofigData()
  }, [onGetListCofigData])
  return (
    <>
      <Row gutter={[24, 12]} className='mb-3'>
        <Col md={12} sm={12} xs={24}>
          <Title level={3}>{i18next.t('product_origin')}</Title>
        </Col>
      </Row>
      <Row gutter={[24, 12]} className='mb-3'>
        <Col md={12} sm={12} xs={24}>
          <Card title='Thêm nhà sản xuất'>
            <OriginCreate fetchList={onGetListCofigData}/>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Table columns={columns} dataSource={listConfigData} loading={loading} rowKey='id' pagination={false}></Table>
        </Col>
      </Row>
      <ModalConfigDataUpdate ref={refModalConfigDataUpdate} onAfterUpdate={() => onGetListCofigData()}/>
    </>
  )
}

export default ProductOrigin
