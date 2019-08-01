<template>
  <ul class="list-reset flex border-b">
    <li
      v-for="tab in tabs"
      :key="tab.label"
      v-bind:class="{'-mb-px': tab.active}"
      class="mr-1"
    >
      <div
        @click="goTo(tab.path)"
        class="bg-white cursor-pointer inline-block py-2 px-4 font-medium"
        v-bind:class="{'border-l border-t border-r rounded-t text-blue-700': tab.active, 'text-blue-500 hover:text-blue-600': !tab.active}"
      >{{tab.label}}</div>
    </li>
  </ul>
</template>

<script>
export default {
    name: 'tabs',

    data() {
        return {
            tabs: [
                {
                    label: 'Portfolio',
                    path: 'portfolio',
                    active: true
                },
                {
                    label: 'Open orders',
                    path: 'open-orders',
                    active: false
                },
                {
                    label: 'Positions',
                    path: 'positions',
                    active: false
                },
                {
                    label: 'Notifications',
                    path: 'notifications',
                    active: false
                },
                {
                    label: 'Settings',
                    path: 'settings',
                    active: false
                }
            ]
        };
    },

    methods: {
        goTo(path) {
            this.updateTabState(path);
            this.$router.push(path);
        },

        updateTabState(path) {
            this.tabs.forEach(tab => {
                tab.active = tab.path === path;
            });
        }
    }
};
</script>
