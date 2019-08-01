<template>
  <th class="cursor-pointer hover:bg-blue-200 p-2 text-left" @click="$emit('sort', column.property)">
    <div class="flex items-center">
      <span class="flex">{{column.label}}</span>
      <span class="flex">
        <svg class="fill-current w-5 h-5">
          <use
            v-show="sortProperty === column.property && sortOrder === 'asc'"
            xlink:href="#arrow-drop-up"
          ></use>
          <use
            v-show="sortProperty === column.property && sortOrder === 'desc'"
            xlink:href="#arrow-drop-down"
          ></use>
        </svg>
      </span>
    </div>
  </th>
</template>

<script>
export default {
    name: 'table-header',

    props: {
        column: Object,
        sortProperty: String,
        sortOrder: String
    }
};
</script>