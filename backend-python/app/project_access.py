from sqlalchemy import select
from sqlalchemy.orm import Session

from app.errors import ApiError
from app.models import Project, ProjectMember, User


def get_visible_project(db: Session, me: User, project_id: int) -> Project | None:
    project = db.get(Project, project_id)
    if project is None:
        return None
    if me.role == "admin":
        return project
    membership = db.execute(
        select(ProjectMember.id).where(
            ProjectMember.project_id == project_id,
            ProjectMember.user_id == me.id,
        )
    ).first()
    if membership is None:
        return None
    return project


def require_project_admin(db: Session, me: User, project_id: int) -> Project:
    project = get_visible_project(db, me, project_id)
    if project is None:
        raise ApiError(404, "Project not found")
    if me.role == "admin":
        return project
    role = db.execute(
        select(ProjectMember.role).where(
            ProjectMember.project_id == project_id,
            ProjectMember.user_id == me.id,
        )
    ).scalar_one_or_none()
    if role != "admin":
        raise ApiError(403, "Project admin required")
    return project
