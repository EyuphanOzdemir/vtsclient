import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import "bootstrap/dist/js/bootstrap.bundle.min";
import GlobalDataContext from "./contexts/GlobalDataContext";
import NavMenu from "./navMenu";
import NoMatch from "./components/noMatch";
import Loader from "./commonComponents/loader";
import { constants } from "./modules/constants";
import useFetch from "use-http";
import Category from "./components/category/category";
import Categories from "./components/category/categories";
import Vehicle from "./components/vehicle/vehicle";
import Vehicles from "./components/vehicle/vehicles";
import Manifacturer from "./components/manifacturer/manifacturer";
import Manifacturers from "./components/manifacturer/manifacturers";
import * as utilityMethods from "./modules/utilityMethods";

const App = () => {
  const [manifacturers, setManifacturers] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState("");

  const { get, data } = useFetch(
    constants.MANIFACTURERS_API_URL,
    constants.FETCH_OPTIONS
  );

  useEffect(() => {
    let _manifacturers = [];
    (async () => {
      setLoading(true);
      let result = await get();
      if (result) _manifacturers = result;
      else {
        setError(
          "Manifacturers could not be fetched. There must be a problem with the network or the web API."
        );
      }
      setManifacturers(_manifacturers);
      setLoading(false);
    })();
  }, [get]);

  const navMenu = () => {
    return <NavMenu />;
  };

  const messagePanel = () => {
    return (
      <>
        <p>{error}</p>
        <p>{utilityMethods.stringifyFetchData(data)}</p>
      </>
    );
  };

  const body = () => {
    return (
      <div className="container mt-3">
        <GlobalDataContext.Provider value={{ manifacturers, setManifacturers }}>
          <Switch>
            <Route exact path="/">
              <Redirect to="/vehicles" />
            </Route>
            <Route
              path={["/category/:id", "/category"]}
              children={<Category />}
            />
            <Route exact path="/categories" component={Categories} />
            <Route path={["/vehicle/:id", "/vehicle"]} children={<Vehicle />} />
            <Route exact path="/vehicles" component={Vehicles} />
            <Route
              path={["/manifacturer/:id", "/manifacturer"]}
              children={<Manifacturer />}
            />
            <Route exact path="/manifacturers" component={Manifacturers} />
            <Route path="*">
              <NoMatch />
            </Route>
          </Switch>
        </GlobalDataContext.Provider>
      </div>
    );
  };

  const loadingOrBody = () => (loading ? <Loader /> : body());
  return (
    <>
      {messagePanel()}
      {navMenu()}
      {loadingOrBody()}
    </>
  );
};

export default App;
