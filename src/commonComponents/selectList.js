//this is used by EasyGrid if the grid view includes some automatic select fields.

import React from "react";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

export default function selectList({
  formControlClassName,
  id,
  selectList,
  onChangeMethod,
  selectValues,
}) {
  const selectListLabelId = "selectListLabel" + id.toString();
  const selectId = "select" + id.toString();
  return (
    <FormControl
      style={{ width: "100px" }}
      className={formControlClassName}
      variant="outlined"
    >
      <InputLabel id={selectListLabelId}>{selectList.label}</InputLabel>
      <Select
        labelId={selectListLabelId}
        id={selectId}
        name={selectId}
        value={parseInt(selectValues[id])}
        onChange={(e) => onChangeMethod(id, e.target.value)}
      >
        {selectList.options.map((option, index) => (
          <MenuItem value={option.key} key={index}>
            {option.value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
