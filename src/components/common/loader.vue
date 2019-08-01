<template>
  <div class="flex items-center justify-center my-32 text-gray-900" v-if="!dataLoaded">
    <svg class="fill-current animate spin-slow w-8 h-8">
      <use xlink:href="#autorenew"></use>
    </svg>
    <span>Loading...</span>
  </div>
</template>

<script>
export default {
    name: 'loader',

    props: ['dataLoaded']
};
</script>

