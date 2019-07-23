export default function({ store, error }) {
  if (!store.getters.isAuthenticated) {
    // return error({
    //   message: '检测到您未登录，请从Tlink登录...',
    //   statusCode: 500
    // })
  }
}
