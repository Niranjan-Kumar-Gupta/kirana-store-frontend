import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { ProductService } from '../../api/ProductService';
import { Dropdown } from "primereact/dropdown";        
import CustomPaginator from '../CustomPaginator';
import { ReactComponent as Edit } from "../../svg/edit.svg";
import { ReactComponent as Delete } from "../../svg/delete.svg";
import { DeleteAlert } from "../../components/Alert/DeleteAlert";
import { CustomButton } from "../../components/CustomButton";

const CustomTable = ({data,columns,handleEdit,handleDelete}) => {

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({});

    const initFilters = () => {
        let initData = {...filters}
        columns.forEach(col => { 
                if (col.isFilter===true && col.filterType === 'input') {       
                    initData[col.field] = { value: null,constraints: [{ value: null}] }
                }else if (col.isFilter===true && col.filterType === 'dropdown' ) {           
                    initData[col.field] = { value: null}
                }             
        });  
        setFilters(initData)
        setGlobalFilterValue('');  
    };
   
    useEffect(()=>{
        initFilters()
       // console.log(filters)
       //handleDelete('rowData')
    },[]) 
  
    const [filtersData, setFiltersData] = useState({});
    const [isApply, setIsApply] = useState(false);

    const dropdownFilterTemplate = (field,dropdownItems,filterPlaceholder) => {
        //  console.log('dropdownItems....',dropdownItems)
        return <Dropdown  
                value={filtersData[field]} 
                onChange={(e) => setFiltersData({...filtersData,[field]:e.value})} 
                options={dropdownItems}
                placeholder={filterPlaceholder} 
                className="p-column-filter" 
                showClear />;
      }


    
    const onClickFilter=(e)=>{   
        columns.forEach(col => {
            if (col.field === e.field) {
                if (col.filterType!=='dropdown') {
                    setFiltersData({...filtersData,[e.field]: e.constraints.constraints[0].value})
                }
            }
          
        });       
      //  console.log(filtersData) 
       }

       const onClearFilter = (col)=>{  
        setFiltersData({...filtersData,[col.field]: null})
       }

       useEffect(()=>{
        console.log(filtersData)
       },[filtersData])

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
    }

    const managePaginationData = ()=>{
            let filterData = []
            for (var key in filtersData) {
            // console.log(key,filters1[key].value);
            if (filtersData[key]) {
                //console.log(key);
                filterData.push({
                    key:key,
                    value:filtersData[key]
                })
            }
            }
            let paginationData = {
            filterData,
            globalFilterValue
            };
            return paginationData;
       }
       


    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };
    const header = renderHeader();

    const actionBodyTemplate = (rowData) => {
  
        console.log(rowData)
        return (
          <div className="flex justify-content-end align-items-center gap-3">
            <CustomButton
              varient="icon-button"
              icon={<Edit />}
              onClick={() => handleEdit(rowData)}        
            />
            <CustomButton
              varient="icon-button"
              icon={<Delete />}
              onClick={() => handleDelete(rowData)}
            />
          </div> 
        );
      };

    const dynamicColumns = columns.map((col, i) => {
        return <Column 
                 key={col.field} 
                 columnKey={col.field} 
                 field={col.field} 
                 header={col.header} 
                 showFilterMatchModes={false}
                 filter={col.isFilter}
                 filterElement={col.filterType==='dropdown'?dropdownFilterTemplate(col.field,col.dropdownItems,col.filterPlaceholder):''}
                 onFilterApplyClick={(e)=>onClickFilter(e)}
                 onFilterClear={()=>{onClearFilter(col)}}  
                />;
    });

  return (
    <div>
        <DataTable 
            value={data}
            tableStyle={{ minWidth: '50rem' }} 
            className="skalebot-table"
            filters={filters}         
            paginator rows={2} 
            header={header} emptyMessage="No customers found."
            >
            {dynamicColumns}
            <Column
              header="Actions"
              body={actionBodyTemplate}
              exportable={false}
              bodyStyle={{ width: "100px" }}
            ></Column>
        </DataTable>
        
    </div>
  )
}

export default CustomTable