//This component completely relies on entityGridPage.
//And thanks to it, we are just defining the columns here!
// addCategoryIcon is used to show the category icon as the last column.
import React from "react";
import { constants } from "../../modules/constants";
import EntityGridPage from "../../commonComponents/entityGridPage";

const Vehicles = () => {
  return (
    <EntityGridPage
      apiURL={constants.VEHICLES_API_URL}
      addCategoryIcon
      entityName="vehicle"
      entityColumns={[
        {
          field: "ownerName",
          headerName: "Name",
          width: 150,
        },
        {
          field: "weight",
          width: 110,
          headerName: "Weight",
          type: "number",
        },
        {
          field: "yearOfManifacture",
          width: 90,
          headerName: "Year",
          type: "date",
        },
        {
          field: "manifacturer",
          headerName: "Manifacturer",
          width: 140,
        },
        {
          field: "categoryName",
          headerName: "Category",
          width: 130,
        },
      ]}
    />
  );
};

export default Vehicles;
