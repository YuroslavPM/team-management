import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import NewProjectForm from "../../components/projects/NewProjectForm";
import { PageHeader } from "../../components/ui/PageHeader";

export const CreateProjectPage = () => {
  return (
    <>
      <Link
        to="/projects"
        className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Return to projects
      </Link>
      <PageHeader title={"Create project"}/>
      <NewProjectForm />
    </>
  );
};
