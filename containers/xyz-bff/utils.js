const sleep = ms => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

const randomStr = length => {
  const list =
    "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよわをん";
  let str = "";

  for (let i = 0; i < length; i++) {
    str += list[Math.floor(Math.random() * list.length)];
  }

  return str;
};

module.exports = { sleep, randomStr };
