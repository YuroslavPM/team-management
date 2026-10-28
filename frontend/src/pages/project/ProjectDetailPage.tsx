import {
  ArrowLeft,
  Pencil,
  Trash,
  UserPlus,
  UserRoundGroup,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { errorMessage } from "../../api/errors";
import {
  useDeleteProject,
  useEditProject,
  useProject,
  useRemoveProjectMember,
} from "../../api/projects";
import { useTeams } from "../../api/teams";
import {
  type Project,
  type ProjectStatusType,
  statusOptions,
} from "../../api/types";
import { useAuth } from "../../auth/authContext";
import { ConfirmModal } from "../../components/layout/ConfirmModal";
import { AddMemberDialog } from "../../components/projects/AddMemberDialog";
import { AddTeamDialog } from "../../components/projects/AddTeamDialog";
import { EditProjectDialog } from "../../components/projects/EditProjectDialog";
import { Alert } from "../../components/ui/Alert";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Combobox } from "../../components/ui/Combobox";
import { PageHeader } from "../../components/ui/PageHeader";
import { Spinner } from "../../components/ui/Spinner";
import { isAdmin } from "../../utils/helpers/userHelpers";

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
  const { user } = useAuth();
  const { data } = useTeams();
  const [addTeam, setAddTeam] = useState(false);
  const [addMember, setAddMember] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const removeMember = useRemoveProjectMember(project.id);
  const editProject = useEditProject(project.id);
  const deleteProject = useDeleteProject(project.id);
  const admin = isAdmin(user!);

  const canManage =
    user?.role === "admin" ||
    project.members.some((m) => m.userId === user?.id && m.role === "lead");

  const teamNames = project?.teamIds.map((teamId) => {
    const team = data?.items.find((team) => team.id === teamId);

    return {
      id: teamId,
      name: team?.name,
    };
  });

  return (
    <>
      <PageHeader
        title={project.name}
        subtitle={project.description || undefined}
        actions={
          <>
            <Button variant="secondary" onClick={() => setEditing(true)}>
              <Pencil className="size-4" aria-hidden />
              Edit
            </Button>
            <Button variant="danger" onClick={() => setDeleting(true)}>
              <Trash className="size-4" aria-hidden />
              Delete project
            </Button>
          </>
        }
      />

      {removeMember.error && <Alert>{errorMessage(removeMember.error)}</Alert>}
      <div className="mb-4 w-48">
        <Combobox<ProjectStatusType>
          options={statusOptions}
          value={project.status}
          onChange={(value) => {
            if (value != null) {
              editProject.mutate({ status: value });
            }
          }}
          label={"Status:"}
          placeholder="Select a status..."
        />
      </div>
      <section className="rounded-lg border border-slate-200 bg-white">
        <div className="flex items-center justify-between py-4 pr-4">
          <h2
            id="members-heading"
            className="border-b border-slate-100 px-5 py-3 text-sm font-semibold text-slate-700"
          >
            Members in project:
          </h2>
          <Button onClick={() => setAddMember(true)}>
            <UserPlus className="size-4" aria-hidden />
            Add member
          </Button>
        </div>
        <ul
          aria-labelledby="members-heading"
          className="divide-y divide-slate-100"
        >
          {project.members.map((member) => (
            <li
              key={member.userId}
              className="flex items-center justify-between px-5 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-900">
                  {member.displayName}
                </span>
                {member.role === "lead" && <Badge tone="brand">lead</Badge>}
              </div>
              {canManage && (
                <Button
                  variant="danger"
                  aria-label={`Remove ${member.displayName}`}
                  onClick={() => removeMember.mutate(member.userId)}
                >
                  Remove
                </Button>
              )}
            </li>
          ))}
          {project.members.length === 0 && (
            <li className="px-5 py-6 text-sm text-slate-500">
              No members yet.
            </li>
          )}
        </ul>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white">
        <div className="flex items-center justify-between py-4 pr-4">
          <h2
            id="teams-heading"
            className="border-b border-slate-100 px-5 py-3 text-sm font-semibold text-slate-700"
          >
            Teams in project:
          </h2>

          <Button onClick={() => setAddTeam(true)}>
            <UserRoundGroup className="size-4" aria-hidden />
            Add team
          </Button>
        </div>

        <ul
          aria-labelledby="teams-heading"
          className="divide-y divide-slate-100"
        >
          {teamNames.map((teamName) => (
            <li
              key={teamName.id}
              className="flex items-center justify-between px-5 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-900">
                  {teamName.name}
                </span>
              </div>
              {canManage && (
                <Button
                  variant="danger"
                  aria-label={`Remove ${teamName.name}`}
                  onClick={() =>
                    editProject.mutate({
                      teamIds: [
                        ...project.teamIds.filter((t) => t !== teamName.id),
                      ],
                    })
                  }
                >
                  Remove
                </Button>
              )}
            </li>
          ))}
          {project.teamIds.length === 0 && (
            <li className="px-5 py-6 text-sm text-slate-500">No teams yet.</li>
          )}
        </ul>
      </section>
      {addTeam && (
        <AddTeamDialog project={project} onClose={() => setAddTeam(false)} />
      )}
      {addMember && (
        <AddMemberDialog
          project={project}
          onClose={() => setAddMember(false)}
        />
      )}
      {editing && admin && (
        <EditProjectDialog
          project={project}
          onClose={() => setEditing(false)}
        />
      )}

      {deleting && admin && (
        <ConfirmModal
          reason={"delete this project?"}
          onClick={() => {
            deleteProject.mutate();
            navigate("/projects");
          }}
          onClose={() => setDeleting(false)}
        />
      )}
    </>
  );
}

export default ProjectDetailPage;
