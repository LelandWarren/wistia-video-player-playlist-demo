<template>
  <div id="medias">
    <ul class="list--unstyled">
      <AdminVideoItem
        v-for="video in videos"
        :key="video.id"
        :video="video"
        @toggle-visibility="toggleVisibility"
        @manage-tags="openTagModal"
      />
    </ul>

    <TagModal
      v-if="selectedVideo"
      :video="selectedVideo"
      @close="closeTagModal"
      @tags-updated="updateTags"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useStore } from "vuex";
import AdminVideoItem from "./AdminVideoItem.vue";
import TagModal from "./TagModal.vue";
import { Video } from "@/models/Video";

export default defineComponent({
  name: "AdminManager",
  components: {
    AdminVideoItem,
    TagModal,
  },
  setup() {
    const selectedVideo = ref<Video | null>(null);

    const store = useStore();

    // Fetch the full list of videos (including hidden) on mount
    store.dispatch("fetchVideos", true);

    const videos = computed(() => store.state.videos);
    // Actions to toggle video visibility and manage tags
    const toggleVisibility = (video: Video) => {
      store.dispatch("toggleVideoVisibility", video);
    };

    const openTagModal = (video: Video) => {
      selectedVideo.value = video;
    };

    const closeTagModal = () => {
      selectedVideo.value = null;
    };

    const updateTags = (newTags: { name: string }[]) => {
      // Ensure newTags is an array of objects with 'name' property
      if (selectedVideo.value) {
        store.dispatch("updateVideoTags", {
          videoId: selectedVideo.value.id,
          tags: newTags, // Pass the updated tags array with objects that have a 'name' property
        });

        // Update the selected video's tags
        selectedVideo.value.tags = newTags;
      }
    };

    return {
      videos,
      selectedVideo,
      toggleVisibility,
      openTagModal,
      closeTagModal,
      updateTags,
    };
  },
});
</script>

<style scoped>
#medias {
  max-width: 960px;
  margin: 0 auto;
}
</style>
