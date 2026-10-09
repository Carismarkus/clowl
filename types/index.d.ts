export type ClowlFrame = 'open' | 'blink'

declare module 'claude-code' {
  interface PluginState {
    clowl: { frame: ClowlFrame }
  }
}
