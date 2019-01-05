import axios from '@/api/axios'
import Cookie from 'js-cookie'

import originalAxios from 'axios'

export const state = () => ({
  loadedPosts: [],
  token: null
})

export const mutations = {
  setPosts(state, posts) {
    state.loadedPosts = posts
  },
  addPost(state, post) {
    state.loadedPosts = [...state.loadedPosts, post]
  },
  updatePost(state, post) {
    const updatedPostIdx = state.loadedPosts.findIndex(p => p.id === post.id)

    state.loadedPosts.splice(updatedPostIdx, 1, post)
  },
  setToken(state, token) {
    state.token = token
  },
  clearToken(state) {
    state.token = null
  }
}

export const actions = {
  nuxtServerInit({ commit }, context) {
    if (!process.client) {
      // We are on server
      // console.log('server side code execution', context.req)
    }

    return axios
      .get('posts')
      .then(response => {
        commit('setPosts', response.data)
      })
      .catch(e => context.error(e))
  },
  setPosts({ commit }, posts) {
    commit('setPosts', posts)
  },
  addPost({ commit }, post) {
    return axios
      .post('posts', post)
      .then(response => {
        commit('addPost', response.data)
      })
      .catch(e => console.log(e))
  },
  updatePost({ commit }, post) {
    return axios
      .put('posts/' + post.id, { ...post, updatedDate: new Date() })
      .then(response => {
        commit('updatePost', response.data)
      })
      .catch(e => console.log(e))
  },
  authenticateUser({ commit, dispatch }, { email, password }) {
    return axios.post('/auth/login', { email, password }).then(response => {
      commit('setToken', response.data.access_token)
      localStorage.setItem('token', response.data.access_token)
      localStorage.setItem('tokenExpiration', new Date().getTime() + 1 * 60 * 60 * 1000)

      Cookie.set('jwt', response.data.access_token)
      Cookie.set('expirationDate', new Date().getTime() + 1 * 60 * 60 * 1000)

      /* return originalAxios.post('http://localhost:3000/api/track-data', {
        data: 'Athenticated'
      }) */
    })
  },
  initAuth({ commit, dispatch }, req) {
    let token
    let expirationTime

    if (req) {
      if (!req.headers.cookie) {
        return
      }

      let jwtCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('jwt='))

      if (!jwtCookie) {
        return
      }

      token = jwtCookie.split('=')[1]

      let jwtExpirationTime = req.headers.cookie
        .split(';')
        .find(c => c.trim().startsWith('expirationDate='))

      if (!jwtExpirationTime) {
        return
      }

      expirationTime = jwtExpirationTime.split('=')[1]
    } else if (process.client) {
      token = localStorage.getItem('token')
      expirationTime = localStorage.getItem('tokenExpiration')
    }

    if (token == null || +expirationTime < new Date().getTime()) {
      dispatch('logout')
      return
    }
    commit('setToken', token)
  },
  logout({ commit }) {
    commit('clearToken')
    Cookie.remove('jwt')
    Cookie.remove('expirationDate')
    if (process.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('tokenExpiration')
    }
  }
}

export const getters = {
  loadedPosts(state) {
    return state.loadedPosts
  },
  token(state) {
    return state.token
  },
  isAuthenticated(state) {
    return state.token != null
  }
}
