const getters = {
  userInfo: (state) => state.user.userInfo,
  token: (state) => state.user.accessToken
};
export default getters;
