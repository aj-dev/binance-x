<template>
  <div id="app" class="antialiased p-4 text-gray-900">
    <tabs/>
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import tabs from './components/tabs.vue';

export default {
    name: 'app',

    components: {
        tabs
    },

    mounted() {
        this.$router.push('/portfolio');
    }
};
</script>

<style>
#app {
  width: 40rem;
}

svg {
  transform: rotate(0);
}

svg.animate {
  animation: spin calc(var(--duration) * 1s) infinite linear;
}

.spin-slow {
  --duration: 0.7;
}

.spin-fast {
  --duration: 0.5;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.title-case {
  text-transform: lowercase;
}

.title-case::first-letter {
  text-transform: uppercase;
}
</style>
