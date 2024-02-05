//This is used in Manifacturer component to uodate the manifacturers object of App.
//And then App refreshes the global data context that includes manifacturers.
export var manifacturerMethods = (function () {
  const addManifacturer = (manifacturerList, manifacturer) => {
    let newList = [...manifacturerList, manifacturer];
    return newList;
  };

  const updateManifacturer = (manifacturerList, manifacturer) => {
    return manifacturerList.map(function (m) {
      return m.id === manifacturer.id
        ? { id: m.id, name: manifacturer.name }
        : m;
    });
  };

  const deleteManifacturer = (manifacturerList, id) => {
    return manifacturerList.filter((m) => m.id !== id);
  };

  return {
    addManifacturer,
    updateManifacturer,
    deleteManifacturer,
  };
})();
