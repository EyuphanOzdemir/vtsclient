//All the list views (Vehicles, Manifacturers, Categories) use EntityGridPage, thus EasyGrid.
//EditOrDelete link is automatically created as the first column.
//Columns indicated as  a prop are added to this column.
//Lastly if category icon is needed, it is added as the last column.

import React, { useCallback } from "react";
import EasyGrid from "../commonComponents/easyGrid";
import { constants } from "../modules/constants";
import useFetch from "use-http";
import { Link } from "react-router-dom";

const EntityGridPage = ({
  entityName,
  apiURL,
  entityColumns,
  addCategoryIcon,
}) => {
  const { get } = useFetch(apiURL, constants.FETCH_OPTIONS);

  const getList = useCallback(
    async (page, pageSize) => {
      return await get(
        "/?page=" + page.toString() + "&pageSize=" + pageSize.toString()
      );
    },
    [get]
  );

  const generateEditDeleteLink = (params) => {
    return (
      <Link to={`/${entityName}/${params.row.id}`}>Edit or Delete</Link> //or params.getValue("id")
    );
  };

  const generateIcon = (params) => {
    const iconFileName = params.value;
    return (
      <img
        src={constants.CATEGORIES_ICON_URL + iconFileName}
        width="100px"
        height="100px"
        alt={iconFileName}
      />
    );
  };

  const allColumns = [
    {
      field: "___Edit___",
      headerName: "Action",
      width: 200,
      renderCell: (params) => generateEditDeleteLink(params),
    },
    ...entityColumns,
  ];

  if (addCategoryIcon)
    allColumns.push({
      field: "iconFileName",
      headerName: "Icon",
      width: 200,
      renderCell: (params) => generateIcon(params),
    });

  return <EasyGrid columns={allColumns} apiFunction={getList} />;
};

export default EntityGridPage;
