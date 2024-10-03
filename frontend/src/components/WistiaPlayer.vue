<template>
  <div class="wistia-player">
    <div ref="wistiaPlayer" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";

export default {
  name: "WistiaPlayer",
  props: {
    videoHashedId: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const wistiaPlayer = ref(null);
    let playerInstance = null;

    const initWistiaPlayer = (hashedId) => {
      window._wq = window._wq || [];
      window._wq.push({
        id: hashedId,
        options: { plugin: { countdownControl: { initialTime: 5 } } }, // Specify countdown timer settings
        onReady: function (video) {
          console.log("Wistia video is ready!", video);
          playerInstance = video;

          // Bind the 'end' event to trigger the next video
          bindVideoEndEvent(video);

          // Ensure the video starts playing once ready
          video.play();
        },
      });
    };

    const replaceWistiaPlayer = (newHashedId) => {
      if (playerInstance) {
        // Use replaceWith and reinitialize player after it's replaced
        playerInstance.replaceWith(newHashedId, { transition: "fade" });

        // Reinitialize the player instance after replacing the video
        window._wq.push({
          id: newHashedId,
          options: { plugin: { countdownControl: { initialTime: 5 } } }, // Ensure countdown timer is initialized on replacement
          onReady: function (newVideoInstance) {
            console.log("New video is ready!", newVideoInstance);
            playerInstance = newVideoInstance;

            // Bind the 'end' event for the new video
            bindVideoEndEvent(newVideoInstance);

            // Auto-play the new video
            newVideoInstance.play();
          },
        });
      } else {
        initWistiaPlayer(newHashedId);
      }
    };

    const bindVideoEndEvent = (video) => {
      // Unbind any existing end events to avoid duplication
      video.unbind("end");

      // Bind the 'end' event to trigger the next video
      video.bind("end", () => {
        emit("update-current-video");
      });
    };

    onMounted(() => {
      console.log("hash", props.videoHashedId);
      wistiaPlayer.value.classList.add(
        "wistia_embed",
        `wistia_async_${props.videoHashedId}`
      );
      initWistiaPlayer(props.videoHashedId);
    });

    watch(
      () => props.videoHashedId,
      (newVal) => {
        if (newVal && playerInstance) {
          replaceWistiaPlayer(newVal);
        }
      }
    );

    return {
      wistiaPlayer,
    };
  },
};
</script>
