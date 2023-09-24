import React, { createContext, useContext, useState } from 'react'
import { ChevronLast, ChevronFirst } from 'lucide-react'
import LogoText from '../resources/images/logo/logo_text.svg'
import {
  ContainerOutlined,
  DownOutlined,
  HomeOutlined,
  ProjectOutlined,
  SettingOutlined,
  ShoppingOutlined,
  UpOutlined,
  UserOutlined
} from '@ant-design/icons'
import { MODULE } from '../constants/index'
import i18next from '../locales/i18n'
import { Link } from 'react-router-dom'
import useToggleValue from '../hooks/useToggleValue'
import { useAppSelector } from '../store/app/hook'
import {AiFillCaretDown,AiFillCaretUp} from 'react-icons/ai' 


// type GlobalContent = {
//   expanded: boolean
//   setExpanded:(c: boolean) => boolean
// }
// export const SidebarContext = createContext<GlobalContent>({
//   expanded: false,
//   setExpanded: (c:boolean) => c
// })

// export const useContextTheme = () => useContext(SidebarContext)

const SideBar = () => {
  const menu = [
    {
      name: i18next.t('dashboard'),
      icon: <HomeOutlined />,
      module: MODULE.DASHBOARD,
      link: '/',
      menu: []
    },
    {
      name: i18next.t('product_management'),
      icon: <ShoppingOutlined />,
      module: MODULE.PRODUCT,
      menu: [
        {
          link: '/product/create',
          title: i18next.t('product_create')
        },
        {
          link: '/product',
          title: i18next.t('product_all')
        },
        {
          link: '/product-category',
          title: i18next.t('product_category')
        },
        {
          link: '/product-origin',
          title: i18next.t('product_origin')
        },
        {
          link: '/product-attribute',
          title: i18next.t('product_attribute')
        }
      ]
    },
    {
      name: i18next.t('sale_management'),
      icon: <ProjectOutlined />,
      module: MODULE.ORDER,
      menu: [
        {
          link: '/order-new',
          title: i18next.t('order_new')
        },
        {
          link: '/order',
          title: i18next.t('order_list')
        },
        {
          link: '/sales-statistics',
          title: i18next.t('sales_statistics')
        }
      ]
    },
    {
      name: i18next.t('user'),
      icon: <UserOutlined />,
      module: MODULE.USER,
      menu: [
        {
          link: '/user',
          title: i18next.t('user')
        },
        {
          link: '/user-bonus',
          title: 'Phần thưởng'
        },
        {
          link: '/contact',
          title: 'Liên hệ'
        }
      ]
    },
    {
      name: i18next.t('news_management'),
      icon: <ContainerOutlined size={20} />,
      module: MODULE.NEWS,
      menu: [
        {
          link: '/news/create',
          title: i18next.t('news_create')
        },
        {
          link: '/news',
          title: i18next.t('news_all')
        }
      ]
    },
    {
      name: i18next.t('config'),
      icon: <SettingOutlined />,
      module: MODULE.CONFIG,
      menu: [
        {
          link: '/config-data',
          title: i18next.t('config_data')
        },
        {
          link: '/config-page',
          title: i18next.t('config_page')
        },
        {
          link: '/config-role',
          title: i18next.t('config_role')
        },
        {
          link: '/config-level',
          title: i18next.t('config_level')
        },
        {
          link: '/config-commission',
          title: i18next.t('config_commission')
        }
      ]
    }
    // {
    //   name: i18next.t("contact"),
    //   module: MODULE.CONTACT,
    //   icon: <UserSwitchOutlined />,
    //   link: "/contact",
    //   menu: [],
    // },
  ]
  
  const {dropdown: expanded} = useAppSelector(state => state.common)

  return (
    <aside className={`h-full ${!expanded ? 'w-[100px]' : 'w-[260px]'}`}>
      <nav className='h-screen w-full flex-col dark:bg-[#343a40] border-r shadow-sm'>
        <div className='p-4 pb-2 flex justify-between items-center mb-4'>
          <img src={LogoText} className={`overflow-hidden transition-all ${expanded ? 'w-24' : 'hidden'}`} alt='' />
        </div>

        
          <ul className='flex-1 px-3'>
            {menu.map((item) => (
              <SidebarItem key={item.name} icon={item.icon} text={item.name} link={item.link} menu={item.menu} active />
            ))}
          </ul>
        
      </nav>
    </aside>
  )
}

export function SidebarItem({
  icon,
  text,
  active,
  alert,
  link,
  menu
}: {
  icon: React.ReactNode
  text: string
  active?: boolean
  alert?: boolean
  link?: string
  menu: { link: string; title: string }[] | null
}) {
  const {dropdown: expanded} = useAppSelector(state => state.common)
  const { value, handleToggleValue } = useToggleValue()
  return (
    <>
      <li
        className={`
        relative flex  items-center justify-center py-3 px-4 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group text-lg dark:hover:bg-gray-400 dark:hover:bg-opacity-25
        ${active ? 'bg-gradient-to-tr text-indigo-800' : 'hover:bg-indigo-50 text-gray-600'}
    `}
        onClick={() => handleToggleValue()}
      >
        <span className='text-black group-hover:text-red-400 dark:text-white group-hover:dark:text-white'>{icon}</span>
        <span className={`overflow-hidden transition-all text-lg group-hover:text-red-400 group-hover:dark:text-white text-black dark:text-white ${expanded ? 'w-52 ml-3' : 'hidden'}`}>
          {link ? <Link to={link}>{text}</Link> : text}
        </span>
        {alert && <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? '' : 'top-2'}`} />}

        {!expanded && (
          <div
            className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-indigo-100 text-indigo-800 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
          >
            {text}
          </div>
        )}
        {menu?.length !== 0 && expanded && (
          <>
            {value ? (
              <AiFillCaretUp className='text-gray-500' size={20} style={{ fontSize: '10px' }} />
            ) : (
              <AiFillCaretDown className='text-gray-500' size={20} style={{ fontSize: '10px' }} />
            )}
          </>
        )}
      </li>
      <ul className='ml-6 flex-col items-center justify-center gap-2 flex-1 transition-all'>
        {value && expanded && menu &&
          menu.map((m) => (
            <li key={m.link} className='py-3 rounded-md text-left pl-5 hover:text-red-400'>
              <Link to={m.link}>{m.title}</Link>
            </li>
          ))}
      </ul>
    </>
  )
}

export default SideBar
