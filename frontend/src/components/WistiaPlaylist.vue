<template>
  <div class="playlist">
    <ul class="playlist-items">
      <li
        v-for="video in videos"
        :key="video.id"
        :class="{ active: video.hashedId === currentVideoHashedId }"
      >
        <button @click="selectVideo(video.hashedId)" class="playlist-item">
          <div class="thumbnail-wrapper">
            <img :src="video.thumbnailUrl" alt="Thumbnail" />
            <OverlayItem :showOverlay="video.hashedId === currentVideoHashedId">
              Now Playing
            </OverlayItem>
          </div>
          <div class="video-info">
            <div class="title">{{ video.title }}</div>
            <div class="duration">{{ video.durationFormatted }}</div>
          </div>
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Video } from "@/models/Video";
import OverlayItem from "@/components/OverlayItem.vue";

export default defineComponent({
  name: "WistiaPlaylist",
  props: {
    videos: {
      type: Array as PropType<Video[]>,
      required: true,
    },
    currentVideoHashedId: {
      type: String,
      required: true,
    },
  },
  components: {
    OverlayItem,
  },
  methods: {
    selectVideo(hashedId: string) {
      this.$emit("select-video", hashedId);
    },
  },
});
</script>

<style scoped>
.playlist {
  height: 100%;
  overflow-y: auto; /* Playlist scrolls if content exceeds available height */
}

.playlist-items {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.playlist-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #ccc;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
}

.playlist-item:hover {
  background-color: #f0f0f0;
}

.thumbnail img {
  width: 80px;
  height: auto;
}

.thumbnail-wrapper {
  position: relative; /* Position relative to enable the overlay */
}

.video-info {
  margin-left: 15px;
}

.title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.duration {
  font-size: 14px;
  color: #666;
}

.active {
  background-color: #d8d8d8;
}
</style>
