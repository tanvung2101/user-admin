import { IListPagingConfigData, IMasterLevel } from '../interface/configData.interface'
import axiosClient from './axiosClient'

const configDataApis = {
  getListPagingConfigData: (params: {
    idMaster: number | number[]
    page: number
    size?: number
  }): Promise<IListPagingConfigData> => axiosClient.get('/api/master/', { params }),
  getAllConfigData: (params: { idMaster: number | number[]; id?: number }): Promise<IMasterLevel[]> =>
    axiosClient.get('/api/master/get-master', { params }),
  createConfigData: (payload: { name: string; nameMaster: string; note?: string }): Promise<boolean> =>
    axiosClient.post('/api/master/new-master', payload),
  updateConfigData: (payload: IMasterLevel): Promise<boolean> => axiosClient.put('/api/master/update-master', payload)
}

export default configDataApis
