export type Toast = {
    message: string
    show: boolean
    variant: 'danger' | 'success' | 'info'
    timeoutId?: NodeJS.Timeout
};