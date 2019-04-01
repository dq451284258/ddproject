const getters = {
  ready: state => state.app.ready,
  ddCode: state => state.app.ddCode,
  dingConfig: state => state.app.dingConfig,
  userid: state => state.user.userid,
  name: state => state.user.name,
  avatar: state => state.user.avatar,
  pageLoading: state => state.app.pageLoading
}
export default getters
