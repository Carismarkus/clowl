export type EuleFrame = 'open' | 'blink'

declare module 'claude-code' {
  interface PluginState {
    eule: { frame: EuleFrame }
  }
}
