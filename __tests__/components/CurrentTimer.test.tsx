import { render } from '@testing-library/react'
import "@testing-library/jest-dom"
import React from 'react'
import { CurrentTimer } from '../../src/components/CurrentTimer'
import { TestingProvider } from '../../src/utils'
import { store, passedSecondsAtom, currentEntryAtom, meAtom } from '../../src/atoms'
import { createRandomMe, createRandomProject, createRandomTimeEntry } from '../../mock'


it("should render placeholder if current is not a timer exist", () => {
  const { getByText, container } = render(
    <TestingProvider>
      <CurrentTimer placeholder='placeholder' />
    </TestingProvider>,
  )
  const placeholder = getByText("placeholder")
  expect(placeholder).toBeInTheDocument()
  expect(container).toMatchSnapshot()
})

it("should render timer if current is a timer exist", () => {
  store.set(passedSecondsAtom, 60 * 60)
  const { getByText, container } = render(
    <TestingProvider>
      <CurrentTimer placeholder='placeholder' />
    </TestingProvider>,
  )
  const timer = getByText("01:00:00")
  expect(timer).toBeInTheDocument()
  expect(container).toMatchSnapshot()
})

it("show project & description if data exists", () => {
  const currentEntry = createRandomTimeEntry({project_id: 1, description: "Hello World"})
  store.set(currentEntryAtom, currentEntry)
  const projects = [
    createRandomProject({id: 1, name: "Project Name"})
  ]
  const me = createRandomMe({projects: projects})
  store.set(meAtom, me)
  
  const screen = render(
    <TestingProvider>
      <CurrentTimer placeholder='placeholder' />
    </TestingProvider>,
  )
  expect(screen.getByText("Hello World")).toBeInTheDocument()
  expect(screen.getByText("Project Name")).toBeInTheDocument()
})