// Clowl: a dim-witted, loyal owl above the prompt that stares at the user
// while Claude waits for the next task, and blinks now and then.

import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { ClowlFrame } from '../types'

// The two lines next to the owl: the first in normal type, the second dimmed.
const TEXT = 'Hu-hu?'
const SUBTEXT = 'Ich warte auf deine nächste Aufgabe.'

const frame = atom({ plugin: 'clowl', key: 'frame' } as const, 'open' as ClowlFrame)

// 16 x 16 pixels, two per terminal cell (upper and lower half block).
const OWL = [
  '.D............D.',
  '.DD..........DD.',
  '.DBDDDDDDDDDDBD.',
  '.DBBBBBBBBBBBBD.',
  '.DBWWWBBBBWWWBD.',
  'DBWWSKWBBWSKWWBD',
  'DBWWKKWBBWKKWWBD',
  'DBWWKKWBBWKKWWBD',
  'DBWWWWWBBWWWWWBD',
  '.DBWWWBYYBWWWBD.',
  '.DBBLLLYYLLLBBD.',
  '.DBLLDLLLLDLLBD.',
  '.DBLLLDLLDLLLBD.',
  '..DBLLLLLLLLBD..',
  '...DDBBBBBBDD...',
  '....OO....OO....',
]

const EYE_ROWS = [4, 5, 6, 7, 8, 9]
const LID_ROW = 7

/** Closed eyes: the eye whites become feathers, with a dark lid line across. */
const BLINK = OWL.map((row, y) =>
  EYE_ROWS.includes(y) ? row.replace(/[WKS]/g, y === LID_ROW ? 'D' : 'B') : row,
)

const DEFAULT = 0x01000000

const PALETTE: Record<string, number> = {
  '.': DEFAULT,
  D: 0x4a2c14, // outline
  B: 0x8b5a2b, // feathers
  L: 0xe8c99a, // belly
  W: 0xffffff, // eye white
  K: 0x111111, // pupil
  S: 0xf4f4f4, // shine in the pupil
  Y: 0xf2a900, // beak
  O: 0xe08a00, // feet
}

const UPPER = 0x2580
const LOWER = 0x2584
const SPACE = 0x20

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

function toBase64(bytes: Uint8Array): string {
  let out = ''
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i] ?? 0
    const b = bytes[i + 1] ?? 0
    const c = bytes[i + 2] ?? 0
    const n = (a << 16) | (b << 8) | c
    out += B64.charAt((n >> 18) & 63) + B64.charAt((n >> 12) & 63)
    out += i + 1 < bytes.length ? B64.charAt((n >> 6) & 63) : '='
    out += i + 2 < bytes.length ? B64.charAt(n & 63) : '='
  }
  return out
}

/** Packs pixel rows into Raster cells: each cell shows a pixel above and one below. */
export function cells(pixels: readonly string[]): string {
  const width = pixels[0]?.length ?? 0
  const words: number[] = []
  for (let y = 0; y < pixels.length; y += 2) {
    for (let x = 0; x < width; x++) {
      const top = PALETTE[pixels[y]?.charAt(x) ?? '.'] ?? DEFAULT
      const bottom = PALETTE[pixels[y + 1]?.charAt(x) ?? '.'] ?? DEFAULT
      if (top === DEFAULT && bottom === DEFAULT) words.push(SPACE, DEFAULT, DEFAULT)
      else if (top === DEFAULT) words.push(LOWER, bottom, DEFAULT)
      else words.push(UPPER, top, bottom)
    }
  }
  return toBase64(new Uint8Array(Uint32Array.from(words).buffer))
}

const OPEN_CELLS = cells(OWL)
const BLINK_CELLS = cells(BLINK)
const COLUMNS = 16
const ROWS = 8

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    // Blink every few seconds, now and then twice.
    $.clock.every(5200, () => {
      const blink = () => {
        void update($, frame, () => 'blink')
        $.clock.after(170, () => void update($, frame, () => 'open'))
      }
      blink()
      if (Math.random() < 0.25) $.clock.after(420, blink)
    })
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.surface !== 'terminal') return next(e)
    const { isWorking, hasSurvey, maxRows, bodyColumns } = e.props
    if (isWorking || hasSurvey || maxRows < ROWS || bodyColumns < COLUMNS) return next(e)

    const { Box, Raster, Text } = $.ui.resolve(e)
    const shown = await read($, frame)

    return (
      <Box flexDirection="row">
        <Raster key="owl" columns={COLUMNS} rows={ROWS} cells={shown === 'blink' ? BLINK_CELLS : OPEN_CELLS} />
        <Box flexDirection="column" justifyContent="flex-end" marginLeft={2}>
          {TEXT ? <Text>{TEXT}</Text> : null}
          {SUBTEXT ? <Text dimColor>{SUBTEXT}</Text> : null}
        </Box>
      </Box>
    )
  })
}
