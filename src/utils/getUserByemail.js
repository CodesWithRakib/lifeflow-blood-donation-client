const getUserByEmail = async (axiosInstance, email) => {
  const url = email ? `/api/user/${email}` : `/api/user`;
  const res = await axiosInstance.get(url);
  return res.data.data;
};

export default getUserByEmail;
