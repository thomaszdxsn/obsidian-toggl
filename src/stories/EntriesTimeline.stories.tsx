import type { Meta, StoryObj } from '@storybook/react';

import { EntriesTimeline } from '../components/EntriesTimeline';
import { faker } from '@faker-js/faker'
import { createRandomProject, createRandomTimeEntry } from '../../__tests__/mock';
import { css } from '@emotion/css';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof EntriesTimeline> = {
  title: 'Components/EntriesTimeline',
  component: EntriesTimeline,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof EntriesTimeline>;


const PROJECTS = faker.helpers.multiple(createRandomProject, {
  count: 2
})
const TIME_ENTRIES = faker.helpers.multiple(createRandomTimeEntry, {
  count: 10
})

TIME_ENTRIES.forEach((entry, index) => {
  entry.duration  = (index + 1) * 300
  if (index % 2 === 0 ) {
    entry.project_id = PROJECTS[0].id
  } else {
    entry.project_id = PROJECTS[1].id
  }
})
PROJECTS[0].color = "red"
PROJECTS[1].color = "blue"


export const Default: Story = {
  args: {
    entries: TIME_ENTRIES,
    projectDict: Object.fromEntries(PROJECTS.map(project => [project.id, project])),
  }
}