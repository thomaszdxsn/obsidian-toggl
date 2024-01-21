import React from 'react'
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { projectsAtom } from "src/atoms";
import { Button } from './Button';
import { FiCheck, FiCornerUpLeft, FiRefreshCw } from 'react-icons/fi';
import { css } from '@emotion/css';
import { useCreateProjectMutation } from 'src/hooks';

interface Props {
  onSucecss: () => void
  projectId?: number
}

const BUILTIN_COLORS = [
  '#0b83d9',
  '#9e5bd9',
  '#d94182',
  '#e36a00',
  '#bf7000',
  '#2da608',
  '#06a893',
  '#c9806b',
  '#465bb3',
  '#990099',
  '#c7af14',
  '#566614',
  '#d92b2b',
  '#525266'
]

export const ProjectForm = ({ onSucecss, projectId }: Props) => {
  const projects = useAtomValue(projectsAtom)
  const project = useMemo(() => projects.find(project => project.id === projectId), [projectId])
  const form = useForm({
    defaultValues: {
      name: project?.name || "",
      color: project?.color || BUILTIN_COLORS[0]
    },
  })
  const createProjectMutation = useCreateProjectMutation()

  const onSubmit = async () => {
    const data = form.getValues()
    // TODO: distinct create and update
    createProjectMutation.mutate(data, {
      onSuccess: () => onSucecss?.()
    })
  }

  const isPending = createProjectMutation.isPending

  return (
    <form
      className={css`
    display: flex;
    flex-direction: column;
    gap: var(--size-4-2);
  `}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <label
        className={css`
                display: flex;
                flex-direction: column;
                gap: var(--size-4-1);
              `}
      >
        <span>Name</span>
        <input type="text" {...form.register("name")} />
      </label>
      <label
        className={css`
                display: flex;
                flex-direction: column;
                gap: var(--size-4-1);
              `}
      >
        <span>Color</span>
        <div className={css`
          display: flex;
          gap: var(--size-4-1);
        `}>
          {BUILTIN_COLORS.map(color => {
            return <label key={color} htmlFor={color}>
              <input
                type="radio"
                id={color}
                value={color}
                className={css`display: none;`}
                {...form.register("color")}
              />
              <div
                className={css`
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                  width: var(--size-4-4);
                  height: var(--size-4-4);
                  border-radius: 50%;
                  background-color: ${color};
                `}
              >
                {form.watch("color") === color && <FiCheck color="white" />}
              </div>
            </label>
          })}
        </div>
      </label>
      <footer className={
        css`
          display: flex;
          gap: var(--size-4-2);
          justify-content: center;
        `
      }>
        <Button
          type="submit"
          disabled={isPending}
          className={css`
            cursor: pointer;
          `}
        >
          {isPending ?
            <FiRefreshCw className={
              css`
                    animation: spin 1s linear infinite
                  `
            } />
            : <FiCornerUpLeft />}
        </Button>
      </footer>
    </form>
  )
}