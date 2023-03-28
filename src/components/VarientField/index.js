import { InputText } from "primereact/inputtext";
import { useState } from "react";
import {ReactComponent as Delete} from "../../svg/delete.svg"
import { CustomButton } from '../../components/CustomButton';

function VariantField({field,className,placeholder,varient,setVarient}) {
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
        setVarient(temp)
    }
    const editVarientoption=(id,index,value)=>{
        let temp=varient;
        temp[id].value[index]=value;
        setVarient(temp)
    }

    const addVarientoption=(id)=>{
        let temp=varient;
        temp[id].value.push('');
        setVarient([...temp])
    }

    const addVarient=()=>{
        let temp=varient;
        temp.push(
            {id: temp.length+1,
             option:'',
             value:[]}
             )
        setVarient([...temp]);
    }

    
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
                        <div>Options</div>
                     {(x.value) && x.value.map((item,key)=>{
                           return( 
                                <div className="flex align-items-center w-12 justify-content-end">
                                      <InputText
                                        id={key}
                                        className={`my-2 w-12 `}
                                        placeholder={'value'}
                                        defaultValue={item}
                                        onChange={(e)=>{editVarientoption(pkey,key,e.target.value)}}
                                    />
                                    <Delete className="m-2" onClick={()=>{delete_varient(pkey,key)}}/> 
                                </div>
                           )
                        })}
                                <div className="flex w-10" onClick={()=>{addVarientoption(pkey)}}>
                                    + Add Option     
                                </div>
                        <div>
                        </div>
                    </div>
                </div>
            );
        })}
        </div>
        <div className="p-4 w-4 m-2" onClick={()=>{addVarient()}}>
                + Add Variant     
        </div>
      </div>
    
    );
}

export default VariantField;