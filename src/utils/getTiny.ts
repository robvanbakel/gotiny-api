const chars = ['a', 'b', 'c', 'd', 'e', 'f', 'h', 'k', 'm', 'n', 'p', 'r', 's', 't', 'w', 'x', 'y', 'z', '2', '3', '4', '5', '6', '7', '8'];

export default (len: number) => {

  return Array(len)
    .fill(true)
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join('')
  
};
