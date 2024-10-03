import { createStore, Store, MutationTree, ActionTree, GetterTree } from "vuex";
import { InjectionKey } from "vue";
import { Video } from "@/models/Video";
import { videoService } from "@/services/VideoService";

export interface State {
  videos: Video[];
  currentVideo: Video | null;
}

// Injection key for TypeScript typing
export const key: InjectionKey<Store<State>> = Symbol();

const state: State = {
  videos: [],
  currentVideo: null,
};

// Mutations
const mutations: MutationTree<State> = {
  setVideos(state, videos: Video[]) {
    state.videos = videos;
  },
  setCurrentVideo(state, video: Video) {
    state.currentVideo = video;
  },
  toggleVideoVisibility(state, videoId: number) {
    const video = state.videos.find((v) => v.id === videoId);
    if (video) video.visible = !video.visible;
  },
  addTagToVideo(state, { videoId, tag }: { videoId: number; tag: string }) {
    const video = state.videos.find((v) => v.id === videoId);
    if (video) {
      video.tags.push({ name: tag }); // Add the new tag as an object with a 'name' property
    }
  },
};

// Actions
const actions: ActionTree<State, State> = {
  async fetchVideos({ commit }, includeHidden = false) {
    const videos: Video[] = await videoService.getVideos(includeHidden);
    commit("setVideos", videos);
  },
  setCurrentVideo({ commit }, video: Video) {
    commit("setCurrentVideo", video);
  },
  toggleVideoVisibility({ commit }, video: Video) {
    videoService.toggleVisibility(video.id);
    commit("toggleVideoVisibility", video.id);
  },
  async addVideoTag(
    { commit },
    { videoId, tag }: { videoId: number; tag: string }
  ) {
    await videoService.addTag(videoId, tag); // Pass a single tag (string)
    commit("addTagToVideo", { videoId, tag }); // Commit a mutation to add the tag
  },
};

// Getters
const getters: GetterTree<State, State> = {
  visibleVideos(state): Video[] {
    return state.videos.filter((video) => video.visible);
  },
};

export default createStore<State>({
  state,
  mutations,
  actions,
  getters,
});
