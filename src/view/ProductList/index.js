import React, { useState, useEffect, useRef } from 'react'
import CustomTable from "../../components/CustomTable";
import './index.css'
import { ProductForm } from '../../components/Forms/ProductForm'
import Loader from '../../components/Loader'
import { Toast } from 'primereact/toast'
import { CustomButton } from '../../components/CustomButton'
import { Text } from '../../components/Text'
import { useNavigate } from 'react-router-dom'
import { DeleteAlert } from "../../components/Alert/DeleteAlert";
import {
  changeSelectedProduct,
  getProducts,
  changeMode,
  changePage,
  updateSelectedProductsList,
  resetSelectedProductsList,
} from "../../reducers/productTableSlice";
import { useDispatch, useSelector } from "react-redux";

const ProductList = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const toast = useRef(null)
  const [displayAlertDelete, setDisplayAlertDelete] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false)
  const {
    productData,
    loading,
    page,
    limit,
    totalProductCount,
    selectedProductsList,
  } = useSelector((state) => state.productTable);
 
// console.log(page,limit)
 let items = ['New','In Progress','Done']
 const columns = [
    {field: 'SKUCode',header: 'SKUCode'},
    {field: 'productName', header: 'Product Name'},
    {field: 'categoryId', header: 'Category',isFilter:true,filterType:'dropdown',dropdownItems:items,filterPlaceholder:"Search by catogery"},
    {field: 'url', header: 'Image',isFilter:false,isImageBody:true,imageBodyType:'carousel'},  
    {field: 'desc', header: 'Description'},  
    {field: 'createdAt', header: 'Date'},
    {field: 'actions', header: 'Actions',isActions:true,actionType:['edit','delete']},
  ];

  
  useEffect(()=>{
    dispatch(getProducts({page, limit})).unwrap().then((resp) => {
      // console.log("Ss")
    }).catch((err) => {
      console.log(err)
    })
  },[])


  const deleteModule = () => {
    return (
      <DeleteAlert
        item="product"
        displayAlertDelete={displayAlertDelete}
        setDisplayAlertDelete={setDisplayAlertDelete}
        toast={toast}
      />
    );
  };

  const handleEdit = (product) => {
    // console.log('prod edit',product)
    dispatch(changeMode("update"));
    // dispatch(changeSelectedProduct(product));
    navigate(`/products/productDetails/${product.id}`)
    // setDisplayAddProductModule(true);
  };
  const handleDelete = (product) => {
    // console.log('prod del',product)
    dispatch(changeMode("delete"));
    dispatch(changeSelectedProduct(product));
     setDisplayAlertDelete(true);
  };

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

  const onAddNewClick = () => {
    navigate(`/products/productDetails/add`)

    // setShowProductForm(true)
  }

  const onHide = () => {
    setShowProductForm(false)
  }

  const loader = () => {
    return <Loader visible={loading} />
  }

  const productModal = () => {
    return (
      <ProductForm
        showProductForm={showProductForm}
        setShowProductForm={setShowProductForm}
        toast={toast}
      />
    )
  }

  return (
    <div className='w-11 pt-3 m-auto'>
      <Toast ref={toast} />
      {showProductForm ? productModal() : <></>}
      {loading ? loader() : <></>}
      <div className={'flex justify-content-between align-items-center'}>
        <div>
          <Text type='heading'>Products List</Text>
        </div>
        <CustomButton
          varient='filled'
          label={'Add New Product'}
          icon={'pi pi-plus'}
          onClick={onAddNewClick}
        />
      </div>

       <Toast ref={toast} />
        <div className="card my-3">
            {displayAlertDelete && deleteModule()}
            <div className="">
               <CustomTable 
                  tableName={'productTable'}
                  data={productData}
                  columns={columns}
                  globalSearch={true}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  onApplyFilter={onApplyFilter}
                  onApplySearch={onApplySearch}
                  onClearFilter={onClearFilter}
                  onClearSearch={onClearSearch}
                  paginator={{page:page,limit:limit,totalRecords:10,changePage:changePage}}
                />       
            </div>
        </div>
    </div>
  )
}

export default ProductList
