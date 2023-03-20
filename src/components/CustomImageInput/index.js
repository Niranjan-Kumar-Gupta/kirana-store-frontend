import { FileUpload } from "primereact/fileupload";
import "./index.css";
export const CustomImageInput = ({ label, setSelectedImage, disabled }) => {
  const handleUpload = (e) => {
    setSelectedImage(e.files[0]);
    e.options.clear();
  };
  return (
    <div className="flex file-upload">
      <FileUpload
        accept="image/*"
        mode="basic"
        auto
        customUpload={true}
        chooseLabel={label}
        uploadHandler={handleUpload}
        disabled={disabled}
      />
    </div>
  );
};
