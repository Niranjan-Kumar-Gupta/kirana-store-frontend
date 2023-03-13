function updateTableData(currentList, updatedData) {
  const updatedList = currentList.map((item) => {
    if (item.id === updatedData.id) return updatedData;
    else return item;
  });
  return updatedList;
}
function updateProductTable(currentList, updatedData) {
  const updatedList = currentList.map((item) => {
    if (item.id === updatedData.id) return { ...item, ...updatedData };
    else return item;
  });
  return updatedList;
}

function removeDeleteData(currentList, deletedId) {
  const newList = currentList.filter((item) => item.id !== deletedId);
  return newList;
}

function getCampaignCustomers(campaign) {
  let customers = [...campaign.campaigncustomerconnectors];
  let campaignGroups = [...campaign.campaigngroupconnectors];
  for (let i = 0; i < campaignGroups.length; i++) {
    customers = [...customers, ...campaignGroups[0].customergroupconnectors];
  }
  console.log("customers", customers);
  return customers;
}

function isProductInList(productList, product){
    for(let i =0; i<productList.length; i++){
        if(productList[i].id == product.id) return true
    }
    return false;
}

function getUnselectedProducts(productsArr, selectedProductsArr) {
  let unselectedProducts = [];
  for(let i = 0; i<productsArr.length; i++){
    if(!isProductInList(selectedProductsArr,productsArr[i])) unselectedProducts.push(productsArr[i])
  }
  return unselectedProducts;
}

function getCustomersFromSelectedGroup(groupsArr, selectedGroupId){
  for(let i = 0;i<groupsArr.length; i++){
    if(groupsArr[i].id===selectedGroupId) return groupsArr[i].customerIds
  }
  return []
}

export {
  updateTableData,
  removeDeleteData,
  updateProductTable,
  getCampaignCustomers,
  getUnselectedProducts,
  isProductInList,
  getCustomersFromSelectedGroup
};