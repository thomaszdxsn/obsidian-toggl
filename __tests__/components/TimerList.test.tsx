import { TimerList } from "../../src/components/TimerList";
import "@testing-library/jest-dom";
import React from 'react';
import { render } from '@testing-library/react';
import { createRandomTimer, createRandomMe, createRandomProject } from "../../mock";
import { store, meAtom, savedTimersAtom } from "../../src/atoms";
import { TestingProvider } from "../../src/utils";


it("render correctly", () => {
  const project = createRandomProject({
    name: "Project Name",
    color: "red",
  })
  const timers = [createRandomTimer({
    projectId: project.id,
    projectName: project.name,
    description: "123",
    tags: []
  })]
  const me = createRandomMe({
    projects: [project]
  })
  store.set(meAtom, me)
  store.set(savedTimersAtom, timers)
  const {container, getByText} = render(
    <TestingProvider>
    <TimerList plugin={{} as any} />
    </TestingProvider>
  )
  const card = getByText("Project Name")
  expect(card).toBeInTheDocument()
  expect(container).toMatchSnapshot()
})