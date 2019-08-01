import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';

const vuexPersist = new VuexPersist({
    key: 'cryptofoli',
    storage: localStorage
});

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        credentials: {}
    },

    mutations: {
        changeCredentials(state, credentials) {
            state.credentials = credentials;
        }
    },

    getters: {
        credentials: state => state.credentials
    },

    plugins: [vuexPersist.plugin]
});

export default store;