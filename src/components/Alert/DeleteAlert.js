import { Dialog } from "primereact/dialog";
import { CustomButton } from "../CustomButton";
// import { useSelector, useDispatch } from "react-redux"
// import { deleteCustomer, resetSelectedCustomer } from "../../reducers/customerTableSlice";
// import { deleteCategory, resetSelectedCategory } from "../../reducers/categoryTableSlice"
// import { deleteProduct, resetSelectedProduct } from "../../reducers/productTableSlice";

// import * as Messag from '../../config/ToastMessage';
// import { changeShowNotice } from "../../reducers/appSlice";
export const DeleteAlert = ({ item, displayAlertDelete, setDisplayAlertDelete, toast }) => {
  // const { selectedCustomer } = useSelector(state => state.customerTable);
  // const { selectedCategory } = useSelector(state => state.categoryTable);
  // const { selectedProduct } = useSelector(state => state.productTable);

 // const dispatch = useDispatch();

  const deleteProductItem = () => {
    // dispatch(deleteProduct(selectedProduct.id))
    //   .unwrap()
    //   .then(res => {
    //     dispatch(changeShowNotice(true))
    //     //show toast here
    //     let Message_Success = Messag.Delete_Product_ToastSuccessMessage;
    //     toast.current.show({ severity: 'success', detail: Message_Success });
    //   })
    //   .catch(err => {
    //     //show toast here
    //     toast.current.show({ severity: 'error', detail: err.response.data });
    //   })
  }
  const deleteCategoryItem = () => {
    // dispatch(deleteCategory(selectedCategory.id))
    //   .unwrap()
    //   .then(res => {
    //     //show toast here
    //     let Message_Success = Messag.Delete_Cat_ToastSuccessMessage;
    //     toast.current.show({ severity: 'success', detail: Message_Success });
    //   })
    //   .catch(err => {
    //     //show toast here
    //     toast.current.show({ severity: 'error', detail: err.response.data });
    //   })
  }
  const deleteCustomerItem = () => {
    // dispatch(deleteCustomer(selectedCustomer.id))
    //   .unwrap()
    //   .then(res => {
    //     //show toast here
    //     let Message_Success = Messag.Delete_Cust_ToastSuccessMessage;
    //     toast.current.show({ severity: 'success', detail: Message_Success });
    //   })
    //   .catch(err => {
    //     //show toast here
    //     toast.current.show({ severity: 'error', detail: err.response.data });
    //   })
  }

  const onHide = () => {
    setDisplayAlertDelete(false)
    switch (item) {
      case 'product':
       // dispatch(resetSelectedProduct())
        break;
      case 'category':
       // dispatch(resetSelectedCategory())
        break;
      case "customer":
        //dispatch(resetSelectedCustomer())
        break;
      default:
        break;
    }
  }
  const handleDelete = () => {
    switch (item) {
      case 'product':
       // deleteProductItem()
        break;
      case 'category':
       // deleteCategoryItem()
        break;
      case "customer":
       // deleteCustomerItem()
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
        Are you Sure, you want delete?
      </p>
    </Dialog>
  );
};
