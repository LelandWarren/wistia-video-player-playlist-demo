<template>
  <div class="player-container">
    <div class="video-section">
      <div class="video-container" v-if="currentVideo">
        <WistiaPlayer
          :videoHashedId="currentVideo.hashedId"
          @update-current-video="handleVideoEnd"
        />
        <CountdownOverlay
          v-if="countdown > 0 && !playlistCompleted"
          :countdown="countdown"
          :nextVideoTitle="nextVideo?.title"
          :nextVideoThumbnail="nextVideo?.thumbnailUrl"
        />
        <OverlayItem
          v-if="playlistCompleted"
          :showOverlay="playlistCompleted"
          data-testid="playlist-complete-overlay"
        >
          Playlist Complete 🎉
        </OverlayItem>
        <div class="video-title">{{ currentVideo?.title }}</div>
      </div>
    </div>
    <WistiaPlaylist
      :videos="videos"
      :currentVideoHashedId="currentVideo?.hashedId"
      @select-video="onVideoSelect"
      class="playlist"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import WistiaPlayer from "@/components/WistiaPlayer.vue";
import WistiaPlaylist from "@/components/WistiaPlaylist.vue";
import CountdownOverlay from "./CountdownOverlay.vue";
import OverlayItem from "./OverlayItem.vue";
import { Video } from "@/models/Video";

export default defineComponent({
  name: "PlayerContainer",
  components: {
    WistiaPlayer,
    WistiaPlaylist,
    CountdownOverlay,
    OverlayItem,
  },
  setup() {
    const store = useStore();
    const videos = ref<Video[]>([]); // Explicitly type videos as an array of Video objects
    const currentVideoIndex = ref(0);
    const countdown = ref(0);
    const playedVideosCount = ref(0);
    let countdownInterval: ReturnType<typeof setInterval>;

    const currentVideo = computed(() => videos.value[currentVideoIndex.value]);
    const nextVideo = computed(
      () => videos.value[(currentVideoIndex.value + 1) % videos.value.length]
    );

    const playlistCompleted = computed(
      () => playedVideosCount.value >= videos.value.length
    );

    // Fetch videos on mount
    onMounted(async () => {
      console.log("HERE!");
      await store.dispatch("fetchVideos");
      videos.value = store.state.videos;

      // Only set the first video when loading initially
      if (currentVideoIndex.value === 0 && videos.value.length > 0) {
        currentVideoIndex.value = 0;
      }

      console.log("currentVideo =>" + currentVideo.value);
    });

    const playNextVideo = () => {
      if (playlistCompleted.value) {
        console.log("All videos have been played.");
        return;
      }

      // Move current video to the bottom of the list
      const currentVideoCopy = videos.value[currentVideoIndex.value];
      videos.value.splice(currentVideoIndex.value, 1);
      videos.value.push(currentVideoCopy);

      // Reset the current video index to 0 (next video)
      currentVideoIndex.value = 0;
    };

    const handleVideoEnd = () => {
      playedVideosCount.value++;
      if (playlistCompleted.value) {
        console.log("All videos have been played. Stopping autoplay.");
        return;
      }

      // Start countdown for next video
      countdown.value = 5;
      countdownInterval = setInterval(() => {
        countdown.value--;
        if (countdown.value === 0) {
          clearInterval(countdownInterval);
          playNextVideo();
        }
      }, 1000);
    };

    // This was for manaully selecting a video from the playlist, but we're not using it, since it won't work with the autoplay feature :((((
    // const onVideoSelect = (hashedId: string) => {
    //   const index = videos.value.findIndex(
    //     (video) => video.hashedId === hashedId
    //   );
    //   if (index !== -1) {
    //     currentVideoIndex.value = index;
    //   }
    // };

    return {
      videos,
      currentVideo,
      nextVideo,
      countdown,
      playlistCompleted,
      playedVideosCount,
      // onVideoSelect,
      playNextVideo,
      handleVideoEnd,
    };
  },
});
</script>

<style scoped>
.player-container {
  display: flex;
  align-items: flex-start;
  height: 100%;
}

.video-container {
  flex: 1;
  height: 360px;
  margin-right: 20px;
  position: relative;
}

.video-title {
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
}

.playlist {
  max-height: 400px;
  overflow-y: auto;
  border-left: 1px solid #ccc;
}
</style>
