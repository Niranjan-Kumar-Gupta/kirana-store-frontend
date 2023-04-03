import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";
import {ReactComponent as Delete} from "../../svg/delete.svg"
import { CustomButton } from '../../components/CustomButton';
import VariantPanel from "./VariantPanel";
import { Toast } from "primereact/toast";
function VariantField({pid,field,className,placeholder,varient,setVarient,varienttable,setVarienttable}) {
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
        console.log(temp)
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
                return a.key===id
            }
            return varienttable.filter(check)
        }
    temp=getCombn(mapper2)
    if(temp&&temp.length>0){
        temp=temp.map(x=>{
            let item=rec(mapper,x);
            let op=item.split("/")
            return { 
                key: x,
                SKUID:"",
                price:0,
                stock:"Available",
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
    },[...varient])

    return (
    <div> 
        <div className="flex flex-column justify-content-end">
        <Toast ref={toast} />
        <div  className="flex my-2 pl-2">
                <div className="w-7">Variant</div>
                 {varient.length<3&&<div className="flex w-4 text-blue-400 justify-content-end" onClick={()=>{addVarient()}}>
                        +&nbsp;Add&nbsp;Option     
                    </div>}
            </div>
        {(varient)&&varient.map((x,pkey)=>{
            return (
                <div>
                    <div className="flex align-items-center ">
                        <InputText
                            id={pkey}
                            className={`w-12`}
                            placeholder={'Option'}
                            defaultValue={x.name}
                            onChange={(e)=>{editVarient(pkey,e.target.value)}}
                        />
                        <Delete className="m-2" onClick={()=>{delete_varient(pkey)}}/>
                        </div>

                    <div className="flex flex-column w-11 align-content-end my-2" style={{marginLeft:"8%"}}>
                       <div className="flex flex-nowrap mt-2">
                         <div className="w-7 mb-2">Options</div> 
                                <div className="flex w-4 text-900 justify-content-end" onClick={()=>{addVarientoption(pkey)}}>
                                    + Add Option     
                                </div>
                        </div>
                     {(x.values) && x.values.map((item,key)=>{
                           return( 
                                <div className="flex align-items-center w-12 justify-content-end">
                                      <InputText
                                        id={key}
                                        className={`w-12 `}
                                        placeholder={'value'}
                                        defaultValue={item}
                                        onChange={(e)=>{editVarientoption(pkey,key,e.target.value)}}
                                    />
                                    <Delete className="m-2" onClick={()=>{delete_varient(pkey,key)}}/> 
                                </div>
                           )
                        })}
                               
                        <div>
                        </div>
                    </div>
                </div>
            );
        })}
        </div>
        <div>
            <div className="flex ">
                <div className="flex p-2 m-1 w-11 m-2 justify-content-end" onClick={tablesetter} >
                    Done
                    </div>
                </div>
         <div className="mt-2">
           <VariantPanel
                varienttable={varienttable}
                setVarienttable={setVarienttable}
           />
        </div>
        </div>
      </div>
    
    );
}

export default VariantField;