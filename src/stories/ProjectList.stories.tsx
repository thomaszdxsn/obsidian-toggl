import type { Meta, StoryObj } from '@storybook/react';

import { ProjectList } from '../components/ProjectList';
import { createRandomProject } from '../../mock';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof ProjectList> = {
  title: 'Components/ProjectList',
  component: ProjectList,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
  },
};

export default meta;
type Story = StoryObj<typeof ProjectList>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Normal: Story = {
  args: {
    data: Array.from({length: 10}, () => createRandomProject())
  }
};