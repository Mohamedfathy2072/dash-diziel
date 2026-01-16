export const handleExpireAuth = () => {
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + 12 * 60 * 60 * 1000); 
  return expirationDate;
};
