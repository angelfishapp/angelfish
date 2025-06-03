export {}

declare global {
  interface Window {
    electron: {
      ipc: {
        on: (channel: string, callback: (payload: any) => void) => void
        once: (channel: string, callback: (payload: any) => void) => void
        send: (channel: string, data?: any) => void
        removeAllListeners: (channel: string) => void
        // Add more if needed
      }
    }
  }
}
