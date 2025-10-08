import { Dispatch, Fragment } from "react"

import { ProjectSelect } from "features/components/project-select"

import { Container } from "./container"

export type ProjectMapping = Record<string, string>

interface SelectProjectsProps {
  importedProjects: string[]
  projectMapping: ProjectMapping
  onProjectMappingChange: Dispatch<ProjectMapping>
}
export const SelectProjects = ({
  importedProjects,
  projectMapping,
  onProjectMappingChange,
}: SelectProjectsProps) => (
  <Container title="Project mapping">
    <div className="grid max-h-58 grid-cols-[auto_1fr] items-center gap-2 overflow-auto">
      {importedProjects.length === 0 ? (
        <span className="text-text-gentle">No projects found</span>
      ) : (
        importedProjects.map(project => (
          <Fragment key={project}>
            <div className="truncate">{project}:</div>
            <ProjectSelect
              value={projectMapping[project] ?? ""}
              onChange={id => onProjectMappingChange({ [project]: id })}
            />
          </Fragment>
        ))
      )}
    </div>
  </Container>
)
