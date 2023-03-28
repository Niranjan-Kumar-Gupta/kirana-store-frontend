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
  const [products, setProducts] = useState([
    {
        id: '1000',
        code: 'f230fh0g3',
        name: 'Bamboo Watch',
        description: 'Product Description',
        image: 'bamboo-watch.jpg',
        price: 65,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'INSTOCK',
        rating: 5,
        date: '2015-09-13',
        url:['https://picsum.photos/320/180','https://picsum.photos/330/190','https://picsum.photos/300/170']
    },
    {
        id: '1001',
        code: 'nvklal433',
        name: 'Black Watch',
        description: 'Product Description',
        image: 'black-watch.jpg',
        price: 72,
        category: 'Accessories',
        quantity: 61,
        inventoryStatus: 'INSTOCK',
        rating: 4,
        date: '2015-09-07',
        url:'https://picsum.photos/300/180'
    },
    {
        id: '1002',
        code: 'zz21cz3c1',
        name: 'Blue Band',
        description: 'Product Description',
        image: 'blue-band.jpg',
        price: 79,
        category: 'Fitness',
        quantity: 2,
        inventoryStatus: 'LOWSTOCK',
        rating: 3,
        date: '2015-09-01',
        url:['https://picsum.photos/300/180','https://picsum.photos/300/190','https://picsum.photos/300/170']
    },
    {
        id: '1003',
        code: '244wgerg2',
        name: 'Blue T-Shirt',
        description: 'Product Description',
        image: 'blue-t-shirt.jpg',
        price: 29,
        category: 'Clothing',
        quantity: 25,
        inventoryStatus: 'INSTOCK',
        rating: 5,
        date: '2015-09-13',
    },
]
 );

 let items = ['New','In Progress','Done']
 const columns = [
       {
        field: 'code',
        header: 'Code',
        isFilter:true,
        filterType:'dropdown',
        dropdownItems:items,
        filterPlaceholder:"Search by code"
      },
    {field: 'name', header: 'Name',isFilter:true,filterType:'input',filterPlaceholder:"Search by Name"},
    {field: 'category', header: 'Category',isFilter:true,filterType:'dropdown',dropdownItems:items,filterPlaceholder:"Search by catogery"},
    {field: 'quantity', header: 'Quantity',isFilter:true,filterType:'input',filterPlaceholder:"Search by Quantity"},
    {field: 'url', header: 'image',isFilter:false,isImageBody:true,imageBodyType:'carousel'},  
    //{field: 'rating', header: 'Rating',isFilter:true,filterType:'input',filterPlaceholder:"Search by Rating"},
    {field: 'date', header: 'Date',isFilter:true,filterType:'date',filterPlaceholder:"Search by Date"},
    {field: 'actions', header: 'Actions',isActions:true,actionType:['edit','delete']},
  
  ];

  useEffect(()=>{
    console.log("Sss")
    dispatch(getProducts()).unwrap().
    then((resp) => {
    })
    .catch((err) => {
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
    console.log('prod edit',product)
    // dispatch(changeMode("update"));
    // dispatch(changeSelectedProduct(product));
    // setDisplayAddProductModule(true);
  };
  const handleDelete = (product) => {
    console.log('prod del',product)
    //setMessage(product)
    // dispatch(changeMode("delete"));
    // dispatch(changeSelectedProduct(product));
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
    setShowProductForm(true)
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

  const ids = [1, 2, 3, 4, 5, 6, 7, 8]

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

      <div className='flex flex-wrap gap-2 mt-2'>
        {ids.map((id) => (
          <div
            onClick={() => navigate(`productDetails/${id}`)}
            className={'products flex justify-content-center align-items-center'}
            key={id}
          >
            <Text type={'heading'}>Product {id}</Text>
          </div>
        ))}
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
