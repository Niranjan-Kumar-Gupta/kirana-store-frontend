import styles from "./style.module.css";
export const Text = ({type,color,style, children,cust=''}) =>{
    return <div className={`${styles[type]} ${cust} ${styles['custom-text']}`} style={{color:color,...style}}>{children}</div>
}