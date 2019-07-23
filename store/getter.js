const getters = {
  isAuthenticated(state) {
    return !!state.user
  },
  loggedUser(state) {
    return state.user
  },
  getOrder(state){
    return state.order
  }
}

export default getters
