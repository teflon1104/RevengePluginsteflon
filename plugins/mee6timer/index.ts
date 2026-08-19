import { findByProps } from "@vendetta/metro";
import { showToast } from "@vendetta/ui/toasts";
import { ReactNative } from "@vendetta/metro/common";

const FluxDispatcher = findByProps("dispatch", "subscribe");
const UserStore = findByProps("getCurrentUser");
const { Vibration } = ReactNative;

let isRunning = false;
let timerTimeout: any = null;

function handleMessageCreate(event: any) {
    const currentUser = UserStore.getCurrentUser();
    if (!currentUser || event.message?.author?.id !== currentUser.id) return;
    if (isRunning) return;
    if (!event.message?.guild_id) return;

    isRunning = true;
    showToast("MEE6: Start odliczania 60s nya!");

    timerTimeout = setTimeout(() => {
        isRunning = false;
        if (Vibration) Vibration.vibrate([0, 200, 100, 200]);
        showToast("MEE6: Możesz pisać nową wiadomość! (づ｡◕‿‿◕｡)づ");
    }, 60000);
}

export default {
    onLoad: () => {
        FluxDispatcher.subscribe("MESSAGE_CREATE", handleMessageCreate);
    },
    onUnload: () => {
        FluxDispatcher.unsubscribe("MESSAGE_CREATE", handleMessageCreate);
        if (timerTimeout) clearTimeout(timerTimeout);
        isRunning = false;
    }
};
