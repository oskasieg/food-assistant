const sortByDateDesc = (items) => {
  return items.sort((item1, item2) => {
    if (item1.createdAt > item2.createdAt) return -1;
    if (item1.createdAt < item2.createdAt) return 1;
    return 0;
  });
};

const sortByDateAsc = (items) => {
  return items.sort((item1, item2) => {
    if (item1.createdAt > item2.createdAt) return 1;
    if (item1.createdAt < item2.createdAt) return -1;
    return 0;
  });
};

module.exports = { sortByDateAsc, sortByDateDesc };
