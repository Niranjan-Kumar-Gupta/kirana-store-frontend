import './index.css'
import { useNavigate } from 'react-router-dom'
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
              className={`customBreadButton ${
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
  )
}
