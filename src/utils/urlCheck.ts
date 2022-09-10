export default (str: string) => {
  const regex = /(http(s)?:\/\/.)?[-a-z0-9@:%._\\+~#=]{1,2048}\.[a-z]{2,24}\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)/gi;

  const matches = str.match(regex);

  return matches || [];
};
