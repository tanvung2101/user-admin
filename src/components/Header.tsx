import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Avatar, Dropdown, Space } from 'antd'
import i18next from '../locales/i18n'
import { useAppSelector, useAppDispatch } from '../store/app/hook'
import { changeTheme, changeDropdown } from '../store/slices/commonSlice'
import { AiOutlineMenu } from 'react-icons/ai'
import { MODE_THEME } from '../constants/index'
import { storage } from '../utils/storage'
import { STORAGE_KEY } from '../constants/storage-key'
import { logout } from '../store/slices/accountSlice'

const Header = () => {
  const theme = useAppSelector((state) => state.common.theme)
  const {dropdown: expanded} = useAppSelector(state => state.common)
  const dispatch = useAppDispatch()
  const handleDropdow = () => {
    const newExpanded = expanded === true ? false : true
    dispatch(changeDropdown(newExpanded))
  }
  const handleTheme = () => {
    const newTheme =
      theme === MODE_THEME.LIGHT ? MODE_THEME.DARK : MODE_THEME.LIGHT;
    dispatch(changeTheme(newTheme));
  }
  // console.log(theme)
  const onClick: MenuProps['onClick'] = ({ key }) => {
    if(key === 'logout'){
      storage.clear(STORAGE_KEY.TOKEN)
      storage.clear(STORAGE_KEY.INFO)
      dispatch(logout())
    }
  }
  const items: MenuProps['items'] = [
    {
      key: 'logout',
      label: i18next.t('logout'),
      icon: <LogoutOutlined />
    }
  ]
  return (
    <div className='min-h-[60px] flex items-center justify-between'>
      <div className='text-lg cursor-pointer' onClick={() => handleDropdow()}>
        <AiOutlineMenu size={25} className='text-black hover:text-red-500 dark:text-white dark:hover:text-red-500' />
      </div>
      <div className='flex items-center gap-5'>
        <div
          onClick={handleTheme}
          className={`w-[55px] h-[24px] ${
            theme === 'light' ? 'bg-red-500' : 'bg-black'
          } rounded-full flex items-center justify-between py-2 px-1 relative cursor-pointer`}
        >
          <div className={`text-xs font-normal ${theme === 'dark' && 'text-black'}`}>Sáng</div>
          <div className='text-xs dark:text-white'>Tối</div>
          <div
            style={theme === 'light' ? { right: '2px' } : { left: '2px' }}
            className='w-5 h-5 rounded-full bg-white !absolute'
          ></div>
        </div>
        <Dropdown menu={{ items, onClick }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <Avatar style={{ backgroundColor: '#888888' }} icon={<UserOutlined />} />
            </Space>
          </a>
        </Dropdown>
      </div>
    </div>
  )
}

export default Header
