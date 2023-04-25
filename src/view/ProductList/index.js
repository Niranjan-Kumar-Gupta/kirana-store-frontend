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
  getBrand,
  resetToastAction,
} from "../../reducers/productTableSlice";
import { useDispatch, useSelector } from "react-redux";
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import { API_GET_CATEGORIES_FLAT } from '../../api/category.services';


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
    brandNames,
    toastAction,
    selectedProductsList,
  } = useSelector((state) => state.productTable);



  const [categoryFlat, setCategoryFlat] = useState([])
  useEffect(()=>{
    const getCatFlat = async ()=>{
      const categoryFlat = await API_GET_CATEGORIES_FLAT(0,1000000)
      setCategoryFlat(categoryFlat); 
    }
    getCatFlat()
  },[])

 const columns = [
    {field: 'SKUCode',header: 'SKU Id'},
    {field: 'productName', header: 'Product Name'},
    {field: 'brandName', header: 'Brand Name',isFilter:true,filterType:'dropdown',dropdownItems:brandNames,filterPlaceholder:"Search by Brand Name"},
    {field: 'categoryName', header: 'Category',isFilter:true,filterType:'dropdown',dropdownItems:categoryFlat,filterPlaceholder:"Search by catogery"},
    {field: 'status', header: 'Stock'},
    {field: 'price', header: 'Price (₹)'},
    {field: 'url', header: 'Image',isFilter:false,isImageBody:true,imageBodyType:'carousel'},  
    {field: 'desc', header: 'Description'}, 
    {field: 'actions', header: 'Actions',isActions:true,actionType:['edit','delete']},
  ];

  useEffect(()=>{
    // dispatch(getProducts({page, limit})).unwrap().then((resp) => {
    //   // console.log("Ss")
    // }).catch((err) => {
    //   console.log(err)
    // })
  },[page,limit])

  useEffect(()=>{
    dispatch(getBrand()).unwrap().then((resp) => {
      
    }).catch((err) => {
      console.log(err)
    })
  
    if (toastAction === 'add') {
      toast.current.show({
        severity: 'success',
        detail: 'Product Successfully Added',
      })
    } else if (toastAction === 'update') {
      toast.current.show({
        severity: 'success',
        detail: 'Product Successfully Updated',
      })
    } else if (toastAction === 'delete') {
      toast.current.show({
        severity: 'success',
        detail: 'Product Successfully Deleted',
      })
    }
    dispatch(resetToastAction())
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
    navigate(`/products/${product.id}`)
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
    dispatch(changeMode("add"));
    navigate(`/products/new`)

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
  const itemslist=[{ label: 'Products', url: '/products'  }, ];

  return (
    <div className='w-11 pt-3 m-auto'>
      <Toast ref={toast} />
      {showProductForm ? productModal() : <></>}
      {loading ? loader() : <></>}
      <div className={'flex justify-content-between align-items-center'}>
        <div>
          <CustomBreadcrumb className='pl-0' itemslist={itemslist}/>
        </div>
        <CustomButton
          varient='filled'
          label={'Add Product'}
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
                  dispatchFunction={getProducts}
                  tableType={'dataTable'}
                  paginator={{page:page,limit:limit,totalRecords:totalProductCount,changePage:changePage}}
                />       
            </div>
        </div>
    </div>
  )
}

export default ProductList
