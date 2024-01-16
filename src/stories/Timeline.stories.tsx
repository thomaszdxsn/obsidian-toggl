import type { Meta, StoryObj } from '@storybook/react';

import { Timeline } from '../components/Timeline';
import { css } from '@emotion/css';

const meta: Meta<typeof Timeline> = {
  title: "components/Timeline",
  component: Timeline,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}


export default meta
type Story = StoryObj<typeof Timeline>;

export const Horizontal: Story = {
  args: {
    direction: "horizontal",
    items: [
      { color: "red", label: "1", percentage: 0.2 },
      { color: "yellow", label: "2", percentage: 0.3 },
      { color: "blue", label: "3", percentage: 0.5 },
    ],
    className: css`
      width: 400px;
    `
  },
}

export const Vertical: Story = {
  args: {
    direction: "vertical",
    items: [
      { color: "red", label: "1", percentage: 0.2 },
      { color: "yellow", label: "2", percentage: 0.3 },
      { color: "blue", label: "3", percentage: 0.5 },
    ],
    className: css`
      height: 400px;
    `,
    size: "large"
  },
}