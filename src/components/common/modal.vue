<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="bg-white mx-auto p-4 rounded shadow-md w-1/2">
          <div class="modal-header">
            <slot name="header">Are you sure you want to perform this action?</slot>
          </div>

          <div class="modal-body my-4">
            <slot name="body"></slot>
          </div>

          <div class="modal-footer flex">
            <slot name="footer">
              <button
                class="bg-transparent focus:outline-none font-medium hover:text-gray-900 ml-auto px-4 py-2 rounded text-gray-700"
                @click="$emit('close', false)"
              >Cancel</button>
              <button
                class="bg-transparent border border-blue-500 focus:outline-none font-medium hover:bg-blue hover:border-transparent hover:text-white px-4 py-2 rounded text-blue-700"
                @click="$emit('close', true)"
              >OK</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
    name: 'modal'
};
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>

