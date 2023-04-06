import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
// import { ProductService } from './service/ProductService';
import { Button } from 'primereact/button';
import { ReactComponent as Delete } from '../../svg/delete.svg'
import "./index.css"
export default function VariantTable({varienttable, setVarienttable}) {
    const onRowEditComplete = (e) => {
        let _varienttable = [...varienttable];
        let { newData, index } = e;
        _varienttable[index] = newData;
        setVarienttable(_varienttable);
    };
    const statusOptions = [
        { key: "Available", value: "Available" },
        { key: "Unavailable", value: "Unavailable" }
      ]

    const onCellEdit = (e, rowIndex,field) => {
        let _varienttable = [...varienttable];
        _varienttable[rowIndex] ={..._varienttable[rowIndex] ,
                                    [field]: e.value
                                    }; 
        setVarienttable(_varienttable);
      }

    const textEditor = (rowData,colData) => {
        if(!rowData.isActive){
            return (
                <div className='p-1 pl-2'>{rowData.SKUCode}</div>
            )
        }
        return <InputText type="text" value={rowData.SKUCode} 
            onChange={(e) => onCellEdit({value:e.target.value}, colData.rowIndex,colData.field)} 
         />;
    };

    const priceEditor = (rowData,colData) => {
        if(!rowData.isActive){
            let x= new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(rowData.price)
            return (
                <div className='p-1 pl-2'>{x}</div>
            ) 
        }
        return <InputNumber value={rowData.price} 
        onValueChange={(e) => onCellEdit(e, colData.rowIndex,colData.field)}
        mode="currency" currency="INR" locale="en-US" />;
    };

    const statusEditor = (rowData,colData) => {
        if(!rowData.isActive){
            return (
                <div className='p-1 pl-2'>{rowData.status}</div>
            )
        }
        return  <Dropdown value={rowData.status} onChange={(e) => onCellEdit(e, colData.rowIndex,colData.field)} 
        options={statusOptions} 
        defaultValue={"Available"} 
        optionLabel="key" 
        optionValue="value"/>    };

    const deleteSelectedProducts = (rowData) => {
        let _varienttable = [...varienttable];
        _varienttable = _varienttable.map((val) => {
            if(val.key===rowData.key){
                return {...val,isActive:!val.isActive} 
            }
            else return val
        });
        setVarienttable(_varienttable);
    };

    const actionBodyTemplate = (rowData) => {
        if(rowData.isActive){return (
                <Delete onClick={() => deleteSelectedProducts(rowData)}/>
        );}
        else { 
            return (
            <i className="pi pi-refresh" style={{ fontSize: '1rem' }} onClick={() => deleteSelectedProducts(rowData)} ></i>
            );}
    };
  
    const isSelectable = (data) => {
        const { isActive} = data;
        return (isActive === true)&&(data.field !== 'delete');  
    };
    
    const isRowSelectable = (e) => {
        return isSelectable(e.data);
      };
    const rowClassName = (data) => (isSelectable(data) ? '' : 'not-selectable');

    return (
        <div className="card p-fluid">
            <DataTable value={varienttable} editMode="row" dataKey="id"
             onRowEditComplete={onRowEditComplete}  
             isDataSelectable={isRowSelectable} 
             rowClassName={rowClassName}
             scrollable scrollHeight="400px"
             tableStyle={{ minWidth: '50rem' }}>
                <Column field="label" header="Variant" style={{ width: '20%' }}></Column>
                <Column editMode field="SKUCode" header="SKUID" body={textEditor} style={{ width: '20%' }}></Column>
                <Column editMode field="status" header="Stock"  body={statusEditor} style={{ width: '20%' }}></Column>
                <Column editMode field="price" header="Price"  body={priceEditor} style={{ width: '25%' }}></Column>
                <Column exportable={false} headerStyle={{ width: '5%', minWidth: '1rem' }} body={actionBodyTemplate} bodyStyle={{ textAlign: 'center' }}></Column>
            </DataTable>
        </div>
    );
}