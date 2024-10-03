<template>
  <header>
    <img src="@/assets/wistia-logo.png" class="logo" alt="Wistia Logo" />
    <button @click="onButtonClick" class="header-button">
      {{ buttonLabel }}
    </button>
  </header>
</template>

<script>
export default {
  name: "PageHeader",
  props: {
    buttonLabel: {
      type: String,
      required: true,
    },
    onButtonClick: {
      type: Function,
      required: true,
    },
  },
};
</script>

<style scoped>
header {
  height: 100px;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  position: relative;
}

.logo {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  max-width: 300px; /* Maximum width for large screens */
  height: auto; /* Maintain aspect ratio */
}

.header-button {
  position: absolute;
  right: 20px;
  padding: 10px 20px;
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.header-button:hover {
  background-color: #0052cc;
}
</style>
