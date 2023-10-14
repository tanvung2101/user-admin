import { ChatLineSumYear } from '../home/chatLineSumYear'
import { Card, Col, Divider, Row } from 'antd'
import Meta from 'antd/es/card/Meta'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import orderApis from '../../apis/orderApis'
import { IMasterLevel } from '../../interface/configData.interface'
import { ChatLineSumThisMonth } from '../home/chartLineSumThisMonth'

const SalesStatistics = () => {
  const [listOrderThisYear, setListOrderThisYear] = useState([])

  const [listOrderThisMonth, setListOrderThisMonth] = useState([])

  const fetchOrderListSuccess = async () => {
    try {
      let date = new Date()

      let firstDayOfThisMonth = new Date(date.getFullYear(), date.getMonth(), 1)
      let lastDayOfThisMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)

      let firstDayOfThisYear = new Date(date.getFullYear(), 0, 1)
      let lastDayOfThisYear = new Date(date.getFullYear(), 11, 31)

      const orderThisMonth = await orderApis.getListOrders({
        status: 4,
        startDate: moment(firstDayOfThisMonth).format('YYYY-MM-DD HH:mm:ss'),
        endDate: moment(lastDayOfThisMonth).format('YYYY-MM-DD HH:mm:ss')
      })

      const orderThisYear = await orderApis.getListOrders({
        status: 4,
        startDate: moment(firstDayOfThisYear).format('YYYY-MM-DD HH:mm:ss'),
        endDate: moment(lastDayOfThisYear).format('YYYY-MM-DD HH:mm:ss')
      })

      setListOrderThisYear(orderThisYear)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchOrderListSuccess()
  }, [])

  return (
    <>
      <div className='mt-10 mb-14 flex items-center justify-center'>
        <Row gutter={24} className='mb-3 flex items-center gap-5'>
          <Col className='gutter-row' xs={24} sm={12} md={24} lg={24}>
            <Card bordered={false} style={{ borderRadius: '20px' }}>
              <Divider>
                <Meta title='Sơ đồ thống kê tổng doanh thu' style={{ textAlign: 'center' }} />
              </Divider>
              <ChatLineSumYear dataThisYear={listOrderThisYear} />
            </Card>
          </Col>

          <Col className='gutter-row' xs={24} sm={24} md={24} lg={24}>
            <Card bordered={false} style={{ borderRadius: '20px' }}>
              <Divider>
                <Meta title='Sơ đồ thống kê doanh thu trong tháng' style={{ textAlign: 'center' }} />
              </Divider>
              <ChatLineSumThisMonth dataThisMonth={listOrderThisMonth} />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default SalesStatistics
