import {ReactComponent as DashboardIcon} from "../../assets/navbarIcons/dashboard.svg";
import {ReactComponent as ProductIcon} from "../../assets/navbarIcons/products.svg";
import {ReactComponent as OrderIcon} from "../../assets/navbarIcons/orders.svg";
import {ReactComponent as CategoryIcon} from "../../assets/navbarIcons/category.svg";
import {ReactComponent as CustmerIcon} from "../../assets/navbarIcons/customer.svg";
import {ReactComponent as EnquiryIcon} from "../../assets/navbarIcons/enquiry.svg";
import {ReactComponent as CampaignIcon} from "../../assets/navbarIcons/campaign.svg";
import {ReactComponent as InventoryIcon} from "../../assets/navbarIcons/inventory.svg";


export const NavIcon = ({icon}) =>{
    switch(icon){
        case 'dashboard':
            return <DashboardIcon />
        case 'product':
            return <ProductIcon />
        case 'order':
            return <OrderIcon />
        case 'inventory':
            return <InventoryIcon />
        case 'category':
            return <CategoryIcon />
        case 'customer':
            return <CustmerIcon />
        case 'campaign':
            return <CampaignIcon />
        default:
            <p>Notfound</p>
    }
}