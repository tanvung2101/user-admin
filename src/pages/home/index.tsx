import { ScanOutlined, ShoppingCartOutlined, TeamOutlined } from '@ant-design/icons'
import { Card, Col, Divider, Row } from 'antd'
import Meta from 'antd/es/card/Meta'
import React, { useEffect, useState } from 'react'
import { ChatLineSumYear } from './chatLineSumYear'
import { ChartBarUser } from './chartBarUser'
import { ChatLineSumThisMonth } from './chartLineSumThisMonth'
import moment from 'moment'
import orderApis from '../../apis/orderApis'
import configDataApis from '../..//apis/configDataApis'
import { MASTER_DATA_NAME } from '../../constants/index'
import { Order } from '../../interface'
import userApis from '../../apis/userApis'
import { IListUser, ITopReferrer } from '../../interface/user.interface'
import { IMasterLevel } from '../..//interface/configData.interface'

const style: React.CSSProperties = { background: '#0092ff', padding: '8px 0' }

const HomePage = () => {
  const [data, setData] = useState<ITopReferrer[]>([])
  // console.log('data', data)
  const appendData = async () => {
    const topReferrer = await userApis.getTopReferrer()
    setData(topReferrer)
  }
  const [masterLevelUser, setMasterLevelUser] = useState<IMasterLevel[]>([])
  const [listLevelUser, setListLevelUser] = useState<{type:string, value: number}[]>([]);
  const [listOrderThisMonth, setListOrderThisMonth] = useState([])
  const [listOrderLastMonth, setListOrderLastMonth] = useState([])
  const [listOrderThisYear, setListOrderThisYear] = useState([])
  const [totalThisMonth, setTotalThisMonth] = useState(0)
  const [totalLastMonth, setTotalLastMonth] = useState(0)
  const [totalThisYear, setTotalThisYaer] = useState(0)

  console.log('listOrderThisYear', listOrderThisYear)
  const fetchMasterData = async () => {
    const masterLevel = await configDataApis.getAllConfigData({
      idMaster: MASTER_DATA_NAME.LEVEL_USER
    })
    setMasterLevelUser(masterLevel)
  }
  const fetchListUser = async () => {
    const getListLevel: {id: number}[] = []
    const setListLevel: {type:string, value: number}[] = []
    try {
      const fetchUser = await userApis.getListUser({ size: 10000 });

      masterLevelUser?.map((master) => {
        fetchUser?.rows.map((user) => {
          if (master.id === user.level) {
            getListLevel.push({
              id: master.id,
            });
          }
        });
      });
     
      masterLevelUser?.map((master) => {
        const countLevel = getListLevel.filter(
          (level) => level.id === master.id
        );
        setListLevel.push({
          type: master.name,
          value: countLevel.length,
        });
      });
      console.log(setListLevel)
      setListLevelUser(setListLevel);
    } catch (e) {
      // setInactiveHome(true)
    }
  }

  const fetchOrderListSuccess = async () => {
    try {
      let date = new Date()
      let firstDayOfThisMonth = new Date(date.getFullYear(), date.getMonth(), 1)
      let lastDayOfThisMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      let firstDayOfLastMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1)
      let lastDayOfLastMonth = new Date(date.getFullYear(), date.getMonth(), 1)
      let firstDayOfThisYear = new Date(date.getFullYear(), 0, 1)
      let lastDayOfThisYear = new Date(date.getFullYear(), 11, 31)
      console.log(firstDayOfThisMonth)
      const orderThisMonth = await orderApis.getListOrders({
        status: 4,
        startDate: moment(firstDayOfThisMonth).format('YYYY-MM-DD HH:mm:ss'),
        endDate: moment(lastDayOfThisMonth).format('YYYY-MM-DD HH:mm:ss')
      })
      const orderThisLastMonth = await orderApis.getListOrders({
        status: 4,
        startDate: moment(firstDayOfLastMonth).format('YYYY-MM-DD HH:mm:ss'),
        endDate: moment(lastDayOfLastMonth).format('YYYY-MM-DD HH:mm:ss')
      })
      const orderThisYear = await orderApis.getListOrders({
        status: 4,
        startDate: moment(firstDayOfThisYear).format('YYYY-MM-DD HH:mm:ss'),
        endDate: moment(lastDayOfThisYear).format('YYYY-MM-DD HH:mm:ss')
      })
      setListOrderThisMonth(orderThisMonth)
      setListOrderLastMonth(orderThisLastMonth)
      setListOrderThisYear(orderThisYear)
      console.log('orderThisYear', orderThisYear)
      setTotalThisMonth(orderThisMonth?.reduce((sum, order: Order) => (sum = +sum + +order.total), 0))
      setTotalLastMonth(orderThisLastMonth.reduce((sum, order: Order) => (sum = sum + order.total), 0))
      setTotalThisYaer(orderThisYear.reduce((sum, order: Order) => (sum = sum + order.total), 0))
    } catch (error) {}
  }
  useEffect(() => {
    fetchMasterData()
    appendData()
  }, [])

  useEffect(() => {
    fetchOrderListSuccess()
    fetchListUser()
  }, [masterLevelUser])
  // console.log(listOrderThisMonth)
  return (
    <>
      <div className='mt-10 mb-14'>
        <Row className='gutter-row mb-3' gutter={24}>
          <Col className='gutter-row' xs={24} sm={12} md={12} lg={8}>
            <Card bordered={false} style={{ backgroundColor: '#ffc53d', borderRadius: '20px' }}>
              <Meta
                avatar={<ShoppingCartOutlined size={44} />}
                title={`${totalLastMonth}đ`}
                description='Tổng doanh thu tháng trước'
              />
            </Card>
          </Col>
          <Col className='gutter-row mb-3' xs={24} sm={12} md={12} lg={8}>
            <Card bordered={false} style={{ backgroundColor: '#bae637', borderRadius: '20px' }}>
              <Meta avatar={<ScanOutlined />} title={`${totalThisMonth} đ`} description='Tổng doanh thu tháng này' />
            </Card>
          </Col>
          <Col className='gutter-row mb-3' xs={24} sm={12} md={12} lg={8}>
            <Card bordered={false} style={{ backgroundColor: '#36cfc9', borderRadius: '20px' }}>
              <Meta avatar={<TeamOutlined />} title={`${totalThisYear}đ`} description='Tổng doanh thu cả năm' />
            </Card>
          </Col>
        </Row>
        <Row gutter={24} className='mb-3'>
          <Col className='gutter-row' xs={24} sm={24} md={24} lg={24}>
            <Card bordered={false} style={{ borderRadius: '20px' }}>
              <Divider>
                <Meta title='Sơ đồ thống kê doanh thu trong tháng' style={{ textAlign: 'center' }} />
              </Divider>
              <ChatLineSumThisMonth dataThisMonth={listOrderThisMonth} />
            </Card>
          </Col>
        </Row>
        <Row gutter={24} className='mb-3'>
          <Col className='gutter-row' xs={24} sm={24} md={24} lg={24}>
            <Card bordered={false} style={{ borderRadius: '20px' }} title='Top 10 User có lượng giới thiệu lớn nhất'>
              <div className='w-full h-[350px] overflow-y-auto user_top pr-2'>
                {!!data &&
                  data.map((item) => (
                    <div key={item.id} className='flex items-start justify-between my-5'>
                      <div className='flex items-center justify-center gap-4'>
                        <div className='w-9 h-9 rounded-full'>
                          <img
                            src={item.userInformation.avatar}
                            className='w-full h-full rounded-full object-fill'
                          />
                        </div>
                        <div className='flex flex-col items-start'>
                          <h4 className='font-medium text-base'>{item.userInformation.fullName}</h4>
                          <span className='text-slate-600 text-opacity-50'>{item.email}</span>
                        </div>
                      </div>
                      <div>Tổng giới thiệu: {item.userReferrer.length} người</div>
                    </div>
                  ))}
              </div>
            </Card>
          </Col>
        </Row>
        <Row gutter={24} className='mb-3'>
          <Col className='gutter-row' xs={24} sm={12} md={12} lg={12}>
            <Card bordered={false} style={{ borderRadius: '20px' }}>
              <Divider>
                <Meta title='Danh sách cấp bậc người dùng' style={{ textAlign: 'center' }} />
              </Divider>
              {listLevelUser.length > 0 && <ChartBarUser listLevelUser={listLevelUser}/>}
            </Card>
          </Col>
          <Col className='gutter-row' xs={24} sm={12} md={12} lg={12}>
            <Card bordered={false} style={{ borderRadius: '20px' }}>
              <Divider>
                <Meta title='Sơ đồ thống kê tổng doanh thu' style={{ textAlign: 'center' }} />
              </Divider>
              <ChatLineSumYear dataThisYear={listOrderThisYear}/>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default HomePage
