import Grid from "@mui/material/Grid";
import { TotalTeams } from "../components/views/Landing/TotalTeams";
import { TotalProjects } from "../components/views/Landing/TotalProjects";
import { TotalTasks } from "../components/views/Landing/TotalTasks";
import { TasksProgress } from "../components/views/Landing/TaskProgress";
import { TaskChart } from "../components/views/Landing/TaskChart";
import { useGetAllProjects } from "../api/projects/projectController";
import { useGetAllTeams } from "../api/teams/teamController";
import { useGetAllTasks } from "../api/tasks/taskController";
import { userAuthContext } from "../utils/context/UserContext";
import { TaskTable } from "../components/views/Landing/TaskTable";
import { TeamsTable } from "../components/views/Landing/TeamsTable";
import { ProjectTable } from "../components/views/Landing/ProjectTable";
import { useGetAllUsers } from "../api/userController";

function calculateTasks(userTasks: number, inProgressTasks: number) {
  if (userTasks && inProgressTasks) {
    return ((inProgressTasks / userTasks) * 100).toFixed(2);
  }
  return Number(0);
}

export const LandingPage = () => {
  const { currentUser } = userAuthContext();
  const { data: allUsers } = useGetAllUsers();
  const { data: allTeams } = useGetAllTeams();
  const { data: allTasks } = useGetAllTasks();
  const { data: allProjects } = useGetAllProjects();

  const userTeams = allTeams?.filter(
    (team) => currentUser && team.users.includes(currentUser.id),
  );
  const userTeamsLength = userTeams?.length;

  const userProjects = allProjects?.filter(
    (project) =>
      project.adminIds.find((admin) => admin === currentUser?.id) ||
      project.memberIds.find((member) => member === currentUser?.id),
  );

  const userProjectsLength = userProjects?.length;

  const userTasks = allTasks?.filter((task) => {
    const assigned = task.assignedUserId;
    if (Array.isArray(assigned)) {
      return assigned.includes(currentUser!.id);
    }
    return assigned === currentUser?.id;
  });

  const projectTaskCounts = userProjects?.map((project) => {
    const taskCount =
      userTasks?.filter((task) => task.projectId === project.id).length ?? 0;

    return {
      projectId: project.id,
      projectName: project.name,
      taskCount,
    };
  });

  const userInProgressTasksLength = userTasks?.filter(
    (task) => task.status === "in-progress",
  ).length;

  const userTasksLength = userTasks?.length;

  const projectTaskTable = userProjects?.flatMap(
    (project) =>
      userTasks
        ?.filter((task) => task.projectId === project.id)
        .map((task) => ({
          id: task.id,
          status: task.status,
          title: task.title,
          priority: task.priority,
          project: project.name,
          updatedAt: task.updatedAt,
        })) ?? [],
  );

  

  const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 70%, 55%)`;
  };

  return (
    <Grid container spacing={3} sx={{ minWidth: "100%" }}>
      <Grid
        size={{
          lg: 3,
          sm: 6,
          xs: 12,
        }}
      >
        <TotalTeams sx={{ height: "100%" }} value={userTeamsLength} />
      </Grid>
      <Grid
        size={{
          lg: 3,
          sm: 6,
          xs: 12,
        }}
      >
        <TotalProjects sx={{ height: "100%" }} value={userProjectsLength} />
      </Grid>
      <Grid
        size={{
          lg: 3,
          sm: 6,
          xs: 12,
        }}
      >
        <TotalTasks sx={{ height: "100%" }} value={userTasksLength} />
      </Grid>
      <Grid
        size={{
          lg: 3,
          sm: 6,
          xs: 12,
        }}
      >
        <TasksProgress
          sx={{ height: "100%" }}
          value={calculateTasks(userTasksLength!, userInProgressTasksLength!)}
        />
      </Grid>
      <Grid
        size={{
          lg: 4,
          md: 6,
          xs: 12,
        }}
      >
        <TaskChart
          data={projectTaskCounts?.map((project) => ({
            label: project.projectName,
            value: project.taskCount,
            color: stringToColor(project.projectId),
          }))}
        />
      </Grid>
      <Grid
        size={{
          lg: 8,
          md: 12,
          xs: 12,
        }}
      >
        <TaskTable
          tasks={projectTaskTable?.map((task) => ({
            id: task.id,
            status: task.status,
            title: task.title,
            priority: task.priority,
            project: task.project,
            updatedAt: task.updatedAt,
          }))}
        ></TaskTable>
      </Grid>
      <Grid
        size={{
          lg: 4,
          md: 6,
          xs: 12,
        }}
      >
        <TeamsTable
          teams={userTeams?.map((team) => ({
            id: team.id,
            name: team.name,
            updatedAt: team.updatedAt,
          }))}
        ></TeamsTable>
      </Grid>
      <Grid
        size={{
          lg: 8,
          md: 12,
          xs: 12,
        }}
      >
        <ProjectTable
          projects={userProjects?.map((project) => ({
            id: project.id,
            status: project.status,
            name: project.name,
            admins: project.adminIds
              .map((id) => allUsers?.find((user) => user.id === id)?.firstName)
              .join(", "),
            members: project.memberIds
              .map((id) => allUsers?.find((user) => user.id === id)?.firstName)
              .join(", "),
            updatedAt: project.updatedAt,
          }))}
        />
      </Grid>
    </Grid>
  );
};
