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
import { Text } from "../../components/Text";
import { Calendar } from 'primereact/calendar';
import { Button } from "primereact/button";
import { TreeTable } from 'primereact/treetable';

const CustomTable = (
                      {
                        tableName=null,
                        data=null,
                        columns=null,
                        globalSearch=true,
                        handleEdit = () => {},
                        handleDelete = () => {},
                        handleSelect = () => {},
                        onApplyFilter = () => {},
                        onApplySearch = () => {},
                        onClearFilter = () => {},
                        onClearSearch = () => {},
                        tableType = 'dataTable',
                        paginator = null
                      }
                    ) => {

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({});
    const [isFiltersInit, setIsFiltersInit] = useState(false);
    const [filtersData, setFiltersData] = useState({});
    const [isGlobalFilterClick, setIsGlobalFilterClick] = useState(false);
    const [selectedNodeKeys, setSelectedNodeKeys] = useState(null);

   
    
    const initFilters = () => {
        let initData = {...filters}
        columns.forEach(col => { 
                if (col.isFilter===true && col.filterType === 'input') {       
                    initData[col.field] = { value: null,constraints: [{ value: null}] }
                }else if (col.isFilter===true && col.filterType === 'dropdown' ) {           
                    initData[col.field] = { value: null}
                }else if (col.isFilter===true && col.filterType === 'date' ) {           
                  initData[col.field] = { value: null}
              }                          
        });  
        setFilters(initData)
        setGlobalFilterValue('');  
    };

    useEffect(()=>{
        initFilters()   
          const data = JSON.parse(localStorage.getItem(`${tableName}FiltersData`));
          //console.log(`${tableName}filtersData is...`, data)
          if (data && (Object.keys(data).length === 0 )) {
            //console.log('nope')
          } else {
            //console.log(data)
           // setFiltersData(data)
          }   
          
    },[])
    
    useEffect(()=>{
       if (tableName) {
          localStorage.setItem(`${tableName}FiltersData`, JSON.stringify(filtersData));
       }
    
    },[filtersData])
  

     const dropdownFilterTemplate = (field,dropdownItems,filterPlaceholder) => {
        //console.log('dropdownItems....',dropdownItems)
        return <Dropdown  
                value={filtersData[field]} 
                onChange={(e) => setFiltersData({...filtersData,[field]:e.value})} 
                options={dropdownItems}
                placeholder={filterPlaceholder} 
                className="p-column-filter" 
                showClear />;
      }

     const textFilterTemplate = (field,filterPlaceholder) => {
        //console.log('textItems....',field,filterPlaceholder)
         return <InputText  
                  value={filtersData[field] || ''} 
                  onChange={(e) => setFiltersData({...filtersData,[field]:e.target.value})}            
                  placeholder={filterPlaceholder} 
                  className="p-column-filter" 
                />;
      }
  
     const onClickFilter=(e)=>{        
        //console.log(e) 
        onApplyFilter(filtersData)
        const btn = document.querySelectorAll(".p-column-filter");
        let activeFilterIndex = 0

        columns.map((col,index)=>{
           if (col.isFilter) {
            if (filtersData.hasOwnProperty(col['field'])) {
              console.log(filtersData[col['field']],index,activeFilterIndex)
              if (filtersData[col['field']]) {
              // console.log(btn[index].children[0].children[0].style.color)
               btn[activeFilterIndex].children[0].children[0].style.color = 'white'
               btn[activeFilterIndex].classList.add('__activeFilter')           
              } 
           }
             activeFilterIndex += 1
           }
        })
       }

     const onClickClearFilter = (e)=>{       
        const btn = document.querySelectorAll(".p-column-filter");
        columns.map((col,index)=>{
          if (filtersData.hasOwnProperty(col['field']) && (col['field']===e.field)) {
              //console.log(filtersData[col['field']],index)
              if (filtersData[col['field']]) {
                setFiltersData({...filtersData,[e.field]: null})
                btn[index].classList.remove('__activeFilter')   
                btn[index].children[0].children[0].style.color = '#6c757d'        
              }
           }
        })
        onClearFilter(filtersData)
       }

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
        //console.log(globalFilterValue)
    }

    
    const onGlobalFilterClick = (e) => {
      //const value = e;
      if (globalFilterValue !== '') {
        if (isGlobalFilterClick) {
          setIsGlobalFilterClick(false)
          setGlobalFilterValue('')
          onClearSearch('')
        } else {
          setIsGlobalFilterClick(true)
          onApplySearch(globalFilterValue)  
        }       
      } 
      //console.log(globalFilterValue)
    
    }

    function handelKeyDown(e) {
    if (e.key==='Enter') {
      if (!isGlobalFilterClick) {
          onGlobalFilterClick()
       }else{
        onGlobalFilterClick()
       }
    }
    }

  const renderHeader = () => {
        return (
            <div className="flex justify-content-end __searchField">
                <span className="p-input-icon-right" onClick={onGlobalFilterClick}>  
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange}  placeholder="Keyword Search" onKeyPress={handelKeyDown}/>
                    <i className={!isGlobalFilterClick?"pi pi-search cursor-pointer":"pi pi-times cursor-pointer"} />
                </span>
            </div>
        );
    };
    const header = globalSearch ? renderHeader() :'';

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
            //console.log(rowData.url)
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
            onClick={(e) => handleSelect(rowData)}
            label="View Details"
          />
        )
      }

  //----------Date Filter--------------------------------

  const dateBodyTemplate = (rowData) => {
      return rowData.date;
    };
  const dateFilterTemplate = (field,placeholder) => {
    return <div className="card flex flex-column justify-content-center">
              <div>
                <Text>From</Text>
                <Calendar 
                  value={filtersData[`from${field}`] || ''}
                  onChange={(e) => setFiltersData({...filtersData,[`from${field}`]:e.target.value})} 
                  dateFormat="dd-mm-yy" 
                  placeholder="dd-mm-yyyy"
                  mask="99/99/9999" 
                  className="mt-1 mb-3 dateInput"
                  showIcon 
                  maxDate={new Date()}
                />
              </div>
              <div>
                <Text>To</Text>
                <Calendar 
                  value={filtersData[`to${field}`] || ''}
                  onChange={(e) => setFiltersData({...filtersData,[`to${field}`]:e.target.value})} 
                  dateFormat="dd-mm-yy" 
                  placeholder="dd-mm-yyyy"
                  mask="99/99/9999" 
                  className="mt-1 dateInput"
                  showIcon 
                  maxDate={new Date()}
                  minDate={filtersData[`from${field}`]}
                />
              </div>
           </div>


    };

    const dynamicColumns = columns.map((col, i) => {
        if (col?.isActions) {
                    if (col.actionType.length>1) {
                        return  <Column
                                    key={col.field}
                                    header="Actions"
                                    body={actionBodyTemplate}
                                    exportable={false}
                                    bodyStyle={{ width: "100px" }}
                                ></Column>
                    }else if (col.actionType[0]==='edit') {
                        return  <Column
                                    key={col.field}
                                    header="Actions"
                                    body={actionEditBodyTemplate}
                                    exportable={false}
                                    bodyStyle={{ width: "100px" }}
                                ></Column>
                    }else if (col.actionType[0]==='delete') {
                        return  <Column
                                    key={col.field}
                                    header="Actions"
                                    body={actionDeleteBodyTemplate}
                                    exportable={false}
                                    bodyStyle={{ width: "100px" }}
                                ></Column> 
                    }
        }else if(col?.viewDetails){
            return <Column
                        key={col.field}
                        body={viewDetailsBody}
                        bodyStyle={{ color: "#1C738E", minWidth: "120px" }}
                    />
              }        
               else{
                  if (col.filterType==='dropdown') {
                    return <Column 
                    key={col.field} 
                    columnKey={col.field} 
                    field={col.field} 
                    header={col.header} 
                    showFilterMatchModes={false}
                    filter={col.isFilter}
                    filterElement={dropdownFilterTemplate(col.field,col.dropdownItems,col.filterPlaceholder)}
                    onFilterApplyClick={(e)=>onClickFilter(e)}
                    onFilterClear={()=>{onClickClearFilter(col)}}  
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
                />
                  }
                else if (col.filterType==='date'){
                    return  <Column
                                key={col.field} 
                                field={col.field} 
                                header={col.header} 
                                showFilterMatchModes={false}
                                filterField={col.field} 
                                dataType="date"
                                style={{ minWidth: '1rem' }}
                                body={dateBodyTemplate}
                                filter filterElement={dateFilterTemplate(col.field,col.filterPlaceholder)} 
                                onFilterApplyClick={(e)=>onClickFilter(e)}
                                onFilterClear={()=>{onClickClearFilter(col)}} 
                                disabled={false} 
                                
                                />
               
                  }              
                  else{
                    return  <Column 
                    key={col.field} 
                    columnKey={col.field} 
                    field={col.field} 
                    header={col.header} 
                    expander = {col.expander}
                    showFilterMatchModes={false}
                    filter={col.isFilter}
                    filterElement={textFilterTemplate(col.field,col.filterPlaceholder)}
                    onFilterApplyClick={(e)=>onClickFilter(e)}
                    onFilterClear={()=>{onClickClearFilter(col)}}  
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
                />
                  }
                   
                 }
    });
     


  return ( <>
        <div>
            {
              tableType === 'dataTable'?<DataTable 
                value={data}
                tableStyle={{ minWidth: '50rem' }} 
                className="skalebot-table"
                filters={filters}         
                header={header} emptyMessage="No data found."
                >
              {dynamicColumns}
               </DataTable>
               :
               <TreeTable 
                  value={data}
                  tableStyle={{ minWidth: '50rem' }} 
                  className="skalebot-table"
                  filters={filters}         
                  header={header} emptyMessage="No data found."
                  selectionMode="checkbox" 
                  selectionKeys={selectedNodeKeys} 
                  onSelectionChange={(e) => setSelectedNodeKeys(e.value)}
                  >
                  {dynamicColumns}
              </TreeTable>
            }
        </div>
       {
        paginator && <div className="flex  justify-content-end">
                        <CustomPaginator
                          page={paginator.page}
                          limit={paginator.limit}
                          totalRecords={paginator.totalRecords}
                          changePage={paginator.changePage}
                        />
                      </div>
       }
        </>
  )
}

export default CustomTable