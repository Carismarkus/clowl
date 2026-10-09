import { expect, test } from 'claude-code/testing'

const props = (isWorking: boolean) => ({
  hasSurvey: false,
  isWorking,
  maxRows: 20,
  bodyColumns: 100,
  scroll: { bodyRows: 20, offset: 0 },
  view: {},
})

test('the owl shows while Claude waits, and not while it works', async ($, on) => {
  on('ui.render', { component: 'AbovePrompt' }, ($, e) => {
    const { Box } = $.ui.resolve(e)
    return <Box key="engine" />
  })
  const idle = await $.ui.mount({ plugin: 'eule', surface: 'terminal', component: 'AbovePrompt', props: props(false) })
  expect(await idle.find({ type: 'Text', text: /Hu-hu/ })).toBeDefined()
  expect(await idle.find({ key: 'owl' })).toBeDefined()
  await idle.unmount()

  const busy = await $.ui.mount({ plugin: 'eule', surface: 'terminal', component: 'AbovePrompt', props: props(true) })
  expect(await busy.find({ key: 'owl' })).toBeUndefined()
  await busy.unmount()
})
