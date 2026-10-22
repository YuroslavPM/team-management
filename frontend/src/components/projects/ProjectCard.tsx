import { Link } from "react-router-dom";

import { type Project, ProjectStatus } from "../../api/types";
import { Badge } from "../ui/Badge";

export type ProjectCardProps = {
  project: Project;
};

export const ProjectCard = (props: ProjectCardProps) => {
  const { project } = props;

  return (
    <li
      key={project.id}
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
    >
      <Link
        to={`/projects/${project.id}`}
        className="text-base font-semibold text-slate-900 hover:text-brand-700"
      >
        {project.name}
      </Link>
      <p className="mt-4 text-xs text-slate-500">
        {project.members.length}
        {project.members.length === 1 ? " member" : " members"}
      </p>
      <Badge tone="brand">{ProjectStatus[project.status]}</Badge>
      <p className="mt-1 line-clamp-2 text-sm text-slate-500">
        {project.description || "No description"}
      </p>
      <p className="mt-4 text-xs text-slate-500">
        Last update: {project.updatedAt}
      </p>
    </li>
  );
};
