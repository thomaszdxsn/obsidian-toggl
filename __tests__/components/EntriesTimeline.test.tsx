import { EntriesTimeline } from "../../src/components/EntriesTimeline";
import "@testing-library/jest-dom"
import React from 'react'
import {render}from '@testing-library/react'
import { createRandomProject, createRandomTimeEntry } from '../../mock'
import moment from 'moment'


it("render correctly", () => {
  const project = createRandomProject({id: 1, name: "Project Name"})
  const entries = Array.from({length: 10}, (_, i) => createRandomTimeEntry({id: i, project_id: 1,
    start: moment(new Date()).format("YYYY-MM-DDT00:00:00Z")
  }))
  const {getAllByText} = render(<EntriesTimeline entries={entries} projectDict={{
    [project.id]: project
  }} />)
  const projectNames = getAllByText("Project Name")
  expect(projectNames).toHaveLength(10)
})