export const getGuid = () => {
  const path = window.location.pathname.split('/');
  const userGuid = path[path.length - 1];

  return userGuid;
};
