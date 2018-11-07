import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // Register all state data in the state object
    items: null,
    properties: null,
    attributes: null,
    faq: null,
    metadata: null
  },
  actions: {
    // Actions are available to manipulate the state
    // A component has access to these actions data by using mapActions, e.g.:
    //   methods: {
    //     ...mapActions({
    //       setText: 'setText'
    //     })
    //  }
    setFAQ (store, faq) {
      store.commit('faq', faq)
    },
    setItems (store, items) {
      store.commit('items', items)
    },
    setProperties (store, properties) {
      store.commit('properties', properties)
    },
    setAttributes (store, attributes) {
      store.commit('attributes', attributes)
    },
    setMetadata (store, metadata) {
      store.commit('metadata', metadata)
    }
  },
  mutations: {
    // The real manipulation of the state is by means of a mutation
    // Mutations are triggered by commits, this is normally done in an action
    faq (state, faq) {
      state.faq = faq
    },
    items (state, items) {
      state.items = items
    },
    properties (state, properties) {
      state.properties = properties
    },
    attributes (state, attributes) {
      state.attributes = attributes
    },
    metadata (state, metadata) {
      state.metadata = metadata
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
    faq: state => {
      return state.faq
    },
    items: state => {
      return state.items
    },
    properties: state => {
      return state.properties
    },
    attributes: state => {
      return state.attributes
    },
    metadata: state => {
      return state.metadata
    }
  }
})
