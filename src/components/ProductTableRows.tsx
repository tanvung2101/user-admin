import { DeleteOutlined } from '@ant-design/icons'
import { Button, Input, Popconfirm, Select, Space } from 'antd'

import type { SelectProps } from 'antd'
import { useEffect, useState } from 'react'
import configDataApis from '../apis/configDataApis'
import { MASTER_DATA_NAME } from '../constants/index'

const ProductTableRows = ({
  rowsData,
  deleteTableRows,
  handleChangeTableRowsCombobox,
  handleChangeTableRows
}: {
  rowsData: {
    price: number
    quantity: number
    unitId: number
    capacityId: number
  }[]
  deleteTableRows: (index: number) => void
  handleChangeTableRowsCombobox: (index: number, type: string, val: number) => void
  handleChangeTableRows: (index: number, name:string , value:number) => void
}) => {
//   console.log(rowsData)
  const [masterUnit, setMasterUnit] = useState<{ id: number; unit: string }[]>([])
  const [masterCapacity, setMasterCapacity] = useState<{ id: number; capacity: string }[]>([])

  const fetchMasterData = async () => {
    const fetchMasterCapacity = await configDataApis.getAllConfigData({
      idMaster: MASTER_DATA_NAME.CAPACITY_PRODUCT
    })
    const fetchMasterUnit = await configDataApis.getAllConfigData({
      idMaster: MASTER_DATA_NAME.UNIT_PRODUCT
    })
    setMasterCapacity(fetchMasterCapacity.map((item) => ({ id: item.id, capacity: item.name })))
    setMasterUnit(fetchMasterUnit.map((item) => ({ id: item.id, unit: item.name })))
  }

  useEffect(() => {
    fetchMasterData()
  }, [])
  return (
    <>
      {rowsData.map((item, index) => {
        const { price, capacityId, quantity, unitId } = item
        return (
          <tr key={index}>
            <td>
              <Input
                // value={price}
                placeholder='Giá bán'
                name='price'
                maxLength={10}
                suffix='đ'
                onChange={(e) => {
                    // console.log(e.target.value)
                  if (!+e.target.value) return
                  return handleChangeTableRows(index, e.target.name, +e.target.value)
                }}
              />
            </td>
            <td>
              <Input
                // value={quantity}
                placeholder='Số lượng'
                name='quantity'
                maxLength={5}
                onChange={(e) => {
                    if (!+e.target.value) return
                    return handleChangeTableRows(index, e.target.name, +e.target.value)
                  }}
              />
            </td>
            <td>
              <Space>
                <Select
                  showSearch
                  optionFilterProp='children'
                  value={capacityId}
                  onChange={(val: number) => handleChangeTableRowsCombobox(index, 'capacityId', val)}
                  style={{ width: 200 }}
                  options={masterCapacity.map((item) => ({
                    value: item.id,
                    label: item.capacity
                  }))}
                />
                <Select
                  showSearch
                  optionFilterProp='children'
                  value={unitId}
                  onChange={(val: number) => handleChangeTableRowsCombobox(index, 'unitId', val)}
                  style={{ width: 100 }}
                  options={masterUnit.map((item) => ({
                    value: item.id,
                    label: item.unit
                  }))}
                />
              </Space>
            </td>
            <td>
              <Popconfirm title='Sure to delete?' onConfirm={() => deleteTableRows(index)}>
                <Button icon={<DeleteOutlined />}></Button>
              </Popconfirm>
            </td>
          </tr>
        )
      })}
    </>
  )
}

export default ProductTableRows
