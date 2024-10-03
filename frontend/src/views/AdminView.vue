<template>
  <div>
    <PageHeader :buttonLabel="'Public View'" :onButtonClick="goToPublic" />
    <AdminManager />
  </div>
</template>

<script>
import AdminManager from "@/components/admin/AdminManager.vue";
import PageHeader from "@/components/view-components/PageHeader.vue";

export default {
  name: "AdminView",
  components: {
    PageHeader,
    AdminManager,
  },
  methods: {
    goToPublic() {
      this.$router.push("/"); // Navigate back to the public view
    },
  },
};
</script>
