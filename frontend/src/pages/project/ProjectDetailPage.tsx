import { ArrowLeft, UserPlus } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { errorMessage } from "../../api/errors";
import { useProject } from "../../api/projects";
import type { Project } from "../../api/types";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { Spinner } from "../../components/ui/Spinner";

export const ProjectDetailPage = () => {
  const projectId = Number(useParams().projectId);
  const { data: project, isPending, error } = useProject(projectId);

  return (
    <>
      <Link
        to="/projects"
        className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="size-4" aria-hidden />
        All projects
      </Link>
      {error && <Alert>{errorMessage(error)}</Alert>}
      {isPending && <Spinner label="Loading project" />}
      {project && <ProjectDetail project={project} />}
    </>
  );
};

function ProjectDetail({ project }: { project: Project }) {
  return (
    <>
      <PageHeader
        title={project.name}
        subtitle={project.description || undefined}
        actions={
          <Button>
            <UserPlus className="size-4" aria-hidden />
            Add member
          </Button>
        }
      />
    </>
  );
}

export default ProjectDetailPage;
