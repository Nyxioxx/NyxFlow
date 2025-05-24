export const generateTicketNumber = () => {
  const digits = Math.floor(10000 + Math.random() * 90000);
  return `#${digits}`;
};

export const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = ('0' + (d.getMonth() + 1)).slice(-2);
  const day = ('0' + d.getDate()).slice(-2);
  const hours = ('0' + d.getHours()).slice(-2);
  const minutes = ('0' + d.getMinutes()).slice(-2);
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};