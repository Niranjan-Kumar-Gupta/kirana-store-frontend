
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import style from './style.module.css'
import { Text } from '../../components/Text'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'
import { TreeSelect } from 'primereact/treeselect'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { useForm, Controller } from 'react-hook-form'
import { classNames } from 'primereact/utils'
import { Toast } from 'primereact/toast'
import { CustomButton } from '../../components/CustomButton'
import { InputTextarea } from 'primereact/inputtextarea';
import { API_GET_RAWMATERIAL,API_GET_RAW_STOCK_MATERIAL } from '../../api/rawMaterial.service'
import Loader from '../../components/Loader'

import { useDispatch, useSelector } from "react-redux";

import { Button } from 'primereact/button';
import CustomBreadcrumb from '../../components/CustomBreadcrumb'
import { ReactComponent as Delete } from '../../svg/delete.svg'
import { MultiSelect } from 'primereact/multiselect';
import { changeToastActionRaw, updateRawMaterialHistoryCheck } from '../../reducers/rawMaterialHistoryTableSlice'


const RawMaterialCheckIn = () => {

  const [tableData, setTableData] = useState([])
  const toast = useRef(null)
  const [selectedRawMaterial, setSelectedRawMaterial] = useState([])
  const [rawMaterial, setRawMaterial] = useState([])
  const dispatch = useDispatch();

  const { 
    loading,
  } = useSelector((state) => state.rawMaterialHistoryTable);

  const loader = () => {
    return <Loader visible={loading} />
  }


  const getRawMaterial = async () => {  
    try {
      const rawMaterial = await API_GET_RAW_STOCK_MATERIAL(0, 100000)
      console.log(rawMaterial) 
      
      rawMaterial.rows.forEach(ele => {
         ele['checkInQuantity'] = ''
      });
      setRawMaterial(rawMaterial.rows)
     

    } catch (error) {
      console.log(error)
    }
  }
useEffect(()=>{
   getRawMaterial()
},[])

// useEffect(() => {
//   setTableData(selectedRawMaterial)
//   //console.log(tableData)
// }, [selectedRawMaterial])
   
    const navigate = useNavigate()
    const goBack = () => {
        navigate('/rawMaterial')
      }

      const defaultValues = {
        rawMaterials: null,
        comment: '',
      }
    
      const {
        control,
        formState: { errors },
        handleSubmit,
        reset,
        setValue,
      } = useForm({ defaultValues })



  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className='p-error'>{errors[name].message}</small>
    )
  }

  

  const onCellEditCompleteCheckIn = (e, rowIndex) => {
     let _rawMaterial = [...tableData];
     console.log(_rawMaterial);
     _rawMaterial[rowIndex].checkInQuantity = e.value; 
     
     setTableData(_rawMaterial);
  }
 
  const checkInQuantityEditor = (rowData, colData) => {
    
    return (
      <InputNumber
        value={rowData.checkInQuantity}
        placeholder="Enter Check In Quantity"
        id={rowData.id}
        name={rowData.materialName}
        showButtons
        style={{ width: '8rem' }}
        min={0}
        onChange={(e) => onCellEditCompleteCheckIn(e, colData.rowIndex)}
      />
    )
  }


  const selectedRawMaterialTable = () => {  
    return (
      <DataTable
        value={tableData}
        responsiveLayout='scroll'
        resizableColumns
        columnResizeMode='expand'
        className='w-full'
      >
        <Column header='Raw Material Name' field='materialName' ></Column>
         <Column
          className='qtyCells'
          header='Available Quantity'
          field='quantity'
          //body={qtyEditor}
        ></Column>
        <Column
          className='qtyCells'
          header='Check In Quantity'
          field='quantity'
          body={checkInQuantityEditor}
        ></Column>
         <Column header='Actions' body={actionBody}></Column>
      </DataTable>
    )
  }
  const onSubmit = (data) => {
     
     let checkInData = {
      materialArray:[],
      reason:data.comment
   }

     data.rawMaterials.forEach(ele => {
         checkInData.materialArray.push({
          materialId:ele.materialId,
          quantity:ele.checkInQuantity,
          vendorName:'a'
         })
     });

      dispatch(updateRawMaterialHistoryCheck(checkInData))
      .unwrap()
      .then((res) => {
        goBack()
        dispatch(changeToastActionRaw('checkIn'))
      })
      .catch((err)=>{
        console.log(err)
        toast.current.show({ severity: 'error', detail: err.message }) 
     
      })
  }

  const multiSelectRef = useRef(null)

  const handleDelete = (e, rowData) => {
    e.preventDefault()
   
    let newData = tableData.filter((data) => data.id != rowData.id)
    const oldSel = multiSelectRef.current.props.value

    oldSel.forEach((ele,index) => {
       if (rowData.id == ele.id) {
          oldSel.splice(index,1)
       }
    });
    console.log('dddddddd', oldSel)
    setTableData(newData)
  }

  
  const actionBody = (rowData) => {
    return (
      <button
        style={{ border: 'none', background: 'none', cursor: 'pointer' }}
        onClick={(e) => handleDelete(e, rowData)}
      >
        <Delete />
      </button>
    )
  }





  const itemslist=[{ label: 'Raw Material',url: '/rawMaterial' },{ label: 'Check In'  }];

  return (
    <div className='w-11 m-auto mb-6'>
        <Toast ref={toast} />
        {loading ? loader() : <></>}
        <div
          className={`md:flex md:justify-content-center pt-3 ${style.stickySubNav}`}
        >
          <div className='flex flex-column md:flex-row lg:flex-row lg:w-10 md:w-8 md:justify-content-between align-items-center justify-content-center mb-3'>
            <div className='lg:w-7 md:w-6 flex align-items-center'>
              <CustomBreadcrumb className='pl-0' itemslist={itemslist} />
            </div>
            <div className='sm:w-12 md:w-5 lg:w-4'>
              <div className='flex justify-content-end gap-2'>
                <Button
                  className={`skalebot-button ${style.colored} w-6rem`}
                  onClick={() => navigate('/rawMaterial')}
                >
                  Cancel
                </Button>
                <CustomButton
                  varient='filled w-7rem pl-3'
                  type='submit'
                  onClick={handleSubmit(onSubmit)}
                  label={'Check In'}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={`card`}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='p-fluid'
            encType='multipart/form-data'
          >
         

            <div className='lg:flex lg:flex-row lg:align-items-start lg:justify-content-center lg:gap-3 md:flex md:flex-column md:align-items-center'>
              <div className='lg:w-7 md:w-8 sm:w-full'>
                <div className='bg-white p-3 border-round border-50 mb-3'>
                  <div className='field w-12 lg:w-5'>
                    <label htmlFor='categories'>Raw Material *</label>
                    <Controller
                      name='rawMaterials'                  
                      control={control}
                      rules={{ required: 'Please select a Raw Material.' }}
                      render={({ field, fieldState }) => (
                        <>
                         <MultiSelect
                            ref={multiSelectRef}
                            filter
                            id={field.name}
                            value={field.value} 
                            name='rawMaterials'                           
                            onChange={(e) => {
                             console.log(e.value)
                                
                             field.onChange(e.value)
                             
                             //onChangeDrop(e.value)
                             //setSelectedRawMaterial(e.value)       
                             setTableData(e.value)
                            }}                       
                            options={rawMaterial}
                            inputRef={field.ref}
                            optionLabel="materialName" 
                            placeholder='Select Raw Materials'
                            className={classNames('w-full', {
                              'p-invalid': fieldState.error,
                            })}
                          />
                          {getFormErrorMessage(field.name)}
                        </>
                      )}
                    />
                   
                  </div>
                  {tableData && tableData.length !== 0 ? selectedRawMaterialTable() : ''}
                </div>
                </div>
                <div className='lg:w-3 md:w-8 sm:w-full bg-white p-3 border-round border-50 mb-3'>
                 
                    <div className=''>
                       <div className='field'>
                         <label htmlFor='comment'>Comment</label>
                          <Controller
                            name='comment'
                            control={control}
                            render={({ field, fieldState }) => (
                              
                              <InputTextarea
                               
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                rows={5} 
                             
                                placeholder='Enter Comment'
                                className={classNames({
                                  'p-invalid': fieldState.invalid,
                                })}
                              />
                            )}
                          />
                       
                       </div>
                   </div>
                </div>
            </div>

            {/* <div className='flex justify-content-end gap-2 mt-3 '>
              <div className='flex  '>
                <CustomButton varient='filled' type='submit' label={'Check In'} />
            
              </div>
             </div> */}
          </form>
        </div> 
    </div>
  )
}

export default RawMaterialCheckIn