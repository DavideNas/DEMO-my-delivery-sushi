import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3'

// 1. Import Vuetify and their styles
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

// 2. Create Vuetify instance for Storybook
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})

// 3. Register Vuetify inside Vue app of Storybook
setup((app) => {
  app.use(vuetify)

  // Fallback stub for router-link to avoid unresolved component warnings in stories
  app.component('router-link', {
    props: ['to'],
    template: '<a :href="to"><slot /></a>',
  })
})

// 4. Preview configuration
const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'aria-prohibited-attr',
            selector: '*:not(.vue-devtools__anchor-btn)',
          },
        ],
      },
    },
  },
  decorators: [
    (story) => ({
      components: { story },
      template: '<v-app><story /></v-app>',
    }),
  ],
}

export default preview
