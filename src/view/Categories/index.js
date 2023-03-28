import React, { useState, useEffect, useRef } from 'react'
import { CategoryForm } from "../../components/Forms/CategoryForm"
import Loader from '../../components/Loader'
import { Toast } from 'primereact/toast'
import { CustomButton } from '../../components/CustomButton'
import { Text } from '../../components/Text'
import CustomTable from "../../components/CustomTable";
import { useDispatch,useSelector } from "react-redux";
import { DeleteAlert } from "../../components/Alert/DeleteAlert";
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
  
  const { 
        categoryData,
        mode,
        page,
        limit,
        loading,
        totalCategoryCount 
        } = useSelector((state) => state.categoryTable);

  //const loading = false;
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [displayAlertDelete, setDisplayAlertDelete] = useState(false);
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(getCategories({page:page,limit:limit}))
    .unwrap()
    .catch(()=>{ 
      console.log(categoryData)

    }) 
  },[page,limit])

  // table--------------------------------


  let items = ['Available','Unavailable']
  const columns = [
    {field: 'categoryName', header: 'Category Name',expander:true,isFilter:false,filterType:'input',filterPlaceholder:"Search by name"},
    //{field: 'label', header: 'Label',isFilter:false,filterType:'input',filterPlaceholder:"Search by size"},
    {field: 'status', header: 'Status',isFilter:false,filterType:'dropdown',dropdownItems:items,filterPlaceholder:"Search by type"},
    {field: 'desc', header: 'Description',isFilter:false,filterType:'input',filterPlaceholder:"Search by type"},
    {field: 'updatedAt', header: 'Date',isDate:true,isFilter:false,filterType:'date',filterPlaceholder:"Search by type"},
    {field: 'actions', header: 'Actions',isActions:true,actionType:['edit','delete']},
  
  ];

 
  const handleEdit = (data) => {
    console.log(' edit',data)
    setShowCategoryForm(true)
    dispatch(changeMode("update"));
    const dataSelected = {
      parentId:data.parentId,
      categoryName:data.data.categoryName,
      status:data.data.status,
      desc:data.data.desc,
      id:data.id
    }
    dispatch(changeSelectedCategory(dataSelected));
  
  };

  const deleteModule = () => {
    return (
      <DeleteAlert
        item="category"
        displayAlertDelete={displayAlertDelete}
        setDisplayAlertDelete={setDisplayAlertDelete}
        toast={toast}
      />
    );
  };

  const handleDelete = (data) => {
    console.log(' del',data)
     dispatch(changeMode("delete"));
     dispatch(changeSelectedCategory(data));
     setDisplayAlertDelete(true);
  };

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
      {displayAlertDelete && deleteModule()}
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

      <div className='mt-2'>

      <CustomTable 
        tableName={'categoryTable'}
        data={categoryData}
        columns={columns} 
        globalSearch={true}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        dispatchFunction={getCategories}
        tableType={'treeTable'}
        paginator={{page:page,limit:limit,totalRecords:totalCategoryCount,changePage:changePage}}
      />  
      </div>
    </div>
  )
}

export default Categories