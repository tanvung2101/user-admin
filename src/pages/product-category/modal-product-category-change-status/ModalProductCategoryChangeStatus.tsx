import { Button, Modal, Space } from 'antd'
import i18next from '../../../locales/i18n'
import { Ref, forwardRef, useImperativeHandle, useState } from 'react'
import { GLOBAL_STATUS } from '../../../constants/index'
import { IProductCategory } from '../../..//interface/productCategory.interface'
import productCategoryApis from '../../../apis/productCategoryApis'

interface RefObject {
  onOpen: (id:number, status:IProductCategory) => void
}

const ModalProductCategoryChangeStatus = (
  { onAfterChangeStatus }: { onAfterChangeStatus: () => void },
  ref: React.Ref<RefObject>) => {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [idProductCategory, setIdProductCategory] = useState<number>(0)
  const [statusProductCategory, setStatusProductCategory] = useState<number | null>(null)
  const onOpen = (id: number, item: IProductCategory) => {
    if (id && item) {
      setVisible(true)
      setStatusProductCategory(item.status)
      setIdProductCategory(id)
    }
  }

  useImperativeHandle(ref, () => ({
    onOpen
  }))

  const onClose = () => {
    setVisible(false)
    setLoading(false)
    setIdProductCategory(0)
    setStatusProductCategory(null)
  }
  const handleOk = () => {
    setVisible(false)
  }
  const submitProductChangeStatus = () => {
    setLoading(true)
    const body = {
      id: idProductCategory,
      status: statusProductCategory === GLOBAL_STATUS.ACTIVE ? GLOBAL_STATUS.INACTIVE : GLOBAL_STATUS.ACTIVE
    }
    return productCategoryApis
      .updateStatusCategory(body)
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
          {statusProductCategory === GLOBAL_STATUS.ACTIVE && (
            <p>
              {i18next.t('category_status_new')}: {i18next.t('off')}
            </p>
          )}
          {statusProductCategory === GLOBAL_STATUS.INACTIVE && (
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

export default forwardRef(ModalProductCategoryChangeStatus)
