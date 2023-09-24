import { IMasterLevel } from '../interface/configData.interface'
import axiosClient from './axiosClient'

const configDataApis = {
  getAllConfigData: (params: {
    idMaster: number
  }): Promise<
  IMasterLevel[]
  > => axiosClient.get('/api/master/get-master', { params })
}

export default configDataApis
