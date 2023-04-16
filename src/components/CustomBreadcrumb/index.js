import React, { useEffect } from 'react'
import { BreadCrumb } from 'primereact/breadcrumb'
import './index.css'
import { Link, useNavigate } from 'react-router-dom'
import { ReactComponent as Arrow } from '../../svg/rightArrow.svg'

export default function CustomBreadcrumb({ className = '', itemslist }) {
  const home = { icon: 'pi pi-home', url: '/' }
  const navigate = useNavigate()

  return (
    <div className='flex align-items-center mr-3'>
      <button className='customBreadButton' onClick={() => navigate('/')}>
        <i className='pi pi-home'></i>
      </button>
      {itemslist.map((item, idx) => {
        return (
          <div key={idx} className='flex align-items-center'>
            <span className='mx-2'>
              {' '}
              <Arrow />{' '}
            </span>
            <button
              className={`customBreadButton ${className} ${
                idx !== 0 ? 'fontWeighNormal' : ''
              }`}
              onClick={() => navigate(item.url)}
            >
              {item.label}
            </button>
          </div>
        )
      })}
    </div>
    // <BreadCrumb
    //   className={`bg-transparent rm-breadcrumb ${className}`}
    //   model={itemslist}
    //   home={home}
    // />
  )
}
