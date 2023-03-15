import { useSelector, useDispatch } from "react-redux";
import { Text } from "../Text";
import styles from "./notice.style.module.css";
import { changeShowNotice } from "../../reducers/appSlice";
import { useEffect } from "react";

const Notice = ({message}) => {
    const dispatch =  useDispatch();
    const { showNotice } = useSelector(state => state.application);
    
    const handleCancel = () =>{
        dispatch(changeShowNotice(false));
    }

    const autoCancel =()=>{
        setTimeout(()=>{
            handleCancel()
        },10000)
    } 

    useEffect(()=>{
        if(showNotice){
            autoCancel()
        }
    },[showNotice])

    return (<div className={`w-full flex justify-content-between align-items-center my-1 ${styles['notice-wrapper']}`}>
            <div className="flex justify-content-start align-items-center gap-2"><i className={`pi pi-info-circle ${styles['icon-color']}`}></i> <Text type={'sub-heading'} color={"#495057"}>{message}</Text></div>
            <i className={`pi pi-times-circle cursor-pointer ${styles['icon-color']}`} onClick={handleCancel} />
    </div>)
}

export default Notice;