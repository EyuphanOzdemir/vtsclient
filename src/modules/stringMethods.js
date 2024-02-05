//some common string methods.
//not used in this project but we may need them.

export var stringMethods = (function () {
  const deQuote = (str) => str.replace("'", "");
  const deDoubleQuote = (str) => str.replace('"', "");
  const makeStrong = (text) => {
    return (
      <div className="gridHeader">
        <strong>{text}</strong>
      </div>
    );
  };

  return {
    deQuote,
    deDoubleQuote,
    makeStrong,
  };
})();
