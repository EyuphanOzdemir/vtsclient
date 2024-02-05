//Creates a paginated Material-UI grid.
//Data us fetched by the given apiFunction as a prop.
//Columns are taken as props as well.
//it supports automatic select components, search text box, refresh button, etc.
//In this project, this is used in another common component called "EntityGridPage"
//And all the list views (Vehicles, Manifacturers, Categories) use EntityGridPage.
import React, { useRef } from "react";
import { DataGrid } from "@material-ui/data-grid";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";
import { stringMethods } from "../modules/stringMethods";
import { renderCellExpand } from "../commonComponents/gridCellRenderer";
import SelectList from "./selectList";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
  },
}));

const EasyGrid = ({
  apiFunction,
  mainWidth,
  enableSearch,
  selectLists,
  columns,
  searchHelper,
  enableCellExpand,
  showRefreshButton,
}) => {
  const classes = useStyles();
  const searchRef = useRef(null);
  const pageSizeRef = useRef(null);

  const [page, setPage] = React.useState(0);
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pageSize, setPageSize] = React.useState(10);
  const [totalRowCount, setTotalRowCount] = React.useState(0);
  const [error, setError] = React.useState(null);
  const [search, setSearch] = React.useState("");

  const showSelectLists = selectLists && selectLists.length > 0;
  let initialSelectValues = [];
  if (showSelectLists)
    initialSelectValues = selectLists.map((list) =>
      list.defaultValue.toString()
    );
  const [selectValues, setSelectValues] = React.useState(initialSelectValues);

  const updateSelectValue = (index, value) => {
    setSelectValues((previousValues) => {
      let newValues = [...previousValues];
      newValues[index] = value.toString();
      if (page !== 0) setPage(0);
      return newValues;
    });
  };

  const loadServerRows = React.useCallback(async () => {
    const result = await apiFunction(
      page,
      pageSize,
      searchRef?.current?.value,
      selectValues
    );
    if (result) {
      setError(null);
      return result;
    } else {
      setError("An error occured");
      return null;
    }
  }, [apiFunction, page, pageSize, selectValues]);

  const handlePageChange = (params) => {
    setPage(params.page);
  };

  const loadData = React.useCallback(async () => {
    setLoading(true);
    let result = await loadServerRows();
    if (result) {
      let rowCount = result.rowCount;
      let rows = result.rows;
      setTotalRowCount(rowCount);
      setRows(rows);
    }
    setLoading(false);
  }, [loadServerRows]);

  const handleRefresh = async (e) => {
    e.preventDefault();
    if (
      searchRef.current.value.length >= 3 ||
      searchRef.current.value.length === 0
    ) {
      loadData();
      if (page !== 0) setPage(0);
    }
  };

  React.useEffect(() => {
    (async () => await loadData())();
  }, [loadData]);

  const renderCell = (column) => {
    if (column.renderCell) return column.renderCell;
    else {
      if (enableCellExpand) return renderCellExpand;
    }
  };

  return (
    <div className="container">
      <div id="refreshBar">
        {showSelectLists && (
          <>
            {selectLists.map((selectList, index) => (
              <SelectList
                formControlClassName={classes.formControl}
                id={index}
                selectList={selectList}
                onChangeMethod={updateSelectValue}
                selectValues={selectValues}
                key={index}
              />
            ))}
          </>
        )}

        {enableSearch && (
          <FormControl className={classes.formControl}>
            <TextField
              variant="outlined"
              value={search}
              label="Search"
              placeholder="0 or at least 3 characters..."
              onChange={(e) => setSearch(e.target.value)}
              inputRef={searchRef}
              title={searchHelper}
            />
          </FormControl>
        )}

        {(showRefreshButton || enableSearch) && (
          <FormControl className={classes.formControl}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              onClick={handleRefresh}
              className="btn-block"
              style={{ textTransform: "none" }}
            >
              {loading && (
                <span className="spinner-border spinner-border-sm"></span>
              )}
              <span>Refresh</span>
            </Button>
          </FormControl>
        )}
      </div>

      <div>
        <FormControl className={classes.formControl}>
          <FormHelperText>{error && <span>{error}</span>}</FormHelperText>
        </FormControl>
      </div>

      <div>
        <FormControl className={classes.formControl} variant="outlined">
          <InputLabel id="pageSizeLabel">Rows per page</InputLabel>
          <Select
            labelId="pageSizeLabel"
            id="pageSizeSelect"
            value={pageSize}
            inputRef={pageSizeRef}
            onChange={(e) => {
              setPageSize(e.target.value);
              if (page !== 0) setPage(0);
            }}
          >
            (
            <MenuItem value={10} key="10">
              10
            </MenuItem>
            <MenuItem value={20} key="20">
              20
            </MenuItem>
            )
            <MenuItem value={50} key="50">
              50
            </MenuItem>
          </Select>
        </FormControl>
      </div>
      <div id="gridContainer" style={{ width: mainWidth }}>
        <DataGrid
          autoHeight={true}
          columns={columns.map((column) => ({
            ...column,
            disableClickEventBubbling: true,
            renderHeader: () => stringMethods.makeStrong(column.headerName),
            renderCell: renderCell(column),
            cellClassName: "dataGridCell",
          }))}
          rows={rows}
          pagination
          pageSize={pageSize}
          rowCount={totalRowCount}
          paginationMode="server"
          onPageChange={handlePageChange}
          loading={loading}
          error={error}
          rowsPerPageOptions={[]}
          page={page}
        />
      </div>
    </div>
  );
};

export default EasyGrid;
