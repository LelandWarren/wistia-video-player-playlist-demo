<template>
  <div class="overlay" v-if="showOverlay">
    <div class="overlay-content">
      <slot></slot>
      <!-- Allow custom content to be passed in -->
    </div>
  </div>
</template>

<script>
export default {
  name: "OverlayItem",
  props: {
    showOverlay: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style scoped>
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75); /* Dark overlay */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 1; /* Ensure it's on top */
}

.overlay-content {
  text-align: center;
  font-size: 1.5em; /* Adjust size as needed */
  padding: 10px;
}
</style>
