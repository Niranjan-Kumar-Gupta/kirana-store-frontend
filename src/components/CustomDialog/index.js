import "./customDialogStyle.css";
import { Dialog } from "primereact/dialog";
import { Text } from "../Text";

const CustomDialog = ({ header, visible, footer, onHide = () => {}, children }) => {
  const dialogHeader = () =>{
    return <Text type={'heading'}><span style={{textDecorationLine:"underline", textDecorationStyle:"dashed"}}>{header}</span></Text>
  }
  return (
    <Dialog
      header={dialogHeader}
      visible={visible}
      onHide={onHide}
      footer={footer}
      className="custom-dialog"
    >
      {children}
    </Dialog>
  );
};

export default CustomDialog;
