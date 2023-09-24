import { Button, Modal, Space } from 'antd'
import i18next from '../../../locales/i18n'
import { Ref, forwardRef, useImperativeHandle, useState } from 'react'
import { GLOBAL_STATUS } from '../../../constants/index'
import { IProduct } from '../../../interface/product.interface'
import productApis from '../../../apis/productApis'

interface RefObject {
  onOpen: (id:number, status:IProduct) => void
}

const ModalProductChangeStatus = (
  { onAfterChangeStatus }: { onAfterChangeStatus: () => void },
  ref: React.Ref<RefObject>) => {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [idProduct, setIdProduct] = useState<number>(0)
  const [statusProduct, setStatusProduct] = useState<number | null>(null)
  const onOpen = (id: number, item: IProduct) => {
    if (id && item) {
      setVisible(true)
      setStatusProduct(item.status)
      setIdProduct(id)
    }
  }

  useImperativeHandle(ref, () => ({
    onOpen
  }))

  const onClose = () => {
    setVisible(false)
    setLoading(false)
    setIdProduct(0)
    setStatusProduct(null)
  }
  const handleOk = () => {
    setVisible(false)
  }
  const submitProductChangeStatus = () => {
    setLoading(true)
    const body = {
      id: idProduct,
      status: statusProduct === GLOBAL_STATUS.ACTIVE ? GLOBAL_STATUS.INACTIVE : GLOBAL_STATUS.ACTIVE
    }
    return productApis
      .changeStatusProduct(body)
      .then(() => {
        // successHelper(t('update_success'))
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
        <label className='flex justify-content-center justify-center mb-3'>
          {statusProduct === GLOBAL_STATUS.ACTIVE && (
            <p>
              {i18next.t('category_status_new')}: {i18next.t('off')}
            </p>
          )}
          {statusProduct === GLOBAL_STATUS.INACTIVE && (
            <p>
              {i18next.t('category_status_new')}: {i18next.t('on')}
            </p>
          )}
        </label>
        <div className='flex items-center justify-center'>
          <Space>
            <Button
              className='m-1 bg-red-500 hover:bg-red-400'
              htmlType='submit'
              type='primary'
              loading={loading}
              onClick={() => submitProductChangeStatus()}
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

export default forwardRef(ModalProductChangeStatus)
