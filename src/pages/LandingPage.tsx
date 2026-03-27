import Grid from "@mui/material/Grid";
import { TasksProgress } from "../components/views/Landing/TaskProgress";
import { CommonChart } from "../components/views/Landing/CommonChart";
import { useGetAllProjects } from "../api/projects/projectController";
import { useGetAllTeams } from "../api/teams/teamController";
import { useGetAllTasks } from "../api/tasks/taskController";
import { userAuthContext } from "../utils/context/UserContext";
import { TaskTable } from "../components/views/Landing/TaskTable";
import { TeamsTable } from "../components/views/Landing/TeamsTable";
import { ProjectTable } from "../components/views/Landing/ProjectTable";
import { useGetAllUsers } from "../api/userController";
import { TotalCard } from "../components/views/Landing/components/TotalCard";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TaskIcon from "@mui/icons-material/Task";



function calculateTasks(userTasks: number, inProgressTasks: number) {
  if (userTasks && inProgressTasks) {
    return Number(((inProgressTasks / userTasks) * 100).toFixed(2));
  }
  return Number(0);
}

export const LandingPage = () => {
  const { currentUser } = userAuthContext();
  const { data: allUsers } = useGetAllUsers();
  const { data: allTeams } = useGetAllTeams();
  const { data: allTasks } = useGetAllTasks();
  const { data: allProjects } = useGetAllProjects();

  const userTeams = allTeams?.filter((team) => {
    return currentUser && team.users.some((user) => user.id === currentUser.id);
  });
  const userTeamsLength = userTeams?.length;

  const userProjects = allProjects?.filter(
    (project) =>
      project?.admins?.find((admin) => admin === currentUser?.id) ||
      project?.members?.find((member) => member === currentUser?.id),
  );

  const userProjectsLength = userProjects?.length;

  const userTasks = allTasks?.filter((task) => {
    const assigned = task.assigned_user;
    if (Array.isArray(assigned)) {
      return assigned.includes(currentUser!.id);
    }
    return assigned === currentUser?.id;
  });

  const projectTaskCounts = userProjects?.map((project) => {
    const taskCount =
      userTasks?.filter((task) => task.project === project.id).length ?? 0;

    return {
      projectId: project.id,
      projectName: project.name,
      taskCount,
    };
  });

  const allProjectsTaskCounts = allProjects?.map((project) => {
    const taskCount =
      allTasks?.filter((task) => task.project === project.id).length ?? 0;
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
        ?.filter((task) => task.project === project.id)
        .map((task) => ({
          id: task.id,
          status: task.status,
          title: task.title,
          priority: task.priority,
          project: project.name,
          updated_at: task.updated_at,
        })) ?? [],
  );

  const projectUsersCount = allUsers?.map((user) => {
    const projectUsersCount =
      allProjects?.filter(
        (project) =>
          project?.admins?.includes(user.id) ||
          project?.members?.includes(user?.id),
      ).length ?? 0;

    return {
      userId: user.id,
      userfirst_name: user.first_name,
      userCountProjects: projectUsersCount,
    };
  });

  const userByTask = allUsers?.map((user) => {
    const taskUsersCount =
      allTasks?.filter((task) => task?.assigned_user.includes(user.id))
        .length ?? 0;

    return {
      userId: user.id,
      userfirst_name: user.first_name,
      userTasksCount: taskUsersCount,
    };
  });

  const numberToColor = (num: number) => {
    const hue = (((num * 137.508) % 360) + 360) % 360;
    return `hsl(${hue}, 70%, 55%)`;
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
        <TotalCard
          sx={{ height: "100%" }}
          value={userTeamsLength}
          title={"Total teams"}
          icon={<GroupIcon fontSize="large" />}
        />
      </Grid>
      <Grid
        size={{
          lg: 3,
          sm: 6,
          xs: 12,
        }}
      >
        <TotalCard
          sx={{ height: "100%" }}
          value={userProjectsLength}
          title={"Total projects"}
          icon={<AssignmentIcon fontSize="large" />}
        />
      </Grid>
      <Grid
        size={{
          lg: 3,
          sm: 6,
          xs: 12,
        }}
      >
        <TotalCard
          sx={{ height: "100%" }}
          value={userTasksLength}
          title={"Total tasks"}
          icon={<TaskIcon fontSize="large" />}
        />
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
        <CommonChart
          data={projectTaskCounts?.map((project) => ({
            label: project.projectName,
            value: project.taskCount,
            color: numberToColor(project.projectId),
          }))}
          title="Team tasks"
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
            updatedAt: task.updated_at,
          }))}
        />
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
            updatedAt: team.updated_at
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
            admins: project.admins
              .map((id) => allUsers?.find((user) => user.id === id)?.first_name)
              .join(", "),
            members: project.members
              .map((id) => allUsers?.find((user) => user.id === id)?.first_name)
              .join(", "),
          }))}
        />
      </Grid>
      <Grid
        size={{
          lg: 4,
          md: 6,
          xs: 12,
        }}
      >
        <CommonChart
          data={allProjectsTaskCounts
            ?.map((project) => ({
              label: project.projectName,
              value: project.taskCount,
              color: numberToColor(project.projectId),
            }))
            .filter((p) => p.value! > 0)}
          title="Task in projects"
        />
      </Grid>
      <Grid
        size={{
          lg: 4,
          md: 6,
          xs: 12,
        }}
      >
        <CommonChart
          data={projectUsersCount
            ?.map((users) => ({
              label: users.userfirst_name,
              value: users.userCountProjects,
              color: numberToColor(users.userId),
            }))
            .filter((p) => p.value! > 0)}
          title="Users count projects"
        />
      </Grid>
      <Grid
        size={{
          lg: 4,
          md: 6,
          xs: 12,
        }}
      >
        <CommonChart
          data={userByTask
            ?.map((users) => ({
              label: users.userfirst_name,
              value: users.userTasksCount,
              color: numberToColor(users.userId),
            }))
            .filter((p) => p.value > 0)}
          title="Users count tasks"
        />
      </Grid>
    </Grid>
  );
};
