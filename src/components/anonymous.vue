<template>
  <div class="flex flex-col items-center my-10">
    <h4>You have not provided Binance API credentials!</h4>
    <router-link to="/settings" class="mt-2 text-blue-500">Add them now</router-link>
  </div>
</template>

<script>
export default {
    name: 'anonymous'
}
</script>
