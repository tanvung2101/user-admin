import { Button, Modal, Space } from 'antd'
import i18next from '../../../locales/i18n'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { toast } from 'react-toastify'
import userApis from '../../../apis/userApis'

interface RefObject {
    onOpen: (id: number, level: number, type: number) => void
  }

const ModalUserChangeStatus = ({ onAfterChangeStatus }: { onAfterChangeStatus: () => void },
ref: React.Ref<RefObject>) => {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const [idUser, setIdUser] = useState<number>(0)
  const [type, setType] = useState<number | null>()
  const [statusUser, setStatusUser] = useState<number | null>(null)

  const onOpen = (id: number, level: number, type: number) => {
    if (id && level) {
      setVisible(true)
      setStatusUser(level)
      setIdUser(id)
      setType(type)
    }
  }

  useImperativeHandle(ref, () => ({
    onOpen
  }))

  const onClose = () => {
    setVisible(false)
    setLoading(false)
    setIdUser(0)
    setStatusUser(null)
  }
  const handleOk = () => {
    setVisible(false)
  }
  const submitOrderChangeStatus = () => {
    setLoading(true)
    const body = {
      id:idUser
    }
    return userApis
      .setLevelUser(body)
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
    <Modal footer={null} destroyOnClose maskClosable={false} open={visible} onOk={handleOk} onCancel={onClose}>
      <h3 className='text-center'>{i18next.t('user_status_change')}</h3>
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
  )
}

export default forwardRef(ModalUserChangeStatus)
