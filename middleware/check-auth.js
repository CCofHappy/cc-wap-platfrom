import { getUserFromCookie, getcookiesInClient } from '~/utils'

export default function({ roter, redirect, store, req }) {
  const isServer = process.server
  const loggedUser = isServer
    ? getUserFromCookie(req)
    : getcookiesInClient('token')
  // eslint-disable-next-line no-console
  //console.log(loggedUser)
  store.commit('SET_USER', loggedUser)
}
