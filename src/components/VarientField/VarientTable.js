import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
// import { ProductService } from './service/ProductService';

export default function VariantTable({varienttable, setVarienttable}) {
    // const [products, setProducts] = useState(null);
    const [statuses] = useState(['INSTOCK', 'LOWSTOCK', 'OUTOFSTOCK']);

    // useEffect(() => {
    //     ProductService.getProductsMini().then((data) => setProducts(data));
    // }, []); // eslint-disable-line react-hooks/exhaustive-deps


    const onRowEditComplete = (e) => {
        let _varienttable = [...varienttable];
        let { newData, index } = e;

        _varienttable[index] = newData;

        setVarienttable(_varienttable);
    };

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };

    const priceEditor = (options) => {
        return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} mode="currency" currency="INR" locale="en-US" />;
    };

    const stockEditor = (options) => {
        return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)}  locale="en-US" />;
    };


    const priceBodyTemplate = (rowData) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rowData.price);
    };

    return (
        <div className="card p-fluid">
            <DataTable value={varienttable} editMode="row" dataKey="id" onRowEditComplete={onRowEditComplete} tableStyle={{ minWidth: '50rem' }}>
                <Column field="varients" header="Varients" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>
                <Column field="SKUID" header="SKUID" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>
                <Column field="price" header="Price"  editor={(options) => stockEditor(options)} style={{ width: '20%' }}></Column>
                <Column field="price" header="Price" body={priceBodyTemplate} editor={(options) => priceEditor(options)} style={{ width: '20%' }}></Column>
        
                <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
            </DataTable>
        </div>
    );
}