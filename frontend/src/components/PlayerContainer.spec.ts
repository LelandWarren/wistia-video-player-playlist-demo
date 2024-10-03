import { mount, VueWrapper } from "@vue/test-utils";
import PlayerContainer from "@/components/PlayerContainer.vue";
import WistiaPlayer from "@/components/WistiaPlayer.vue";
import WistiaPlaylist from "@/components/WistiaPlaylist.vue";
import CountdownOverlay from "@/components/CountdownOverlay.vue";
import OverlayItem from "@/components/OverlayItem.vue";
import { createStore } from "vuex";
import { Video } from "@/models/Video";

describe("PlayerContainer.vue", () => {
  let wrapper: VueWrapper<any>;
  let store: any;
  let mockVideos: Video[];

  beforeEach(() => {
    mockVideos = [
      {
        id: 1,
        hashedId: "abc123",
        title: "Video 1",
        thumbnailUrl: "http://example.com/thumbnail1.jpg",
        durationFormatted: "2:30",
        visible: true,
        plays: 100,
        duration: 150,
        tags: [{ name: "test" }],
        description: "",
      },
      {
        id: 2,
        hashedId: "def456",
        title: "Video 2",
        thumbnailUrl: "http://example.com/thumbnail2.jpg",
        durationFormatted: "3:15",
        visible: true,
        plays: 50,
        duration: 180,
        tags: [{ name: "test2" }],
        description: "",
      },
    ];

    store = createStore({
      state: {
        videos: mockVideos,
      },
      actions: {
        fetchVideos: jest.fn(() => {
          store.state.videos = mockVideos;
        }),
      },
    });

    wrapper = mount(PlayerContainer, {
      global: {
        plugins: [store],
        components: {
          WistiaPlayer,
          WistiaPlaylist,
          CountdownOverlay,
          OverlayItem,
        },
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("renders the WistiaPlayer and WistiaPlaylist components", () => {
    const playerComponent = wrapper.findComponent(WistiaPlayer);
    const playlistComponent = wrapper.findComponent(WistiaPlaylist);

    expect(playerComponent.exists()).toBe(true);
    expect(playlistComponent.exists()).toBe(true);
  });

  it('updates the current video when "update-current-video" is emitted', async () => {
    const playerComponent = wrapper.findComponent(WistiaPlayer);

    await playerComponent.vm.$emit("update-current-video");

    wrapper.vm.handleVideoEnd();

    expect(wrapper.vm.currentVideo).toEqual(mockVideos[0]); // Check currentVideo directly
  });

  it("displays the countdown overlay when countdown is greater than 0", async () => {
    wrapper.vm.countdown = 5;
    await wrapper.vm.$nextTick();

    const countdownOverlay = wrapper.findComponent(CountdownOverlay);
    expect(countdownOverlay.exists()).toBe(true);
    expect(countdownOverlay.props("countdown")).toBe(5);
  });

  it('displays the "Playlist Complete" overlay when all videos have been played', async () => {
    wrapper.vm.playedVideosCount = mockVideos.length;
    await wrapper.vm.$nextTick();

    // Verify that playlistCompleted is true
    expect(wrapper.vm.playlistCompleted).toBe(true);

    const overlayItem = wrapper.find(
      '[data-testid="playlist-complete-overlay"]'
    );

    expect(overlayItem.exists()).toBe(true);
    expect(overlayItem.text()).toContain("Playlist Complete 🎉");
  });
});
