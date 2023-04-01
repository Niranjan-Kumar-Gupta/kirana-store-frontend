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
    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };

    const priceEditor = (options) => {
        return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} mode="currency" currency="INR" locale="en-US" />;
    };

    const statusEditor = (options) => {
        return  <Dropdown value={options.value} onChange={(e) => options.editorCallback(e.value)} options={statusOptions} optionLabel="key" optionValue="value"
      />    };

   
    const priceBodyTemplate = (rowData) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(rowData.price);
    };
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
                <Column field="varients" header="Varients" style={{ width: '20%' }}></Column>
                <Column editMode field="SKUCode" header="SKUID" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>
                <Column editMode field="status" header="Stock"  editor={(options) => statusEditor(options)} style={{ width: '20%' }}></Column>
                <Column editMode field="price" header="Price" body={priceBodyTemplate} editor={(options) => priceEditor(options)} style={{ width: '25%' }}></Column>
                <Column rowEditor  headerStyle={{ width: '5%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                <Column exportable={false} headerStyle={{ width: '5%', minWidth: '1rem' }} body={actionBodyTemplate} bodyStyle={{ textAlign: 'center' }}></Column>
            </DataTable>
        </div>
    );
}