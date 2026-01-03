const createTokenUser = (user) => {
  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
};

export default createTokenUser;
