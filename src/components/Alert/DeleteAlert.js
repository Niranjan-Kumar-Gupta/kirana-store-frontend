import { Dialog } from "primereact/dialog";
import { CustomButton } from "../CustomButton";
import { useSelector, useDispatch } from "react-redux"
import { deleteCustomer, resetSelectedCustomer, resetToastActionCustomer } from "../../reducers/customerTableSlice";
import { deleteCategory, resetSelectedCategory } from "../../reducers/categoryTableSlice"
import { deleteProduct, resetSelectedProduct, resetToastAction } from "../../reducers/productTableSlice";
import {
 
  deleteStocksHistory,
  resetSelectedStockHistory,
  resetToastActionStock,
} from "../../reducers/stocksHistoryTableSlice";

import * as Messag from '../../config/ToastMessage';
import { changeShowNotice } from "../../reducers/appSlice";
import { deleteOrder, resetSelectedOrder, resetToastActionOrder } from "../../reducers/orderTableSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteRawMaterial } from "../../reducers/rawMaterialSlice";
import { deleteRawMaterialHistory, resetToastActionRaw } from "../../reducers/rawMaterialHistoryTableSlice";
export const DeleteAlert = ({ item, displayAlertDelete, setDisplayAlertDelete, toast }) => {
   const { selectedCustomer } = useSelector(state => state.customerTable);
   const { selectedCategory, page, limit } = useSelector(state => state.categoryTable);
  const { selectedProduct } = useSelector(state => state.productTable);
  const { selectedOrder } = useSelector(state => state.orderTable);
  const { selectedRawMaterial } = useSelector(state => state.rawMaterialTable)
  const { selectedRawMaterialHistory } = useSelector(state => state.rawMaterialHistoryTable)
    
  const {
    selectedStockHistory,
  } = useSelector((state) => state.stocksHistoryTable);

 const dispatch = useDispatch();
 const navigate = useNavigate()
 const location = useLocation();

 // to check the page on which action is performed 
 const onDetailsPage = () => {
  return location.pathname.split('/').length > 2;
 }

  const deleteProductItem = () => {
    dispatch(deleteProduct(selectedProduct.id))
      .unwrap()
      .then(res => {
        dispatch(changeShowNotice(true))
        if (onDetailsPage()) {
          navigate('/products')
        } else {
          dispatch(resetToastAction());
        }
        toast.current.show({ severity: 'success', detail: Messag.Delete_Product_ToastSuccessMessage });
      })
      .catch(err => {
        //show toast here
        toast.current.show({ severity: 'error', detail: err.response });
      })
  }
  const deleteCategoryItem = () => {
    const categoryId = selectedCategory.id;
    dispatch(deleteCategory({categoryId, page, limit}))
      .unwrap()
      .then(res => {
        //show toast here
        let Message_Success = Messag.Delete_Cat_ToastSuccessMessage;
        toast.current.show({ severity: 'success', detail: Message_Success });
      })
      .catch(err => {
        //show toast here
        toast.current.show({ severity: 'error', detail: err.response.data });
      })
  }
  const deleteCustomerItem = () => {
    dispatch(deleteCustomer(selectedCustomer.id))
      .unwrap()
      .then(res => {
        if (onDetailsPage()) {
          navigate('/customers')
        } else {
          dispatch(resetToastActionCustomer());
        }
        let Message_Success = Messag.Delete_Cust_ToastSuccessMessage;
        toast.current.show({ severity: 'success', detail: Message_Success });
      })
      .catch(err => {
        //show toast here
        toast.current.show({ severity: 'error', detail: err.response.data });
      })
  }

  const deleteOrderItem = () => {
    dispatch(deleteOrder(selectedOrder.id))
      .unwrap()
      .then(res => {
        if (onDetailsPage()) {
          navigate('/orders')
        } else {
          dispatch(resetToastActionOrder());
        }
        toast.current.show({ severity: 'success', detail: Messag.Delete_Order_ToastSuccessMessage });
      })
      .catch(err => {
        //show toast here
        toast.current.show({ severity: 'error', detail: err.response.data });
      })
  }

  const deleteStockHistoryItem = () => {
    dispatch(deleteStocksHistory(selectedStockHistory.id))
      .unwrap()
      .then(res => {
        if (onDetailsPage()) {
          navigate('/stocks')
        } else {
          dispatch(resetToastActionStock());
        }
        let Message_Success = 'Stock History Successfully Deleted';
        toast.current.show({ severity: 'success', detail: Message_Success });
      })
      .catch(err => {
        toast.current.show({ severity: 'error', detail: err.response.data });
      })
  }

  const deleteRawMaterialItem = () => {
    dispatch(deleteRawMaterial(selectedRawMaterial.id))
      .unwrap()
      .then(res => {
        //show toast here
        let Message_Success = 'Raw Material Successfully Deleted';
        toast.current.show({ severity: 'success', detail: Message_Success });
      })
      .catch(err => {
        //show toast here
        toast.current.show({ severity: 'error', detail: err.response.data });
      })
  } 

  const deleteRawMaterialHistoryItem = () => {
    dispatch(deleteRawMaterialHistory(selectedRawMaterialHistory.id))
      .unwrap()
      .then(res => {
        if (onDetailsPage()) {
          navigate('/rawMaterial')
        } else {
          dispatch(resetToastActionRaw());
        }
        let Message_Success = 'Raw Material History Successfully Deleted';
        toast.current.show({ severity: 'success', detail: Message_Success });
      })
      .catch(err => {
        toast.current.show({ severity: 'error', detail: err.message });
      })
  } 

  


  const onHide = () => {
    setDisplayAlertDelete(false)
    // switch (item) {
    //   case 'product':
    //     dispatch(resetSelectedProduct())
    //     break;
    //   case 'order':
    //     dispatch(resetSelectedOrder())
    //     break;
    //   case 'category':
    //     dispatch(resetSelectedCategory())
    //     break;
    //   case "customer":
    //     dispatch(resetSelectedCustomer())
    //     break;
    //   case "stockHistory":
    //     dispatch(resetSelectedStockHistory())
    //     break;
    //   default:
    //     break;
    // }
  }
  const handleDelete = () => {
    switch (item) {
      case 'product':
        deleteProductItem()
        break;
      case 'order':
        deleteOrderItem()
        break;
      case 'category':
        deleteCategoryItem()
        break;
      case "customer":
        deleteCustomerItem()
        break;
      case "stockHistory":
        deleteStockHistoryItem()
        break;
      case "rawMaterial":
        deleteRawMaterialItem()
        break;
      case "rawMaterialHistory":
        deleteRawMaterialHistoryItem()
        break;
    }
    onHide();
  }

  const dialogFooter = () => {
    return (
      <div className="flex justify-content-end mt-4">
        <CustomButton label="Yes" varient="filled" icon="pi pi-check" onClick={handleDelete} />
        <CustomButton label="No" varient="filled" icon="pi pi-times" autofocus={true} onClick={onHide} />
      </div>
    );
  };
  return (
    <Dialog
      header="Alert"
      visible={displayAlertDelete}
      footer={dialogFooter()}
      onHide={onHide}
      style={{ width: "35vw" }}
      className={'dialog-custom'}
    >
      <p>
        Are you sure, you want delete?
      </p>
    </Dialog>
  );
};
