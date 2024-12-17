
const fakerData = (count = 1000) => {
  let data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      name:  'xxx',
      email: 'xxx'
    });
  }
  return data;
};

export default fakerData;
