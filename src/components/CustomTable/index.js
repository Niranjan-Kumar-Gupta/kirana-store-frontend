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
import SkalebotCarousel from "../../components/SkalebotCarousel";
import "./style.css";

const CustomTable = ({data,columns,handleEdit,handleDelete,handleOrderSelect,paginator}) => {

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

    const [column,setColumn]=useState([])


    useEffect(()=>{
        let cols = []
         columns.map((col, i) => {  
            if (col?.isActions) {
                if (col.actionType.length>1) {
                    cols.push( <Column
                                header="Actions"
                                body={actionBodyTemplate}
                                exportable={false}
                                bodyStyle={{ width: "100px" }}
                            ></Column>)
                }else if (col.actionType[0]==='edit') {
                    cols.push( <Column
                                header="Actions"
                                body={actionEditBodyTemplate}
                                exportable={false}
                                bodyStyle={{ width: "100px" }}
                            ></Column>)
                }else if (col.actionType[0]==='delete') {
                    cols.push( <Column
                                header="Actions"
                                body={actionDeleteBodyTemplate}
                                exportable={false}
                                bodyStyle={{ width: "100px" }}
                            ></Column> )
                }
            }else if(col?.viewDetails){
                 cols.push(<Column
                             body={viewDetailsBody}
                             bodyStyle={{ color: "#1C738E", minWidth: "120px" }}
                         />)
            }        
           else{
                cols.push(<Column 
                    key={col.field} 
                    columnKey={col.field} 
                    field={col.field} 
                    header={col.header} 
                    showFilterMatchModes={false}
                    filter={col.isFilter}
                    filterElement={col.filterType==='dropdown'?dropdownFilterTemplate(col.field,col.dropdownItems,col.filterPlaceholder):''}
                    onFilterApplyClick={(e)=>onClickFilter(e)}
                    onFilterClear={()=>{onClearFilter(col)}}  
                    body={col.isImageBody?imageBodyTemplate:''}
                    headerStyle={col.isImageBody?
                          {
                           display: "flex",
                           justifyContent: "center",
                           marginTop: "5px",
                           }:
                           ''
                       }
                    bodyStyle={col.isImageBody?
                       { 
                        display: "flex",
                        justifyContent: "center" 
                       }:
                       {
                       width: "auto",
                       minWidth: "150px",
                       maxWidth: "350px",
                       textOverflow: "ellipsis",
                     }}
                   />)
            }
        });    
        setColumn(prevCol => [...prevCol, cols])
        console.log(column,cols)
    },[])

    const dynamicColumns = column.map((col, i) => {
        return col
    });
   
    useEffect(()=>{
        initFilters()
        console.log(paginator)
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
       // console.log(filtersData)
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
  
        // console.log(rowData)
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
 

    const actionEditBodyTemplate = (rowData) => {
        return (
          <div className="flex justify-content-end align-items-center gap-3">
            <CustomButton
              varient="icon-button"
              icon={<Edit />}
              onClick={() => handleEdit(rowData)}        
            />
          </div> 
        );
      };
    const actionDeleteBodyTemplate = (rowData) => {
         return (
           <div className="flex justify-content-end align-items-center gap-3">
             <CustomButton
               varient="icon-button"
               icon={<Delete />}
               onClick={() => handleDelete(rowData)}
             />
           </div> 
         );
       };
 
      
    const imageBodyTemplate = (rowData) => {
        // console.log(rowData)
         if ( Array.isArray(rowData.url) && rowData.url && rowData.url?.length>0) {
            console.log(rowData.url)
            return  <SkalebotCarousel carouselItems={rowData.url} />;      
         }
         else  {
            return (
                <div
                    className="flex justify-content-center"
                    style={{ width: "120px", height: "80px" }}
                >
                    <img
                    src={`${rowData.url}?v=${rowData.updatedAt}`}
                    onError={(e) => (e.target.src = "./images/ImgPlaceholder.svg")}
                    style={{ maxWidth: "100%", height: "100%" }}
                    />
                </div>
                );
        
        } 
    };

    const viewDetailsBody = (rowData) => {
        return (
          <CustomButton
            varient="icon-button"
            onClick={(e) => handleOrderSelect(rowData)}
            label="View Details"
          />
        )
      }


  return ( <>
        <div>
            <DataTable 
                value={data}
                tableStyle={{ minWidth: '50rem' }} 
                className="skalebot-table"
                filters={filters}         
                header={header} emptyMessage="No customers found."
                >
                {dynamicColumns}
            </DataTable>
        </div>
        <div className="flex  justify-content-end">
          <CustomPaginator
            page={paginator.page}
            limit={paginator.limit}
            totalRecords={paginator.totalRecords}
            changePage={paginator.changePage}
          />
        </div>
        </>
  )
}

export default CustomTable