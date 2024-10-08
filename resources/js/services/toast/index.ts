import { ref, createApp, h } from 'vue';
import { registerResponseErrorMiddleware, registerResponseMiddleware } from '../http';
import { Toast } from './types';
import ToastComponent from './Toast.vue';

const TOAST_DURATION = 5000;
const STATUS_INFO = 401;
const TIMEOUT = 300;

const toastContainer = document.createElement('div');
document.body.appendChild(toastContainer);

const toasts = ref<Toast[]>([]);

const hideToastMessage = (toast: Toast) => {
    if (toast.timeoutId) clearTimeout(toast.timeoutId);
    if (toast.show) toast.show = false;

    toast.timeoutId = setTimeout(() => {
        const allToasts = toasts.value;
        const index = allToasts.findIndex(({message}) => message === toast.message);
        allToasts.splice(index, 1);
    }, TIMEOUT);
};

const hideToastMessageAfterDelay = (toast: Toast) => {
    if (toast.timeoutId) clearTimeout(toast.timeoutId);
    toast.timeoutId = setTimeout(() => hideToastMessage(toast), TOAST_DURATION);
};

createApp({
    name: 'ToastContainer',
    setup() {
        return () => {
            const toastMessage = toasts.value.map((toast, index) =>
                h(ToastComponent, {
                    toast,
                    onHide: () => hideToastMessage(toast),
                    key: index,
                }),
            );
            return h(
                'div',
                {
                    class: 'position-fixed bottom-0 start-0',
                    style: 'z-index:9999',
                },
                toastMessage,
            );
        };
    },
}).mount(toastContainer);


const createToast = (toast: Toast) => {    
    toasts.value.push(toast);
    hideToastMessageAfterDelay(toast);
}

export const succesToast = (message: string) => createToast({message, show: true, variant: 'success'});
export const dangerToast = (message: string) => createToast({message, show: true, variant: 'danger'});
export const infoToast = (message: string) => createToast({message, show: true, variant: 'info'});

registerResponseMiddleware(({data}) => {
    if (data?.message && data?.id) succesToast(data.message);
});

registerResponseErrorMiddleware(({response}) => {
    if (!response) return;
    const {data, status} = response;
    if (!data?.message) return;
    if (status === STATUS_INFO) return infoToast(data.message);
    dangerToast(data.message);
});