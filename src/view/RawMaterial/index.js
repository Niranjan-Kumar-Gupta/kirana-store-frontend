import React, { useState, useEffect, useRef } from 'react'
import CustomSwitch from '../../components/CustomSwitch'
import { CustomButton } from '../../components/CustomButton'
import { useNavigate } from 'react-router-dom'
import RawMaterialHistoryTable from './RawMaterialHistoryTable'
import RawMaterialTable from './RawMaterialTable'
import style from './style.module.css'
import RawMaterialForm from '../../components/Forms/RawMaterialForm'
import { Toast } from 'primereact/toast'

import {
  changeMode,
  resetMode,
  resetSelectedRawMaterial,
} from '../../reducers/rawMaterialSlice'
import { useDispatch, useSelector } from 'react-redux'

const RawMaterial = () => {
  const [showRawMaterialForm, setShowRawMaterialForm] = useState(false)
  const dispatch = useDispatch()
  const toast = useRef(null)

  const switchButtons = [
    { name: 'Raw Material', value: 'rawMaterial' },
    { name: 'History', value: 'rawMaterialHistory' },
  ]
  const navigate = useNavigate()
  const [table, setTable] = useState('rawMaterial')

  const handleSwitch = (item) => {
    //  console.log(item);
    setTable(item)
  }

  const renderTable = (table) => {
    switch (table) {
      case 'rawMaterial':
        return (
          <RawMaterialTable
            setShowRawMaterialForm={setShowRawMaterialForm}
            toast={toast}
          />
        )
      case 'rawMaterialHistory':
        return <RawMaterialHistoryTable />
    }
  }
  const onClickCheckInAndOut = (page) => {
    switch (page) {
      case 'checkIn':
        navigate('checkIn')
        break
      case 'checkOut':
        navigate('checkOut')
        break
    }
  }

  const onAddNewClick = () => {
    dispatch(resetMode())
    dispatch(resetSelectedRawMaterial())
    setShowRawMaterialForm(true)
  }

  const onHide = () => {
    setShowRawMaterialForm(false)
  }

  const rawMaterialModal = () => {
    return (
      <RawMaterialForm
        onHide={onHide}
        showRawMaterialForm={showRawMaterialForm}
        toast={toast}
      />
    )
  }

  return (
    <div className='w-11 pt-3 m-auto'>
      <Toast ref={toast} />
      {showRawMaterialForm ? rawMaterialModal() : <></>}
      <div className='flex flex-wrap mt-4 justify-content-between align-items-center gap-2'>
        <CustomSwitch
          options={switchButtons}
          value={table}
          handleSwitch={handleSwitch}
        />
        <div className='flex flex-wrap justify-content-center align-items-center gap-2'>
          <div className={`${style.__border} px-4 mx-3`}>
            <CustomButton
              varient='filled'
              icon={'pi pi-plus'}
              label={'Add Raw Material'}
              onClick={onAddNewClick}
            />
          </div>

          <div className='flex justify-content-center align-items-center gap-2'>
            <CustomButton
              varient='filled'
              label={'Check In'}
              onClick={() => {
                onClickCheckInAndOut('checkIn')
              }}
            />
            <CustomButton
              varient='filled'
              label={'Check Out'}
              onClick={() => {
                onClickCheckInAndOut('checkOut')
              }}
            />
          </div>
        </div>
      </div>
      {renderTable(table)}
    </div>
  )
}

export default RawMaterial
