import { css } from "@emotion/css"
import React from "react"
import { usePlugin } from "src/hooks"
import { TimerDetailModal } from "src/plugin/modal"
import { CurrentTimer } from "./CurrentTimer"
import { TimerList } from "./TimerList"

export const MainView = () => {
  const plugin = usePlugin()
  const app = plugin.app
  const onClick = () => {
    const modal = new TimerDetailModal(app, plugin)
    modal.open()
  }
  return (
    <div
      className={css`
				display: flex;
				flex-direction: column;
				gap: var(--size-4-4);
			`}
    >
      <CurrentTimer />
      <section className={css`
				display: flex;
				flex-direction: column;
				gap: var(--size-4-2);
			`}>
        <button onClick={onClick}
          className={css`
						display: block;
						margin-left: auto;
						cursor: pointer;
					`}
        >Add Timer</button>
        <TimerList plugin={plugin} />
      </section>
    </div>
  )
}