import React from 'react';
import { BreadCrumb } from 'primereact/breadcrumb';
import "./index.css"

export default function CustomBreadcrumb({className='',itemslist}) {
    const  home= { icon: 'pi pi-home', url: '/' };
    return (
        <BreadCrumb className={`bg-transparent rm-breadcrumb ${className}`}   model={itemslist} home={home} />
    )
}
        