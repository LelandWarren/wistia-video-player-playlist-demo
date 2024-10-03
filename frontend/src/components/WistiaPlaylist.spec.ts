import { mount, VueWrapper } from "@vue/test-utils";
import WistiaPlaylist from "@/components/WistiaPlaylist.vue";
import OverlayItem from "@/components/OverlayItem.vue";
import { Video } from "@/models/Video";

describe("WistiaPlaylist.vue", () => {
  let wrapper: VueWrapper<any>;
  const mockVideos: Video[] = [
    {
      id: 1,
      hashedId: "abc123",
      title: "Video 1",
      thumbnailUrl: "http://example.com/thumbnail1.jpg",
      durationFormatted: "2:30",
      description: "",
      duration: 0,
      visible: false,
      plays: 0,
      tags: [],
    },
    {
      id: 2,
      hashedId: "def456",
      title: "Video 2",
      thumbnailUrl: "http://example.com/thumbnail2.jpg",
      durationFormatted: "3:15",
      description: "",
      duration: 0,
      visible: false,
      plays: 0,
      tags: [],
    },
  ];

  beforeEach(() => {
    wrapper = mount(WistiaPlaylist, {
      props: {
        videos: mockVideos,
        currentVideoHashedId: "abc123",
      },
      components: {
        OverlayItem,
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("should render the correct number of videos", () => {
    const playlistItems = wrapper.findAll("li");
    expect(playlistItems.length).toBe(mockVideos.length);
  });

  it('should apply the "active" class to the current video', () => {
    const activeItem = wrapper.find(".active");
    expect(activeItem.exists()).toBe(true);
    expect(activeItem.text()).toContain("Video 1");
  });

  it('should emit "select-video" event when a video is clicked', async () => {
    const secondVideoButton = wrapper.findAll("button")[1];
    await secondVideoButton.trigger("click");

    expect(wrapper.emitted("select-video")).toBeTruthy();
    expect(wrapper.emitted("select-video")![0]).toEqual(["def456"]);
  });

  it('should display "Now Playing" overlay on the current video', () => {
    const overlay = wrapper.findComponent(OverlayItem);
    expect(overlay.exists()).toBe(true);
    expect(overlay.text()).toBe("Now Playing");
  });
});
