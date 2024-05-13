import { defineStore } from 'pinia'

export type TransitionOptions = {
    timeout: number
    type: string
}
export type Notification = {
    show: boolean
    message: string
    icon: string
    color: string
    transition: TransitionOptions
}

const DEFAULT_SUCCESS_ICON = 'mdi mdi-check'
const DEFAULT_ERROR_ICON = 'mdi mdi-alert'
const DEFAULT_SUCCESS_COLOR = 'primary'
const DEFAULT_ERROR_COLOR = 'error'
const DEFAULT_WARN_COLOR = 'warning'
const DEFAULT_TRANSITION_TIMEOUT_MS = 2500
const DEFAULT_TRANSITION_TYPE = 'fade-transition'

const defaultTranstionOptions = {
    timeout: DEFAULT_TRANSITION_TIMEOUT_MS,
    type: DEFAULT_TRANSITION_TYPE
}

export const useNotification = defineStore('notification', {
    state: (): Notification => ({
        show: false,
        message: '',
        icon: '',
        color: '',
        transition: {
            timeout: DEFAULT_TRANSITION_TIMEOUT_MS,
            type: DEFAULT_TRANSITION_TYPE
        }
    }),
    actions: {
        notify(
            message: string,
            icon: string,
            color: string,
            transitionOptions: TransitionOptions = defaultTranstionOptions
        ) {
            this.show = true
            this.message = message
            this.icon = icon
            this.color = color
            this.transition = transitionOptions
        },
        notifySuccess(message: string, transitionOptions: TransitionOptions = defaultTranstionOptions) {
            this.show = true
            this.message = message
            this.icon = DEFAULT_SUCCESS_ICON
            this.color = DEFAULT_SUCCESS_COLOR
            this.transition = transitionOptions
        },
        notifyError(message: string, transitionOptions: TransitionOptions = defaultTranstionOptions) {
            this.show = true
            this.message = message
            this.icon = DEFAULT_ERROR_ICON
            this.color = DEFAULT_ERROR_COLOR
            this.transition = transitionOptions
        },
        notifyWarning(message: string, transitionOptions: TransitionOptions = defaultTranstionOptions) {
            this.show = true
            this.message = message
            this.icon = DEFAULT_ERROR_ICON
            this.color = DEFAULT_WARN_COLOR
            this.transition = transitionOptions
        }
    }
})

export default useNotification
