<template>
  <li class="media">
    <img :src="video.thumbnailUrl" class="thumbnail" alt="Video thumbnail" />

    <div class="description">
      <div class="title">{{ video.title }}</div>
      <div class="duration label--sm">{{ video.durationFormatted }}</div>
      <div class="tags">
        <span v-for="tag in video.tags" :key="tag" class="tag-badge">
          {{ tag.name }}
        </span>
      </div>
    </div>

    <div class="total-plays">
      <div class="views label--sm">{{ video.plays }}</div>
      <div class="label--sm">total plays</div>
    </div>

    <!-- Button for managing tags -->
    <button @click="manageTags(video)" class="tag-button button--unstyled">
      <TagIcon />
    </button>

    <!-- Button for visibility toggle -->
    <button
      @click="toggleVisibility(video)"
      class="visibility-toggle button--unstyled"
    >
      <EyeOpenIcon v-if="video.visible" />
      <EyeClosedIcon v-else />
    </button>
  </li>
</template>

<script>
import TagIcon from "../icons/TagIcon.vue";
import EyeOpenIcon from "../icons/EyeOpenIcon.vue";
import EyeClosedIcon from "../icons/EyeClosedIcon.vue";

export default {
  name: "AdminVideoItem",
  props: {
    video: Object,
  },
  components: {
    TagIcon,
    EyeOpenIcon,
    EyeClosedIcon,
  },
  methods: {
    toggleVisibility() {
      this.$emit("toggle-visibility", this.video);
    },
    manageTags() {
      this.$emit("manage-tags", this.video);
    },
  },
};
</script>

<style scoped>
svg {
  fill: currentColor;
  display: inline-block;
  width: 24px;
  height: 24px;
}

button {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
}

.media {
  align-items: center;
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #d8d8d8;
}

.thumbnail {
  height: 56px;
  margin-right: 24px;
}

.description {
  flex-grow: 1;
  text-align: left; /* Ensures left alignment */
}

.total-plays {
  margin-right: 20px; /* Space between the total plays and the tag button */
}

.tag-button {
  margin: 0 18px;
}

.tags {
  margin-top: 10px;
}

.tag-badge {
  display: inline-block;
  background-color: #e0e0e0;
  color: #333;
  padding: 5px 10px;
  margin-right: 8px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
}

.views {
  font-weight: bold;
  font-size: 1.5rem;
}
</style>
