import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // Register all state data in the state object
    items: null,
    properties: null
  },
  actions: {
    // Actions are available to manipulate the state
    // A component has access to these actions data by using mapActions, e.g.:
    //   methods: {
    //     ...mapActions({
    //       setText: 'setText'
    //     })
    //  }
    setItems (store, items) {
      store.commit('items', items)
    },
    setProperties (store, properties) {
      store.commit('properties', properties)
    }
  },
  mutations: {
    // The real manipulation of the state is by means of a mutation
    // Mutations are triggered by commits, this is normally done in an action
    items (state, items) {
      state.items = items
    },
    properties (state, properties) {
      state.properties = properties
    }
  },
  getters: {
    // Provide access to state data, or part of the state data
    // A component has access to the state data by using mapGetters, e.g.:
    //   computed: {
    //     ...mapGetters([
    //       'text'
    //     ])
    //   }
    items: state => {
      return state.items
    },
    properties: state => {
      return state.properties
    }
  }
})
