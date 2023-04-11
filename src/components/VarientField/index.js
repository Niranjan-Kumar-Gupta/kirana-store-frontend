import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";
import {ReactComponent as Delete} from "../../svg/delete.svg"
import { CustomButton } from '../../components/CustomButton';
import VariantPanel from "./VariantPanel";
import { Toast } from "primereact/toast";
import "./index.css"
import { classNames } from 'primereact/utils'

function VariantField({pid,varientErr,setvarientErr,
    field,
    fieldState,
    varient,
    setVarient,
    varienttable,
    setVarienttable}
    ) {
    
    const toast =useRef(null);
    const delete_varient=(id,index=undefined)=>{
      if(index==undefined){
        let temp=varient;
        temp.splice(id,1);
        setVarient([...temp]);  

    }else
      {
        let temp=varient;
        let x=temp[id].values;
        x.splice(index,1); 
        temp[id].values=x;
        setVarient([...temp]);  
        }

    }  
    const editVarient=(id,value)=>{
        let temp=varient;
        temp[id].name=value;
        setVarient([...temp])
    }
    const editVarientoption=(id,index,value)=>{
        let temp=varient;
        temp[id].values[index]=value;
        setVarient([...temp])
    }

    const addVarientoption=(id)=>{
        let temp=varient;
        // console.log(id,temp[id].values)
        temp[id].values.push('');
        setVarient([...temp])
    }

    const addVarient=()=>{
        let temp=varient;
        temp.push(
            {
                productId:pid,
                name:"" ,
                optionPosition:varient.length+1,
                values:['']}
             )
        setVarient([...temp]);
    }

    function rec(map,val){
        let str=[];
        val=val.split("/")
        for(let i=0;i<val.length;i++){str.push(map[val[i]]);}     
        return str.join('/');
    }

    function getCombn(arr){
        if (arr.length==0||arr.length == 1) {
            return arr[0];
        } else {
            var ans = [];  
            var otherCases = getCombn(arr.slice(1));
            for (var i = 0; i < otherCases.length; i++) {
                for (var j = 0; j < arr[0].length; j++) {ans.push(arr[0][j] +"/"+otherCases[i]);}
            }
            return ans;
        }
    }
    
    var tablesetter=()=>{
        let temp=[];
        varient.map((x)=>{
            if(x.values.length>0){
                temp.push(x.values);
            }
        })

        let mapper=[],mapper2=[];
        for(let i=0;i<temp.length;i++){
            let x=[]
            for(let j=0;j<temp[i].length;j++){
                mapper[`${i}-${j}`]=temp[i][j];
                 x.push(`${i}-${j}`);
            }
            mapper2.push(x);
        }
    
        var finder=(id)=>{
            function check(a){
                return a.variantKey===id
            }
            return varienttable.filter(check)
        }
    temp=getCombn(mapper2)
    if(temp&&temp.length>0){
        temp=temp.map(x=>{
            let item=rec(mapper,x);
            let op=item.split("/")
            return { 
                variantKey: x,
                SKUCode:"",
                price:0,
                status:"Available",
                isActive:true,
                ...finder(x)[0],
                label: item,
                option1: op[0]||"",
                option2: op[1]||"",
                option3: op[2]||"",
            }
        })
        setVarienttable([...temp])
    }else{
        setVarienttable([])
    }

    }
    useEffect(()=>{
        tablesetter();
    },[])
    const verifyVar=()=>{
        let ck=false;
        varient.forEach((x=>{
                    if(x.name===""||x.name==""){
                      toast.current.show({
                        severity: 'error',
                        detail: 'option value is empty',
                      })
                      ck=true;
                    }
                  (x.values)&&x.values.forEach(item=>{
                    if(item===""||item==""){
                      toast.current.show({
                        severity: 'error',
                        detail: 'option value is empty',
                      })
                      ck=true;
                  }
          })
        }))  
        
        return ck;
      }
    const saveVariant=()=>{
        setvarientErr(true);
        if(verifyVar){
            tablesetter();
        }
    }

    const errorchecker=(len,i,j=undefined)=>{
        return (<div>{len&&varientErr&&<><small className='p-error'>Value is Mandatory</small></>} </div>)
    }
    return (
    <div> 
        <div className="flex flex-column justify-content-end">
        <Toast ref={toast} />
            
             <div  className="flex my-2 ">
                <div className="w-auto p-2 pl-0 justify-content-center">
                   Products&nbsp;Variants
                </div>
                 {varient.length<3&&<div className="flex w-2 justify-content-center p-2 cursor-pointer btn-var" onClick={()=>{addVarient()}}>
                    +&nbsp;Add&nbsp;New&nbsp;Variant     
                </div>}
            </div>
        
        {(varient)&&varient.map((x,pkey)=>{
            return (
                <div>
                    <div className="flex flex-nowrap mt-2">
                         <div className="w-7 mb-2">Product Variant {pkey+1}</div> 
                    </div>
                    <div className="flex align-items-center w-12 xl:w-8 lg:w-8">
                        <InputText
                            id={pkey}
                            className={classNames({
                                'p-invalid': (varientErr&&x.name.length===0),
                              })}
                            placeholder={'please enter option name'}
                            defaultValue={x.name}
                            onChange={(e)=>{editVarient(pkey,e.target.value)}}
                        />
                        <Delete className="m-2 cursor-pointer" onClick={()=>{delete_varient(pkey)}}/>
                    </div>
                        {errorchecker(x.name.length==0,pkey)}
                    <div className="my-2">
                        Value
                    </div>
                    <div className="flex flex-column w-12 xl:w-8 lg:w-8" style={{}}>
                     {(x.values) && x.values.map((item,key)=>{
                           return( 
                                <div>
                                    <div className="flex align-items-center w-12 mt-1 justify-content-end">
                                        <InputText
                                            id={key}
                                            className={`w-12 ${classNames({
                                                'p-invalid':   (varientErr&&item.length===0),
                                              })} `}
                                            placeholder={'please enter option value'}
                                            defaultValue={item}
                                            onChange={(e)=>{editVarientoption(pkey,key,e.target.value)}}
                                        />
                                        <Delete className="m-2 cursor-pointer" onClick={()=>{delete_varient(pkey,key)}}/> 
                                    </div>
                                    {errorchecker(item.length==0,pkey,key)}
                                </div>
                           )
                        })}
                        <div className="w-12 flex justify-content-end">
                        <div className="flex w-4 mr-6 add-var-btn my-2 justify-content-end cursor-pointer" onClick={()=>{addVarientoption(pkey)}}>
                                    Add&nbsp;New&nbsp;Values     
                                </div>
                        </div>
                    </div>
                </div>
            );
        })}
        </div>
        <div>
            <div className="flex w-12 justify-content-end">
               {varient.length!==0&&<div className="flex p-2 m-2 w-2 save-btn justify-content-center cursor-pointer" onClick={saveVariant} >
                    Save
                </div>}
                </div>
         <div className="mt-2">
          {(varienttable.length>0)?<VariantPanel
                varienttable={varienttable}
                setVarienttable={setVarienttable}
           />:<></>}
        </div>
        </div>
      </div>
    
    );
}

export default VariantField;