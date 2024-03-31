import { ProjectList } from "../../src/components/ProjectList";
import "@testing-library/jest-dom";
import React from 'react';
import { render } from '@testing-library/react';
import { createRandomProject } from "../../mock";


it("render correctly", () => {
  const projects = Array.from({length: 10}, (_, i) => createRandomProject({
    name: `Project Name ${i}`,
    color: "red"
  }))
  const {getAllByText, container} = render(<ProjectList data={projects} />)
  const projectNames = getAllByText(/Project Name/)
  expect(projectNames).toHaveLength(10)
  expect(container).toMatchSnapshot()
})