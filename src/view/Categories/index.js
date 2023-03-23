import React, { useState, useEffect, useRef } from 'react'
import { CategoryForm } from "../../components/Forms/CategoryForm"
import Loader from '../../components/Loader'
import { Toast } from 'primereact/toast'
import { CustomButton } from '../../components/CustomButton'
import { Text } from '../../components/Text'
import CustomTable from "../../components/CustomTable";
import {
  changeSelectedCategory,
  getCategories,
  changePage,
  changeMode,
  resetSelectedCategory,
  resetMode,
  changelimit
} from "../../reducers/categoryTableSlice";

const Categories = () => {
  const loading = false;
  const [showCategoryForm, setShowCategoryForm] = useState(false)

  // table--------------------------------


  const [category, setCategory] = useState([]);

  let items = ['New','In Progress','Done']
  const columns = [
    {field: 'name', header: 'name',expander:true,isFilter:false,filterType:'input',filterPlaceholder:"Search by name"},
    {field: 'size', header: 'size',isFilter:false,filterType:'input',filterPlaceholder:"Search by size"},
    {field: 'type', header: 'type',isFilter:false,filterType:'dropdown',dropdownItems:items,filterPlaceholder:"Search by type"},
   
  ];

  const onApplyFilter = (data)=>{
    console.log(data)
  }
  const onApplySearch = (data)=>{
  console.log(data)
  }
  const onClearFilter = (data)=>{
    console.log(data)
  }
  const onClearSearch = (data)=>{
  console.log(data)
  }
  
  //-----------------------------------

  const onAddNewClick = () => {
    setShowCategoryForm(true)
  }

  const onHide = () => {
    setShowCategoryForm(false)
  }

  const loader = () => {
    return <Loader visible={loading} />
  }

  const toast = useRef(null)

  const categoryModal = () => {
    return (
      <CategoryForm
        onHide = {onHide}
        showCategoryForm={showCategoryForm}
        toast={toast}
      />
    )
  }

  return(
    <div className='w-11 pt-3 m-auto'>
      <Toast ref={toast} />
      {showCategoryForm ? categoryModal() : <></>}
      {loader ? loader() : <></>}
      <div className={'flex justify-content-between align-items-center'}>
        <div>
          <Text type='heading'>Categories</Text>
        </div>
        <CustomButton
          varient='filled'
          label={'Add New Category'}
          icon={'pi pi-plus'}
          onClick={onAddNewClick}
        />
      </div>

      <div>
      <CustomTable 
        tableName={'categoryTable'}
        data={category}
        columns={columns} 
        globalSearch={true}
        onApplyFilter={onApplyFilter}
        onApplySearch={onApplySearch}
        onClearFilter={onClearFilter}
        onClearSearch={onClearSearch}
        tableType={'treeTable'}
        paginator={{page:0,limit:5,totalRecords:30,changePage:()=>{}}}
      />  
      </div>
    </div>
  )
}

export default Categories