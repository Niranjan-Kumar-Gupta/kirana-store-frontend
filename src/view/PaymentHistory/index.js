import CustomBreadcrumb from "../../components/CustomBreadcrumb";


const PaymentHistory = () => {
  const itemslist=[{ label: 'Payment History', url: '/paymenthistory'  }, ];
  return (
    
    <div className="w-11 pt-3 m-auto">
      <CustomBreadcrumb itemslist={itemslist}/>
      </div>
  )
}

export default PaymentHistory