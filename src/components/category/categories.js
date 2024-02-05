//Category list view completely relies on entityGridPage.
//And thanks to it, we are just defining the columns here!
// addCategoryIcon is used to show the category icon as the last column.
import React from "react";
import { constants } from "../../modules/constants";
import EntityGridPage from "../../commonComponents/entityGridPage";

const Categories = () => {
  return (
    <EntityGridPage
      apiURL={constants.CATEGORIES_API_URL}
      addCategoryIcon
      entityName="category"
      entityColumns={[
        {
          field: "name",
          headerName: "Name",
          width: 250,
        },
        {
          field: "minWeight",
          width: 200,
          headerName: "Minimum",
          type: "number",
        },
        {
          field: "upTo",
          headerName: "Up To",
          width: 200,
          type: "number",
        },
      ]}
    />
  );
};

export default Categories;
