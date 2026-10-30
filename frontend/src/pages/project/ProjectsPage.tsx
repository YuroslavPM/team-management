import { Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { errorMessage } from "../../api/errors";
import { useProjects } from "../../api/projects";
import {
  type ProjectStatusType,
  type StatusFilter,
  statusOptions,
} from "../../api/types";
import { useAuth } from "../../auth/authContext";
import { ProjectCard } from "../../components/projects/ProjectCard";
import { Alert } from "../../components/ui/Alert";
import { Combobox, type ComboboxOption } from "../../components/ui/Combobox";
import { PageHeader } from "../../components/ui/PageHeader";
import { Spinner } from "../../components/ui/Spinner";

export const ProjectsPage = () => {
  const { user } = useAuth();
  const { data, isPending, error } = useProjects();

  const [selectedStatus, setSelectedStatus] = useState<
    ProjectStatusType | "all"
  >("all");

  const filteredOptions: ComboboxOption<StatusFilter>[] = [
    { label: "All statuses", value: "all" },
    ...statusOptions,
  ];

  const filteredProjects = data?.items.filter(
    (project) => selectedStatus === "all" || project.status === selectedStatus,
  );

  return (
    <>
      <PageHeader
        title="Projects"
        subtitle={data ? `${data.total} projects` : undefined}
        actions={
          user?.role === "admin" && (
            <Link
              to="/projects/new"
              className="inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed bg-brand-600 text-white hover:bg-brand-700 disabled:bg-brand-600/60"
            >
              <Plus className="size-4" aria-hidden />
              New project
            </Link>
          )
        }
      />
      <div className="mb-4">
        <Combobox<ProjectStatusType | "all">
          options={filteredOptions}
          value={selectedStatus}
          onChange={(value) => {
            if (value != null) {
              setSelectedStatus(value);
            }
          }}
          label={"Status"}
          placeholder="Select a status..."
        />
      </div>

      {error && <Alert>{errorMessage(error)}</Alert>}
      {isPending && <Spinner label="Loading projects" />}

      {filteredProjects && (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects?.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </ul>
      )}
      {filteredProjects?.length === 0 && (
        <>
          <Spinner label={"No projects..."}/>
          <Link
            to="/projects/new"
            className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"
          >
            <Plus className="size-4" aria-hidden />
            New project
          </Link>
        </>
      )}
    </>
  );
};

export default ProjectsPage;
