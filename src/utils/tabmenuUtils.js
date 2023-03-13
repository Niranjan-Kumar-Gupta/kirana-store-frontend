const routes = ["/", "/orders", "/enquiries", "/categories", "/customers"];

function getTabIndex(pathName) {
  for (let index = 0; index < routes.length; index++) {
    if (pathName === routes[index]) return index;
  }

  return 0;
}

export { getTabIndex };
