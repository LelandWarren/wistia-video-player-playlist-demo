<template>
  <div class="public-view">
    <PageHeader :buttonLabel="'Admin View'" :onButtonClick="goToAdmin" />
    <div class="main">
      <PlayerContainer class="container" />
    </div>
  </div>
</template>

<script>
import PlayerContainer from "@/components/PlayerContainer.vue";
import PageHeader from "@/components/view-components/PageHeader.vue";

export default {
  name: "PublicView",
  components: {
    PlayerContainer,
    PageHeader,
  },
  methods: {
    goToAdmin() {
      this.$router.push("/admin");
    },
  },
};
</script>

<style scoped>
.main {
  display: flex;
  justify-content: center;
  padding: 0 10px;
}

.container {
  width: 100%;
  max-width: 1200px;
  background-color: white;
  padding-bottom: 60px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding-bottom: 40px;
  }

  .public-view {
    padding: 40px 10px;
  }
}
</style>
