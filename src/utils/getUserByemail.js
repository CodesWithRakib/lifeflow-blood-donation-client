const getUserByEmail = async (axiosInstance, email) => {
  const url = email ? `/user/${email}` : `/user`;
  const res = await axiosInstance.get(url);
  return res.data.data;
};

export default getUserByEmail;
