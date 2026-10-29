import {
  ArrowLeft,
  Pencil,
  Trash,
  UserPlus,
  UserRoundGroup,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

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
import { ProjectSection } from "../../components/projects/ProjectSection";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Combobox } from "../../components/ui/Combobox";
import { ErrorAlert } from "../../components/ui/ErrorAlert";
import { PageHeader } from "../../components/ui/PageHeader";
import { Spinner } from "../../components/ui/Spinner";
import { canProjectManage } from "../../utils/helpers/userHelpers";

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
      {error && <ErrorAlert error={error} />}
      {isPending && <Spinner label="Loading project" />}
      {project && <ProjectDetail project={project} />}
    </>
  );
};

function ProjectDetail({ project }: { project: Project }) {
  const navigate = useNavigate();

  const { user } = useAuth();
  const { data, error: teamError } = useTeams();

  const [addTeam, setAddTeam] = useState(false);
  const [addMember, setAddMember] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const removeMember = useRemoveProjectMember(project.id);
  const editProject = useEditProject(project.id);
  const deleteProject = useDeleteProject(project.id);

  const canManage = canProjectManage(user!, project);

  const teamNames = project?.teamIds.map((teamId) => {
    const team = data?.items.find((team) => team.id === teamId);

    return {
      id: teamId,
      name: team?.name,
    };
  });

  const errors = [
    teamError,
    removeMember.error,
    editProject.error,
    deleteProject.error,
  ].filter((e) => e !== null);

  return (
    <>
      <PageHeader
        title={project.name}
        subtitle={project.description || undefined}
        actions={
          canManage && (
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
          )
        }
      />

      {errors.map((error, index) => {
        <ErrorAlert key={index} error={error} />;
      })}
      <div className="mb-4 w-48">
        <Combobox<ProjectStatusType>
          options={statusOptions}
          value={project.status}
          disabled={editProject.isPending && !canManage}
          onChange={(value) => {
            if (value != null) {
              editProject.mutate({ status: value });
            }
          }}
          label={"Status:"}
          placeholder="Select a status..."
        />
      </div>
      <ProjectSection
        title="Members in project:"
        action={
          canManage && (
            <Button onClick={() => setAddMember(true)}>
              <UserPlus className="size-4" aria-hidden />
              Add member
            </Button>
          )
        }
      >
        <ul className="divide-y divide-slate-100">
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
                  disabled={removeMember.isPending}
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
      </ProjectSection>

      <ProjectSection
        title="Teams in project:"
        action={
          canManage && (
            <Button onClick={() => setAddTeam(true)}>
              <UserRoundGroup className="size-4" aria-hidden />
              Add team
            </Button>
          )
        }
      >
        <ul className="divide-y divide-slate-100">
          {teamNames.map((team) => (
            <li
              key={team.id}
              className="flex items-center justify-between px-5 py-3"
            >
              <span className="text-sm font-medium text-slate-900">
                {team.name}
              </span>

              {canManage && (
                <Button
                  variant="danger"
                  disabled={editProject.isPending}
                  aria-label={`Remove ${team.name ?? "team"}`}
                  onClick={() =>
                    editProject.mutate({
                      teamIds: project.teamIds.filter((id) => id !== team.id),
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
      </ProjectSection>

      {addTeam && canManage && (
        <AddTeamDialog project={project} onClose={() => setAddTeam(false)} />
      )}
      {addMember && canManage && (
        <AddMemberDialog
          project={project}
          onClose={() => setAddMember(false)}
        />
      )}
      {editing && canManage && (
        <EditProjectDialog
          project={project}
          onClose={() => setEditing(false)}
        />
      )}

      {deleting && canManage && (
        <ConfirmModal
          reason={"delete this project?"}
          onClick={() => {
            deleteProject.mutate(undefined, {
              onSuccess: () => {
                navigate("/projects");
              },
            });
          }}
          onClose={() => setDeleting(false)}
        />
      )}
    </>
  );
}

export default ProjectDetailPage;
