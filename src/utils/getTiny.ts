const chars = ['a', 'b', 'c', 'd', 'e', 'f', 'h', 'k', 'm', 'n', 'p', 'r', 's', 't', 'w', 'x', 'y', 'z', '2', '3', '4', '5', '6', '7', '8'];

export default (len: number) => {
  let id = '';

  for (let i = 0; i < len; i += 1) {
    id += chars[Math.floor(Math.random() * chars.length)];
  };

  return id;
};
