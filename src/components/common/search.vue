<template>
  <input
    type="search"
    placeholder="Search by symbol..."
    class="bg-transparent border-b focus:border-blue-400 focus:outline-none leading-tight px-2 py-1"
    :value="value"
    v-on:input="$emit('input', $event.target.value)"
  >
</template>

<script>
export default {
    name: 'search',

    props: ['value']
};
</script>

