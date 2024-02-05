//to show the user that she tried to reach a non-existent url by changing URL editor of the browser.
import React from "react";
import { useLocation } from "react-router-dom";
export default function NoMatch() {
  let location = useLocation();
  return (
    <div>
      <h3>
        Sorry, there is no page like <code>{location.pathname}</code>
      </h3>
    </div>
  );
}
