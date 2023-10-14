import { Button, Modal, Space } from 'antd'
import i18next from '../../../locales/i18n'
import { Ref, forwardRef, useImperativeHandle, useState } from 'react'
import { GLOBAL_STATUS } from '../../../constants/index'
import { IOrder } from '../../../interface/order.interface'
import orderApis from '../../..//apis/orderApis'
import { toast } from 'react-toastify'

interface RefObject {
  onOpen: (id: number, status: number, record: IOrder) => void
}

const ModalOrderChangeStatus = (
  { onAfterChangeStatus }: { onAfterChangeStatus: () => void },
  ref: React.Ref<RefObject>
) => {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const [order, setOrder] = useState<
    {
      quantity: number
      productId: number
      subProductId: number
    }[]
  >([])
  const [idOrder, setIdOrder] = useState<number>(0)
  const [statusOrder, setStatusOrder] = useState<number | null>(null)
  console.log(idOrder, statusOrder)
  const onOpen = (id: number, status: number, record: IOrder) => {
    if (id && status) {
      setVisible(true)
      setStatusOrder(status)
      setIdOrder(id)
      const order = record.orderItem.map((e) => ({
        quantity: e.quantity,
        productId: e.productId,
        subProductId: e.subProductId
      }))
      setOrder(order)
    }
  }

  useImperativeHandle(ref, () => ({
    onOpen
  }))

  const onClose = () => {
    setVisible(false)
    setLoading(false)
    setIdOrder(0)
    setStatusOrder(null)
  }
  const handleOk = () => {
    setVisible(false)
  }
    const submitOrderChangeStatus = () => {
      setLoading(true)
      if(statusOrder === null) return 
      const body = {
        status: statusOrder,
        productDetail: order
      }
      return orderApis
        .updateOrder(idOrder, body)
        .then(() => {
          // successHelper(t('update_success'))
          toast.success(i18next.t('update_success'))
          onClose()
          onAfterChangeStatus()
        })
        .catch((err) => {
          // errorHelper(err)
        })
        .finally(() => setLoading(false))
    }
  return (
    <>
      <Modal footer={null} destroyOnClose maskClosable={false} open={visible} onOk={handleOk} onCancel={onClose}>
        <h3 className='text-center'>{i18next.t('product_change')}</h3>
        <div className='flex items-center justify-center'>
          <Space>
            <Button
              className='m-1 bg-red-500 hover:bg-red-400'
              htmlType='submit'
              type='primary'
              loading={loading}
                onClick={() => submitOrderChangeStatus()}
            >
              {i18next.t('confirm')}
            </Button>
            <Button className='m-1' htmlType='submit' loading={loading} onClick={() => onClose()}>
              {i18next.t('close')}
            </Button>
          </Space>
        </div>
      </Modal>
    </>
  )
}

export default forwardRef(ModalOrderChangeStatus)
