import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import {ReactComponent as Delete} from "../../svg/delete.svg"
import { CustomButton } from '../../components/CustomButton';
import VariantTable from "./VarientTable";

function VariantField({pid,field,className,placeholder,varient,setVarient}) {
    const [varienttable,setVarienttable]=useState([])
    const delete_varient=(id,index=undefined)=>{
      if(index==undefined){
        let temp=varient;
        temp.splice(id,1);
        setVarient([...temp]);  
    }else
      {
        let temp=varient;
        let x=temp[id].value;
        x.splice(index,1); 
        temp[id].value=x;
        setVarient([...temp]);  
        }

    }  
    const editVarient=(id,value)=>{
        let temp=varient;
        temp[id].option=value;
        console.log(temp)
        setVarient([...temp])
    }
    const editVarientoption=(id,index,value)=>{
        let temp=varient;
        temp[id].value[index]=value;
        setVarient([...temp])
    }

    const addVarientoption=(id)=>{
        let temp=varient;
        temp[id].value.push('');
        setVarient([...temp])
    }

    const addVarient=()=>{
        let temp=varient;
        temp.push(
            {id: pid,
             option:'',
             value:[]}
             )
        setVarient([...temp]);
    }
   
    // function rec(val){
    //     let str="";
    //     for(let i=0;i<val.length;i++){
    //         if(val[i]>0){
    //             str+= val[i].join("/");
    //         }     
    //     }
    //     return str;
    // }
   
    function getCombn(arr){

        if (arr.length == 1) {
            return arr[0];
        } else {
            var ans = [];  
            // recur with the rest of the array.
            var otherCases = getCombn(arr.slice(1));
           
            for (var i = 0; i < otherCases.length; i++) {
                for (var j = 0; j < arr[0].length; j++) {
                    ans.push(arr[0][j] +"/"+otherCases[i]);
                }
            }
            return ans;
        }
    }
    

    useEffect(()=>{
        let temp=[];
        varient.map((x)=>{
            console.log(x.value)
            temp.push(x.value);
        })
        // console.log("res",temp)

        // temp=getCombn(temp).map(x=>{
        //     return { 
        //         varients: x,
        //         SKUID:"",
        //         price:"",
        //         stock:"",
        //         active:1,
        //     }
        // })
        console.log(temp)
        console.log(getCombn(temp))

        setVarienttable([...temp])
    },[varient])
    
    return (
    <div> 
        <div className="flex flex-column justify-content-end">
        {(varient)&&varient.map((x,pkey)=>{
            return (
                <div>
                    <div className="flex align-items-center ">
                        <InputText
                            id={pkey}
                            className={`w-12`}
                            placeholder={'Option'}
                            defaultValue={x.option}
                            onChange={(e)=>{editVarient(pkey,e.target.value)}}
                        />
                        <Delete className="m-2" onClick={()=>{delete_varient(pkey)}}/>
                        </div>

                    <div className="flex flex-column w-11 align-content-end my-2" style={{marginLeft:"8%"}}>
                        <div className="mb-2">Options</div>
                     {(x.value) && x.value.map((item,key)=>{
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
                                <div className="flex w-10 mt-2" onClick={()=>{addVarientoption(pkey)}}>
                                    + Add Option     
                                </div>
                        <div>
                        </div>
                    </div>
                </div>
            );
        })}
        </div>
        <div className="p-2 w-4 m-1" onClick={()=>{addVarient()}}>
                + Add Variant     
        </div>
        <div>
           <VariantTable
                varienttable={varienttable}
                setVarienttable={setVarienttable}
           />


        </div>
      </div>
    
    );
}

export default VariantField;