//This component completely relies on entityGridPage.
//And thanks to it, we are just defining the columns here!

import { constants } from "../../modules/constants";
import EntityGridPage from "../../commonComponents/entityGridPage";

const Manifacturers = () => {
  return (
    <EntityGridPage
      apiURL={constants.MANIFACTURERS_API_URL}
      entityName="manifacturer"
      entityColumns={[
        {
          field: "name",
          headerName: "Name",
          width: 250,
        },
      ]}
    />
  );
};

export default Manifacturers;
