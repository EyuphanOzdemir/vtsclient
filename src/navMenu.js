import { NavLink } from "react-router-dom";
import {
  faCog,
  faCarSide,
  faIndustry,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NavMenu() {
  return (
    <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light border-bottom box-shadow mb-3 divOfNavMenu">
      <div className="container">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target=".navbar-collapse"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="navbar navbar-collapse collapse d-sm-inline-flex">
          <ul className="navbar-nav flex-grow-1">
            <li className="nav-item">
              <NavLink
                to={"/Vehicles"}
                className="nav-link text-primary mainMenuListItem"
                activeClassName="activeLink"
              >
                <FontAwesomeIcon icon={faCarSide} color="blue" size="lg" />{" "}
                Vehicles
              </NavLink>
              <NavLink
                to={"/Vehicle"}
                className="nav-link text-primary mainMenuListItem"
                activeClassName="activeLink"
              >
                <FontAwesomeIcon icon={faCarSide} color="blue" size="lg" />{" "}
                Create/Edit Vehicle
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to={"/Categories"}
                className="nav-link text-primary mainMenuListItem"
                activeClassName="activeLink"
              >
                <FontAwesomeIcon icon={faCog} color="blue" size="lg" />{" "}
                Categories
              </NavLink>
              <NavLink
                to={"/Category"}
                className="nav-link text-primary mainMenuListItem"
                activeClassName="activeLink"
              >
                <FontAwesomeIcon icon={faCog} color="blue" size="lg" />{" "}
                Create/Edit Category
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to={"/Manifacturers"}
                className="nav-link text-primary mainMenuListItem"
                activeClassName="activeLink"
              >
                <FontAwesomeIcon icon={faIndustry} color="blue" size="lg" />{" "}
                Manifacturers
              </NavLink>
              <NavLink
                to={"/Manifacturer"}
                className="nav-link text-primary mainMenuListItem"
                activeClassName="activeLink"
              >
                <FontAwesomeIcon icon={faIndustry} color="blue" size="lg" />{" "}
                Create/Edit Manifacturer
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
