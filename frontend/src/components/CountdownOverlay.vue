<template>
  <OverlayItem :showOverlay="countdown > 0">
    <div class="countdown">{{ countdown }}</div>
    <div class="next-video-info">
      <img
        :src="nextVideoThumbnail"
        alt="Next video thumbnail"
        class="thumbnail"
      />
      <div class="next-video-title">{{ nextVideoTitle }}</div>
    </div>
  </OverlayItem>
</template>

<script>
import OverlayItem from "./OverlayItem.vue";

export default {
  name: "CountdownOverlay",
  props: {
    countdown: Number,
    nextVideoTitle: String,
    nextVideoThumbnail: String,
  },
  components: {
    OverlayItem,
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
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

.overlay-header {
  font-size: 2em;
  margin-bottom: 20px;
}

.thumbnail-wrapper {
  position: relative;
  width: 80%;
  max-width: 500px;
}

.thumbnail {
  width: 80%;
  height: auto;
  border-radius: 8px;
}

.countdown {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3em;
  color: #fff;
  font-weight: bold;
  -webkit-text-stroke-width: 3px;
  -webkit-text-stroke-color: black;
}

.video-title {
  margin-top: 20px;
  font-size: 1.5em;
}
</style>
