const appCache = {};

appCache.setItem = (key, value) => {
  let stringified = JSON.stringify(value);
  localStorage.setItem(key, stringified);
  console.log(`Added key ${key}`);
};

appCache.getItem = (key) => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

appCache.removeItem = (key) => {
  const item = appCache.getItem(key);
  if(item){
    localStorage.removeItem(key);
    console.log(`Removed key ${key}`);
  }
  console.log(`Key ${key} does not exist`);
};

export default appCache;