import type { Meta, StoryObj } from '@storybook/react';

import { TimeDisplay } from '../components/TimeDisplay';
import React from 'react';
import { formatSeconds } from '../utils';

const meta: Meta<typeof TimeDisplay> = {
  title: "components/TimeDisplay",
  component: TimeDisplay,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof TimeDisplay>;

export const Timer: Story = {
  args: {
    children: "00:00:00",
  },
}

export const Countdown: Story = {
  render: () => {
    const [seconds, setSeconds] = React.useState(0)
    React.useEffect(() => {
      const interval = window.setInterval(() => {
        setSeconds(seconds => seconds + 1)
      }, 1000)
      return () => window.clearInterval(interval)
    }, [])
    return <TimeDisplay>{formatSeconds(seconds)}</TimeDisplay>
  }
}