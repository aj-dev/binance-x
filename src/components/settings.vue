<template>
  <div class="max-w-full mt-4 p-4 rounded shadow-md">
    <h4>Binance API key and secret</h4>
    <p class="mt-2">Create a <em class="font-bold">trading enabled</em> API key and secret on Binance and add them here</p>
    <form @submit.prevent="onSubmit" class="mt-4">
      <div class="flex flex-col">
        <label for="key" class="font-medium">API key</label>
        <div class="flex items-center">
          <input
            type="text"
            v-model.trim="key"
            id="key"
            class="bg-transparent border-b focus:border-blue-400 focus:outline-none leading-tight mt-1 px-2 py-1 text-gray-700 w-5/6"
          >
        </div>
      </div>
      <div class="flex flex-col my-3">
        <label for="secret" class="font-medium">API secret</label>
        <div class="flex items-center">
          <input
            type="text"
            v-model.trim="secret"
            id="secret"
            class="bg-transparent border-b focus:border-blue-400 focus:outline-none leading-tight mt-1 px-2 py-1 text-gray-700 w-5/6"
          >
        </div>
      </div>
      <button
        class="bg-transparent border border-blue-500 focus:outline-none font-medium hover:bg-blue-500 hover:border-transparent hover:text-white px-4 py-2 rounded text-blue-700"
        :class="{'opacity-50 cursor-not-allowed': disabled}"
        :disabled="disabled"
      >Save</button>
    </form>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex';

export default {
    name: 'settings',

    data() {
        return {
            key: '',
            secret: ''
        };
    },

    computed: {
        ...mapGetters([
            'credentials'
        ]),

        disabled() {
            return !this.key || !this.secret;
        }
    },

    created() {
        this.getCredentials();
    },

    activated() {
        this.getCredentials();
    },

    deactivated() {
        this.resetCredentials();
    },

    methods: {
        ...mapMutations([
            'changeCredentials'
        ]),

        onSubmit() {
            this.changeCredentials({ key: this.key, secret: this.secret });
            location.reload();
        },

        getCredentials() {
            const {key, secret} = this.credentials;

            this.key = key;
            this.secret = secret;
        },

        resetCredentials() {
            this.key = '',
            this.secret = '';
        }
    }
};
</script>
