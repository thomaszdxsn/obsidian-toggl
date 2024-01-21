import { css } from '@emotion/css';
import { useAtomValue, useSetAtom } from 'jotai';
import React from 'react'
import { useForm } from 'react-hook-form';
import { FiCornerUpLeft } from 'react-icons/fi';
import { activeProjectsAtom, savedTimersAtom, tagsAtom } from '../atoms';
import { Button } from './Button';

interface Props {
  onSuccess: () => void
}


export const TimerForm = ({ onSuccess }: Props) => {
  const form = useForm<{
    projectId: string;
    tagIds: string[]
    description: string
  }>()
  const projects = useAtomValue(activeProjectsAtom)
  const tags = useAtomValue(tagsAtom)
  const projectOptions = projects.map(project => {
    return <option value={project.id} key={project.id}>{project.name}</option>
  })
  const tagOptions = tags.map(tag => {
    return <option value={tag.id} key={tag.id}>{tag.name}</option>
  })
  const setSavedTimers = useSetAtom(savedTimersAtom)
  return (
    <form
      className={css`
        display: flex;
        flex-direction: column;
        gap: var(--size-4-2);
      `}
      onSubmit={form.handleSubmit((data) => {
        setSavedTimers(prev => {
          return [...prev, {
            ...data,
            projectName: projects.find(project => project.id.toString() === data.projectId)?.name ?? "",
            tags: data.tagIds.map(tagId => tags.find(tag => tag.id.toString() === tagId)?.name ?? ""),
            projectId: parseInt(data.projectId),
            tagIds: data.tagIds.map(tagId => parseInt(tagId)),
          }]
        })
        onSuccess()
      })}
    >
      <label
        className={css`
          display: flex;
          flex-direction: column;
          gap: var(--size-4-1);
        `}
      >
        <span>Project</span>
        <select {...form.register("projectId")} aria-placeholder="Project"
        >
          {projectOptions}
        </select>
      </label>
      <label

        className={css`
          display: flex;
          flex-direction: column;
          gap: var(--size-4-1);
        `}
      >
        <span>Description</span>
        <input {...form.register("description")} placeholder="Description" />
      </label>
      <label
        className={css`
          display: flex;
          flex-direction: column;
          gap: var(--size-4-1);
        `}
      >
        <span>Tags</span>
        <select {...form.register("tagIds")} aria-placeholder="Tags" multiple 
          className={css`
            height: 120px;
          `}
        >
          <option value="" disabled>Tags</option>
          {tagOptions}
        </select>
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
          disabled={form.formState.isSubmitting}
          className={css`
            cursor: pointer;
          `}
        >
          <FiCornerUpLeft />
        </Button>
      </footer>
    </form>
  )
}