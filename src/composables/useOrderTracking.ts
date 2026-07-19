import { ref, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import type { TrackingStatus, TrackingStep, UseOrderTrackingReturn } from '@/types/tracking';
import { useNotificationStore } from '@/stores/notification';

export function useOrderTracking(orderId: string): UseOrderTrackingReturn {
    const notificationStore = useNotificationStore();

    // Typed reactive states
    const status = ref<TrackingStatus>('INITIALIZING');
    const error = ref<string | null>(null);
    const isReconnecting = ref<boolean>(false);
    const deliveryData = ref<string | null>(null);

    // Control variables (non-reactive) with types for Node/Browser timers
    let mockConnection: ReturnType<typeof setInterval> | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
    let attemptCount = 0;
    let currentStep = 0;

    // Strongly typified order stages
    const trackingSteps: TrackingStep[] = [
        { status: 'PREPARING_SUPPLIERS', message: 'Our partner restaurants are preparing your dishes.' },
        { status: 'TRANSIT_TO_HUB', message: 'The pieces are converging towards the Hub restaurant.'},
        { status: 'HUB_ASSEMBLY', message: 'The Hub restaurant is assembling your unique box.' },
        { status: 'OUT_FOR_DELIVERY', message: 'The Hub rider has left for home delivery!' },
        { status: 'DELIVERED', message: 'Enjoy your meal! Order delivered.' }
    ];

    const maxAttempts = 5;
    const baseDelay = 1000; // 1 second

    const connectStream = (): void => {
        error.value = null;

        mockConnection = setInterval(() => {
            // 1. Simulated network failure (25% probability)
            if(Math.random() < 0.25) {
                handleDisconnect('Network connection error (TS Micro-cut).');
                return;
            }

            // 2. Flow forwards
            if (currentStep < trackingSteps.length) {
                const nextStep = trackingSteps[currentStep];
                status.value = nextStep.status;
                deliveryData.value = nextStep.message;
                currentStep++;

                if (status.value === 'DELIVERED') {
                    notificationStore.show(`Order #${orderId}  delivered! Enjoy your meal 🍣`, 'success');
                    cleanup();
                }
            }
        }, 3000);
    };

    const handleDisconnect = (reason: string): void => {
        cleanupConnectionOnly();
        error.value = reason;

        if (attemptCount < maxAttempts) {
            isReconnecting.value = true;
            attemptCount++;

            // Exponential count + jitter
            const delay = (baseDelay * Math.pow(2, attemptCount)) + (Math.random() * 1000);

            console.warn(`[TS-Tracking] Order ${orderId}: Connection lost. Attempt ${attemptCount}/${maxAttempts} in ${Math.round(delay) * 1000} seconds...`)

            reconnectTimeout = setTimeout(() => {
                connectStream();
            }, delay);
        } else {
            isReconnecting.value = false;
            status.value = 'FAILED';
            error.value = 'Unable to reconnect to the server after multiple network attempts.';
            notificationStore.show(`Persistent connection error on order tracking #${orderId}.`, 'error');
        }
    };

    const cleanupConnectionOnly = (): void => {
        if (mockConnection) {
            clearInterval(mockConnection);
            mockConnection = null;
        }
    };

    const cleanup = (): void => {
        cleanupConnectionOnly();
        if (reconnectTimeout) {
            clearTimeout(reconnectTimeout);
            reconnectTimeout = null;
        }
    };

    // Auto-start connection
    onMounted(() => {
        connectStream();
    })

    // Memory Leak Guarantee
    onUnmounted(() => {
        console.log(`[TS-Tracking] Disassembled component. Resources freed for order ${orderId}.`);
        cleanup();
    });

    return {
        status,
        error,
        isReconnecting,
        deliveryData,
        retryManually: () => {
            attemptCount = 0;
            currentStep = 0;  // Let's reset the step for the test mock
            connectStream();
        }
    }
}