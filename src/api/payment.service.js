import baseUrl from "./server";
import axiosInstance from "./axios.instance"
import $ from "jquery";
import React from 'react'
import { useNavigate } from 'react-router-dom';


const getPlans = async (category) => {
  console.log(category)
    try {
      const resp = await axiosInstance.get(`/${category}-type/`);
      return resp.data;
    } catch (err) {
      throw err;
    }
  };
 
  
  
const fetchInvoice = async (txnid) => {
    try {
      const resp = await axiosInstance.get(`/payment/payu/${txnid}/invoice`);
      // const resp = await axiosInstance.get(`/payment/payu/eda80c37-3650-4534-acb8-327288a800fd/invoice`);
      return resp.data;
    } catch (err) {
      throw err;
    }
  }; 

const payumoney= async(props) =>{
 
      var pd = {
         amount : props.amount,
         firstname: props.userName,
         phone :props.iat,
         productinfo: props.name,
         surl :`${baseUrl}/payment/payu/success`,
         furl :`${baseUrl}/payment/payu/fail`,
         company: props.name,
         productType: props.productType,
         productId:props.id,
    }
    // console.log(pd)
    // Data to be Sent to API to generate hash.
    // console.log(props)
    let data ={
         companyId:props.companyId,
         productType:props.productType,
         productId: props.id,
         surl :`${baseUrl}/payment/payu/success`,
         furl :`${baseUrl}/payment/payu/fail`,
         address: props.address||'',
         email :props.email||'deskala@deskala.in',
         purchaseFrom:'skalebot',
    }
   

    // API call to get the Hash value
   const res = await axiosInstance.post('/payment/payu',{...data})
       .then(async (a)=> {
        // console.log("res",a.data)
           let res=a.data
            pd={...data,...res}
          let server="https://test.payu.in/_payment";
          // let server="https://secure.payu.in/_payment";

          var fr =await `<form action="${server}" method="post">` +
          '<input type="hidden" name="key" value="'+pd.key+'" />' +
          '<input type="hidden" name="txnid" value="'+pd.txnid+'" />' +
          '<input type="hidden" name="amount" value="'+pd.amount+'" />' +
          '<input type="hidden" name="productinfo" value="'+pd.productinfo+'" />' +
          '<input type="hidden" name="firstname" value="'+pd.firstname+'" />' +
          '<input type="hidden" name="email" value="'+pd.email+'" />' +
          '<input type="hidden" name="mihpayid" value="'+pd.mihpayid+'" />' +
          '<input type="hidden" name="status" value="'+pd.status+'" />' +
          '<input type="hidden" name="hash" value="'+pd.hash+'" />' +
          '<input type="hidden" name="phone" value="'+pd.phone+'" />' +
          '<input type="hidden" name="surl" value="'+pd.surl+'" />' +
          '<input type="hidden" name="furl" value="'+pd.furl+'" />' +
          '<input type="hidden" name="udf1" value="'+pd.udf1+'" />' +
          '<input type="hidden" name="udf2" value="'+pd.udf2+'" />' +
          '<input type="hidden" name="udf3" value="'+pd.udf3+'" />' +
          '</form>';
          var form = $(fr);
          $('body').append(form);								
          form.submit();       
       });
    }
    const payuInvoice= async(props) =>{
 
    //     var pd = {
    //        amount : props.amount,
    //        firstname: props.userName,
    //        phone :props.iat,
    //        productinfo: props.name,
    //        surl :`${baseUrl}/payment/payu/verify`,
    //        furl :`${baseUrl}/payment/payu/verify`,
    //        company: props.name,
    //        productType: props.productType,
    //        productId:props.id,
    //   }
      // console.log(pd)
      // Data to be Sent to API to generate hash.
      // console.log(props)
      let db={
        "amount":"1",
        "txnid":"test11390",
        "productinfo":"jnvjrenv",
        "firstname":"test",
        "email":"test@gmail.com",
        "phone":"9988776655",
        "address1":"testaddress",
        "city":"test",
        "state":"test",
        "country":"test",
        "zipcode":"122002",
        "template_id":"1200",
        "sms_template_id":"1010",
        "validation_period":"6",
        "send_email_now":"1",
        "send_sms":"1"
      }
     let var2='"amount":"1","txnid":"test11390","productinfo":"jnvjrenv","firstname":"test","email":"test@gmail.com","phone":"9988776655","address1":"testaddress","city":"test","state":"test","country":"test","zipcode":"122002","template_id":"1200","sms_template_id":"1010","validation_period":"6","send_email_now":"1","send_sms":"1"'
    //   let ss=JSON.stringify(pak)
    //   let var1=;
      var fr =await '<form action="https://test.payu.in/merchant/postservice.php?form=2" method="post">' +
      '<input type="hidden" name="key" value="3953a7d2adf85ad90f1404cc323be8a286fe765d284aea0e870e510a68b8049b" />' +
      '<input type="hidden" name="var1" value="'+"amount:1,txnid:16484975473,productinfo:TOPUP,firstname:priyanka,email:Priyankaganguly82@gmail.com,phone:9988776655,address1:testaddress,city:test,state:test,country:test,zipcode:122002,template_id:1200,sms_template_id:1010,validation_period:6,send_email_now:1,send_sms:1"+'" /> '+
      '<input type="hidden" name="command" value="create_invoice" />' +
      '<input type="hidden" name="hash" value="7ef985db89b5c41b86d04f6191674d35887a12ad95cde12ab943b7565fc04bdfff36449157ac1709a8793808c6be6cabc7418e7bca17a405fe637f42443c5055" />' +
      '</form>';
      var form = $(fr);
      $('body').append(form);								
      form.submit(); 

     let data='var1="amount":"1","txnid":"16484975473","productinfo":"TOPUP","firstname":"priyanka","email":"Priyankaganguly82@gmail.com","phone":"9988776655","address1":"testaddress","city":"test","state":"test","country":"test","zipcode":"122002","template_id":"1200","sms_template_id":"1010","validation_period":"6","send_email_now":"1","send_sms":"1"';
      // API call to get the Hash value
    //  const res = await axiosInstance.post('/payment/hash',{data})
    //      .then(async (a)=> {
    //       console.log("res",a.data)
    //          let res=a.data
    //         let  pd={...data,...res}
    //         let var1='"amount":"1","txnid":"test11390","productinfo":"jnvjrenv","firstname":"test","email":"test@gmail.com","phone":"9988776655","address1":"testaddress","city":"test","state":"test","country":"test","zipcode":"122002","template_id":"1200","sms_template_id":"1010","validation_period":"6","send_email_now":"1","send_sms":"1"&hash=50a15d0af5d4cf3e74cec565b6e63f953586d27409339799c7a087a9dce909f945a6331e10418a31fa910cb1de1aeba0cd40abcf88ebb307404836221b08b207';
    //         var fr =await '<form action="https://test.payu.in/merchant/postservice.php?form=2" method="post">' +
    //         '<input type="hidden" name="key" value="'+pd.key+'" />' +
    //         '<input type="hidden" name="key" value="'+var1+'" />' +
    //         '<input type="hidden" name="key" value="create_invoice" />' +
    //         '</form>';
    //         var form = $(fr);
    //         $('body').append(form);								
    //         form.submit();       
    //      });

      }
      
    
    
    function Payment() {
    
    
        const navigate = useNavigate();
    
        const verifyPayment = async (response) => {
    
            await fetch("http://localhost:8080/api/v1/payment/verify", {
                method: "POST",
                body: JSON.stringify(response),
                headers: { "Content-Type": "application/json" },
            }).then(res => {
                if (res.redirected) {
                    navigate(response.razorpay_payment_id)
                }
            }).catch(e => { console.log(e); });
    
    
        }
    
    
    
        const payNow = async (e) => {
    
            e.preventDefault();
    
            var order;
    
            await fetch("http://localhost:8080/api/v1/payment", {
                method: "POST",
                body: JSON.stringify({
                    "productType": "TOPUP",
                    "productId":3,
                    companyId: 1,
                }),
                headers: { "Content-Type": "application/json" }
            }).then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    order = data
                }).catch(e=>{
                    window.alert(e)
                   console.log(e);
                })
            if(!order){
              return;
            }
    
    
            var options = {
                "key": order.key,
                "amount": order.amount,
                "currency": "INR",
                "name": "Acme Corp",
                "description": "Test Transaction",
                "image": "https://st2.depositphotos.com/4035913/6124/i/950/depositphotos_61243701-stock-photo-letter-b-logo.jpg",
                "order_id": order.id,
                "handler": verifyPayment,
                "prefill": {
                    "name": "Govind Kumar",
                    "email": "govind.kumar@example.com",
                    "contact": "9999999999"
                },
                "notes": order.notes,
                "theme": {
                    "color": "#3399cc"
                }
            };
            console.log(options);
    
            var rzp1 = new window.Razorpay(options);
    
    
            rzp1.on('payment.failed', function (response) {
                alert(response.error.code);
                alert(response.error.description);
                alert(response.error.source);
                alert(response.error.step);
                alert(response.error.reason);
                alert(response.error.metadata.order_id);
                alert(response.error.metadata.payment_id);
            });
    
            rzp1.open();
        }
    
    
        return (
            <div className="payment">
                <button onClick={payNow}>Pay</button>
            </div>
        );
    }
     

export {
    payumoney,
    getPlans,
    payuInvoice,
    Payment,
    fetchInvoice
};