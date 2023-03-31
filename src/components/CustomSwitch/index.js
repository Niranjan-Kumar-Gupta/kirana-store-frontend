import React from "react";
import { SelectButton } from "primereact/selectbutton";
import { Text } from "../Text";
import "./index.css";
 
function CustomSwitch({ options, value, handleSwitch = () => {} }) {
  const optionTemplate = (option) => {
    return (
      <div className="flex align-items-center gap-2">
        <i className={option.icon} />
        <Text type={'heading'}>{option.name}</Text>
      </div>
    );
  };

  const handleClick = (e) =>{
    if( e.value) handleSwitch(e.value)
  }

  return (
      <SelectButton
        options={options}
        value={value}
        onChange={handleClick}
        optionLabel={"name"}
        itemTemplate={optionTemplate}
        className={"custom-switch"}
      />
  );
}

export default CustomSwitch;
