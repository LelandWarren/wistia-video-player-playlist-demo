<template>
  <div class="modal centered">
    <div class="modal--inner centered">
      <h1 class="modal__title">Manage Tags</h1>
      <button class="modal__button--close" @click="$emit('close')">
        <CancelIcon />
      </button>

      <ul class="tags list--unstyled">
        <li v-for="tag in tags" :key="tag.name" class="tag-badge">
          {{ tag.name }}
        </li>
      </ul>

      <form @submit.prevent="addTag">
        <label>
          Tag name:
          <input v-model="newTag" type="text" />
        </label>
        <input class="add" type="submit" value="Add" />
      </form>
    </div>
  </div>
</template>

<script>
import { videoService } from "@/services/VideoService";
import CancelIcon from "../icons/CancelIcon.vue";

export default {
  name: "TagModal",
  props: {
    video: Object,
  },
  components: {
    CancelIcon,
  },
  data() {
    return {
      tags: [], // To be filled with existing tags from the video
      newTag: "",
    };
  },
  async mounted() {
    this.tags = [...this.video.tags]; // Initialize the tags from the video prop
  },
  methods: {
    async addTag() {
      console.log("Adding tag:", this.newTag);
      if (this.newTag.trim()) {
        try {
          // Make PATCH request to add the tag using correct service method
          await videoService.addTag(this.video.id, this.newTag);

          // Add the new tag as an object with a 'name' property to match existing tags
          this.tags.push({ name: this.newTag }); // Add as an object, not as a string
          this.newTag = ""; // Clear the input

          // Notify the parent component about the change
          this.$emit("tags-updated", [...this.tags]); // Ensure that the array is passed as a new copy
        } catch (error) {
          console.error("Error adding tag:", error);
        }
      }
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
  background-color: transparent;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal--inner {
  background: white;
  padding: 20px;
  border-radius: 10px;
}
.modal__button--close {
  position: absolute;
  top: 10px;
  right: 10px;
}
.tag-badge {
  display: inline-block;
  padding: 5px 10px;
  margin-right: 6px;
  background-color: #f0f0f0;
  border: 1px solid #333;
  border-radius: 15px;
}
</style>
