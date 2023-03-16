import './index.css';
import { Paginator } from 'primereact/paginator';
import { useEffect, useState } from 'react';
import { classNames } from 'primereact/utils'
import { Ripple } from 'primereact/ripple';
import { useDispatch } from 'react-redux';

const CustomPaginator = ({page,limit, totalRecords, changePage}) =>{
    const [basicFirst, setBasicFirst] = useState(0);
    const [basicRows, setBasicRows] = useState(limit);

    const dispatch  = useDispatch();

    const handlePageChange = (event) =>{
        setBasicFirst(event.first);
        setBasicRows(event.rows);
        dispatch(changePage(event.page));
    }

    const customTemplate = {
        layout: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink',
        'FirstPageLink':(options)=>{
          return (
            <button type="button" className={options.className} onClick={options.onClick} disabled={options.disabled}>
                <i className="pi pi-angle-double-left"></i>
                <Ripple />
            </button>
        )
        },
        'PrevPageLink':(options)=>{
          return (
            <button type="button" className={options.className} onClick={options.onClick} disabled={options.disabled}>
                <i className="pi pi-angle-left"></i>
                <Ripple />
            </button>
        )
        },
        'NextPageLink':(options)=>{
          return (
            <button type="button" className={options.className} onClick={options.onClick} disabled={options.disabled}>
                <i className="pi pi-angle-right"></i>
                <Ripple />
            </button>
        )
        },
        'LastPageLink':(options)=>{
          return (
            <button type="button" className={options.className} onClick={options.onClick} disabled={options.disabled}>
                <i className="pi pi-angle-double-right"></i>
                <Ripple />
            </button>
        )
        },
        'PageLinks': (options) => {
          if ((options.view.startPage === options.page && options.view.startPage !== 0) || (options.view.endPage === options.page && options.page + 1 !== options.totalPages)) {
              const className = classNames(options.className, { 'p-disabled': true });
    
              return <span className={className} style={{ userSelect: 'none' }}>...</span>;
          }
    
          return (
              <button type="button" className={options.className} onClick={options.onClick}>
                  {options.page + 1}
                  <Ripple />
              </button>
          )
      },
      }
    
      useEffect(()=>{
        setBasicFirst(page*limit);
      },[])
    return (<Paginator 
            template={customTemplate} 
            pageLinkSize={5}
            first={basicFirst}
            rows={basicRows}
            totalRecords={totalRecords}
            onPageChange={handlePageChange}
            className='custom-paginator'
            />)
}

export default CustomPaginator;