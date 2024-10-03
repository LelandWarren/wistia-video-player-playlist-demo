import { mount, VueWrapper } from "@vue/test-utils";
import WistiaPlayer from "@/components/WistiaPlayer.vue";

type WistiaVideoMock = {
  play: jest.Mock;
  bind: jest.Mock;
  unbind: jest.Mock;
  replaceWith: jest.Mock;
};

describe("WistiaPlayer.vue", () => {
  let wrapper: VueWrapper<any>;
  let playerInstanceMock: WistiaVideoMock;

  beforeEach(() => {
    // Mock the Wistia video player instance
    playerInstanceMock = {
      play: jest.fn(),
      bind: jest.fn(),
      unbind: jest.fn(),
      replaceWith: jest.fn(),
    };

    // Mock the Wistia API (_wq)
    window._wq = [] as unknown as WistiaQueue; // I wish I could use the real type here
  });

  afterEach(() => {
    wrapper.unmount();
    jest.clearAllMocks();
  });

  it("should render the Wistia player correctly", () => {
    wrapper = mount(WistiaPlayer, {
      props: {
        videoHashedId: "abc123",
      },
    });

    // Assert that the container div has the correct Wistia embed class
    const playerDiv = wrapper.find(".wistia-player div");
    expect(playerDiv.exists()).toBe(true);
    expect(playerDiv.classes()).toContain(`wistia_async_abc123`);
  });

  it("should initialize the Wistia player on mount", async () => {
    wrapper = mount(WistiaPlayer, {
      props: {
        videoHashedId: "abc123",
      },
    });

    // Manually trigger the Wistia player initialization
    const wistiaConfig = window._wq[0];
    if (wistiaConfig.onReady) {
      wistiaConfig.onReady(playerInstanceMock);
    }

    // Assert that the player instance is initialized and auto-plays the video
    expect(playerInstanceMock.play).toHaveBeenCalled();
    expect(playerInstanceMock.bind).toHaveBeenCalledWith(
      "end",
      expect.any(Function)
    );
  });

  it("should replace the Wistia player when videoHashedId changes", async () => {
    wrapper = mount(WistiaPlayer, {
      props: {
        videoHashedId: "abc123",
      },
    });

    // Simulate the initial Wistia player being ready
    const wistiaConfig = window._wq[0];
    if (wistiaConfig.onReady) {
      wistiaConfig.onReady(playerInstanceMock);
    }

    // Change the videoHashedId prop
    await wrapper.setProps({ videoHashedId: "new123" });

    // Simulate replacing the video player
    playerInstanceMock.replaceWith.mockImplementation(
      (newHashedId, options) => {
        const newConfig = window._wq[1];
        if (newConfig.onReady) {
          newConfig.onReady(playerInstanceMock);
        }
      }
    );

    expect(playerInstanceMock.replaceWith).toHaveBeenCalledWith("new123", {
      transition: "fade",
    });
    expect(playerInstanceMock.play).toHaveBeenCalled();
  });

  it('should emit "update-current-video" when the video ends', async () => {
    wrapper = mount(WistiaPlayer, {
      props: {
        videoHashedId: "abc123",
      },
    });

    // Simulate the Wistia player being ready
    const wistiaConfig = window._wq[0];
    if (wistiaConfig.onReady) {
      wistiaConfig.onReady(playerInstanceMock);
    }

    // Call the 'end' event callback
    const endEventCallback = playerInstanceMock.bind.mock.calls[0][1];
    endEventCallback();

    // Assert that the 'update-current-video' event was emitted
    expect(wrapper.emitted("update-current-video")).toBeTruthy();
  });
});
