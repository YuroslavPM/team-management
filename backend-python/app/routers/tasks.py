from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy import case, func, select
from sqlalchemy.orm import Session

from app.auth import current_user
from app.db import get_db
from app.errors import _error_response
from app.models import ProjectMember, Task, TaskPriority, TaskStatus, User
from app.routers.projects import _get_visible_project, _require_project_admin
from app.schemas import Page, TaskCreate, TaskOut, TaskUpdate

router = APIRouter(tags=["tasks"])

SORT_VALUES = {
    "id",
    "-id",
    "createdAt",
    "-createdAt",
    "dueDate",
    "-dueDate",
    "priority",
    "-priority",
}

_PRIORITY_RANK = case(
    (Task.priority == TaskPriority.LOW, 1),
    (Task.priority == TaskPriority.MEDIUM, 2),
    (Task.priority == TaskPriority.HIGH, 3),
    (Task.priority == TaskPriority.URGENT, 4),
    else_=0,
)


def _task_out(task: Task) -> TaskOut:
    return TaskOut.model_validate(task)


def _require_visible_task(db: Session, me: User, task_id: int) -> Task:
    task = db.get(Task, task_id)
    if task is None or _get_visible_project(db, me, task.project_id) is None:
        _error_response(404, "Task not found")
    return task


def _require_project_member(db: Session, me: User, project_id: int):
    project = _get_visible_project(db, me, project_id)
    if project is None:
        _error_response(404, "Project not found")
    return project


def _validate_assignee(db: Session, project_id: int, assignee_id: int | None):
    if assignee_id is None:
        return
    member = db.execute(
        select(ProjectMember.id).where(
            ProjectMember.project_id == project_id,
            ProjectMember.user_id == assignee_id,
        )
    ).first()
    if member is None:
        _error_response(422, "Assignee is not a member of the project")


def _apply_sort(query, sort: str):
    if sort not in SORT_VALUES:
        _error_response(422, "Invalid sort")
    descending = sort.startswith("-")
    field = sort[1:] if descending else sort

    if field == "id":
        primary = Task.id.desc() if descending else Task.id.asc()
        return query.order_by(primary)
    if field == "createdAt":
        primary = Task.created_at.desc() if descending else Task.created_at.asc()
        return query.order_by(primary, Task.id.asc())
    if field == "dueDate":
        primary = (
            Task.due_date.desc().nulls_last() if descending else Task.due_date.asc().nulls_last()
        )
        return query.order_by(primary, Task.id.asc())

    primary = _PRIORITY_RANK.desc() if descending else _PRIORITY_RANK.asc()
    return query.order_by(primary, Task.id.asc())


def list_project_tasks(
    db: Session,
    project_id: int,
    *,
    status: TaskStatus | None,
    priority: TaskPriority | None,
    assignee_id: int | None,
    sort: str,
    limit: int,
    offset: int,
) -> Page[TaskOut]:
    query = select(Task).where(Task.project_id == project_id)
    if status is not None:
        query = query.where(Task.status == status)
    if priority is not None:
        query = query.where(Task.priority == priority)
    if assignee_id is not None:
        query = query.where(Task.assignee_id == assignee_id)

    total = db.execute(select(func.count()).select_from(query.subquery())).scalar_one()
    query = _apply_sort(query, sort)
    tasks = db.execute(query.limit(limit).offset(offset)).scalars().all()
    return Page[TaskOut](
        items=[_task_out(t) for t in tasks],
        total=total,
        limit=limit,
        offset=offset,
    )


def create_task(
    db: Session,
    project_id: int,
    body: TaskCreate,
) -> TaskOut:
    _validate_assignee(db, project_id, body.assignee_id)
    if body.title.strip == "":
        _error_response(
            409,
            "Fill the title",
            details={"field": "title", "message": "This task does not contain a title"},
        )

    task = Task(
        project_id=project_id,
        title=body.title,
        description=body.description,
        status=body.status,
        priority=body.priority,
        assignee_id=body.assignee_id,
        due_date=body.due_date,
        version=1,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return _task_out(task)


@router.get("/projects/{project_id}/tasks", response_model=Page[TaskOut])
def get_project_tasks(
    project_id: int,
    status: TaskStatus | None = None,
    priority: TaskPriority | None = None,
    assignee_id: int | None = Query(None, alias="assigneeId"),
    sort: str = "id",
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    me: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    _require_project_member(db, me, project_id)
    return list_project_tasks(
        db,
        project_id,
        status=status,
        priority=priority,
        assignee_id=assignee_id,
        sort=sort,
        limit=limit,
        offset=offset,
    )


@router.post("/projects/{project_id}/tasks", response_model=TaskOut, status_code=201)
def create_project_task(
    project_id: int,
    body: TaskCreate,
    me: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    _require_project_member(db, me, project_id)
    return create_task(db, project_id, body)


@router.get("/me/tasks", response_model=Page[TaskOut])
def get_me_tasks(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    me: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    query = select(Task).where(Task.assignee_id == me.id, Task.status != TaskStatus.DONE)
    total = db.execute(select(func.count()).select_from(query.subquery())).scalar_one()
    tasks = (
        db.execute(
            query.order_by(Task.due_date.asc().nulls_last(), Task.id.asc())
            .limit(limit)
            .offset(offset)
        )
        .scalars()
        .all()
    )
    return Page[TaskOut](
        items=[_task_out(t) for t in tasks],
        total=total,
        limit=limit,
        offset=offset,
    )


@router.get("/tasks/{task_id}", response_model=TaskOut)
def get_task(
    task_id: int,
    me: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    return _task_out(_require_visible_task(db, me, task_id))


@router.patch("/tasks/{task_id}", response_model=TaskOut)
def update_task(
    task_id: int,
    body: TaskUpdate,
    me: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    task = _require_visible_task(db, me, task_id)
    if body.version != task.version:
        _error_response(409, "Version does not match")

    changes = body.model_dump(exclude_unset=True)
    changes.pop("version", None)
    if not changes:
        _error_response(422, "Nothing to update")

    if "assignee_id" in changes:
        _validate_assignee(db, task.project_id, changes["assignee_id"])

    for field, value in changes.items():
        setattr(task, field, value)
    task.version += 1
    db.commit()
    db.refresh(task)
    return _task_out(task)


@router.delete("/tasks/{task_id}", status_code=204)
def delete_task(
    task_id: int,
    me: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    task = _require_visible_task(db, me, task_id)
    _require_project_admin(db, me, task.project_id)
    db.delete(task)
    db.commit()
    return Response(status_code=204)
