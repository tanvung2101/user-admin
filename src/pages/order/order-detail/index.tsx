import { ArrowLeftOutlined } from '@ant-design/icons'
import { Col, Row } from 'antd'
import { Link } from 'react-router-dom'

const OrderDetail = () => {
  return (
    <Row gutter={[24, 12]} justify='center' align='top' className='mb-16'>
      <Col xs={24} sm={24} md={17} xl={17}>
        <div className='flex items-center justify-start gap-3'>
          <Link to='/order'>
            <ArrowLeftOutlined />
          </Link>
          <span className='text-lg font-semibold'>
            Đơn hàng: <span className='font-light text-base'>#SHESHI000127</span>
          </span>
        </div>
      </Col>
      <Col xs={24} sm={24} md={17} xl={17} className='mt-10'>
        <div className='flex flex-col items-start justify-start gap-1 text-base'>
          <span>
            Hóa đơn: <strong className='text-red-600'>#SHESHI000127</strong>
          </span>
          <span>Đặt ngày 27-09-2023 10:34:19</span>
          <span>Trạng thái đơn hàng: Từ chối</span>
        </div>
      </Col>
      <Col xs={24} sm={24} md={17} xl={17} className='mt-5'>
        <h3 className='text-center text-xl font-semibold mb-8'>Chi tiết đơn hàng</h3>
        <div>
          <Row gutter={[24, 12]} justify='center'>
            <Col xs={24} sm={24} md={6} xl={6}>
              <div className='flex flex-col items-center justify-center gap-2 text-center'>
                <h4 className='font-medium text-base'>Địa chỉ nhận hàng</h4>
                <span>cam le da nang</span>
                <span>Xã Bình Thạnh Đông, Huyện Phú Tân An Giang</span>
                <span>Số điện thoại : 0 9090909098</span>
              </div>
            </Col>
            <Col xs={24} sm={24} md={6} xl={6}>
              <div className='flex flex-col items-center justify-center gap-2 text-center'>
                <h4 className='font-medium text-base'>Đơn giao hàng</h4>
                <span>Giao hàng nhanh</span>
              </div>
            </Col>
            <Col xs={24} sm={24} md={6} xl={6}>
              <div className='flex flex-col items-center justify-center gap-2 text-center'>
                <h4 className='font-medium text-base'>Phương thức thanh toán</h4>
                <span>Thanh toán bằng tiền mặt</span>
              </div>
            </Col>
            <Col xs={24} sm={24} md={6} xl={6}>
              <div className='flex flex-col items-center justify-center gap-2 text-center'>
                <h4 className='font-medium text-base'>Ghi chú</h4>
                <span>Giao hàng nhanh</span>
              </div>
            </Col>
          </Row>
        </div>
      </Col>
      <Col xs={24} sm={24} md={17} xl={17} className='mt-5'>
        <div className='pb-3 border-[1px] border-b-[1px] border-b-gray-500'>
          <Row gutter={[24, 12]} justify={'center'}>
            <Col xs={24} sm={24} md={12} xl={12}>
              <div className='w-full'>
                <h4 className='text-center mb-4 font-bold text-sm uppercase'>Sản phẩm</h4>
                <div className='flex items-start justify-start gap-3'>
                  <div className=''>
                    <img
                      className='w-14 h-16 object-cover'
                      src='https://images.unsplash.com/photo-1696781365046-39779e1f0461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
                    />
                  </div>
                  <div className='flex flex-col items-center justify-center'>
                    <span>Mặt nạ</span>
                    <span>Kích cớ: 30 GR</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={4} xl={4}>
              <div className='w-full flex flex-col items-center justify-center'>
                <h4 className='text-center mb-4 font-bold text-sm uppercase'>SL</h4>
                <span>1</span>
              </div>
            </Col>
            <Col xs={24} sm={24} md={4} xl={4}>
              <div className='w-full flex flex-col items-center justify-center'>
                <h4 className='text-center mb-4 font-bold text-sm uppercase'>giá</h4>
                <span>1</span>
              </div>
            </Col>
            <Col xs={24} sm={24} md={4} xl={4}>
              <div className='w-full flex flex-col items-end justify-center'>
                <h4 className='text-center mb-4 font-bold text-sm uppercase'>tạm tính</h4>
                <p className='text-center'>1</p>
              </div>
            </Col>
          </Row>
          <Row gutter={[24, 12]} justify={'center'}>
            <Col xs={24} sm={24} md={20} xl={20}>
              <div className='flex flex-col items-end justify-end gap-3'>
                <span>Tạm tinh</span>
                <span>Phí vận chuyển</span>
                <span className='font-semibold'>Thành tiền</span>
              </div>
            </Col>
            <Col xs={24} sm={24} md={4} xl={4}>
              <div className='flex flex-col items-end justify-end gap-3'>
                <span>360.000</span>
                <span>39.001</span>
                <span className='font-semibold'>399.001</span>
              </div>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  )
}

export default OrderDetail
