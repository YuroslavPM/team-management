from datetime import UTC, date, datetime
from enum import StrEnum
from typing import Annotated, Any, Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, PlainSerializer, field_validator
from pydantic.alias_generators import to_camel

from app.models import TaskPriority, TaskStatus

UserRole = Literal["admin", "member"]
TeamRole = Literal["lead", "member"]
ProjectRole = Literal["admin", "member"]


def _iso_utc(value: datetime) -> str:
    if value.tzinfo is None:  # SQLite drops the timezone; everything is stored as UTC
        value = value.replace(tzinfo=UTC)
    return value.astimezone(UTC).isoformat().replace("+00:00", "Z")


Timestamp = Annotated[datetime, PlainSerializer(_iso_utc, return_type=str)]


class ApiModel(BaseModel):
    """camelCase on the wire, snake_case in Python."""

    model_config = ConfigDict(
        alias_generator=to_camel, populate_by_name=True, from_attributes=True, extra="forbid"
    )


class Page[T](ApiModel):
    items: list[T]
    total: int
    limit: int
    offset: int


# --- auth -------------------------------------------------------------------


class LoginIn(ApiModel):
    email: EmailStr
    password: str


class UserOut(ApiModel):
    id: int
    email: str
    first_name: str
    last_name: str
    display_name: str
    role: UserRole
    created_at: Timestamp
    updated_at: Timestamp


class LoginOut(ApiModel):
    token: str
    user: UserOut


# --- users ------------------------------------------------------------------


class UserCreate(ApiModel):
    email: EmailStr
    first_name: str = Field(min_length=1, max_length=80)
    last_name: str = Field(min_length=1, max_length=80)
    display_name: str | None = Field(default=None, max_length=160)
    password: str = Field(min_length=8)
    role: UserRole = "member"


class UserUpdate(ApiModel):
    first_name: str | None = Field(default=None, min_length=1, max_length=80)
    last_name: str | None = Field(default=None, min_length=1, max_length=80)
    display_name: str | None = Field(default=None, min_length=1, max_length=160)
    role: UserRole | None = None


# --- teams ------------------------------------------------------------------


class TeamMemberOut(ApiModel):
    user_id: int
    display_name: str
    role: TeamRole


class TeamOut(ApiModel):
    id: int
    name: str
    description: str
    members: list[TeamMemberOut]
    created_at: Timestamp
    updated_at: Timestamp


class TeamCreate(ApiModel):
    name: str = Field(min_length=1, max_length=120)
    description: str = Field(default="", max_length=2000)


class TeamUpdate(ApiModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    description: str | None = Field(default=None, max_length=2000)


class TeamMemberIn(ApiModel):
    user_id: int
    role: TeamRole = "member"


# --- projects ------------------------------------------------------------------


class ProjectStatus(StrEnum):
    PLANNED = "planned"
    ACTIVE = "active"
    ON_HOLD = "on_hold"
    DONE = "done"


class ProjectMemberOut(ApiModel):
    user_id: int
    display_name: str
    role: ProjectRole


class ProjectOut(ApiModel):
    id: int
    name: str
    description: str
    status: ProjectStatus
    team_ids: list[int]
    members: list[ProjectMemberOut]
    created_at: Timestamp
    updated_at: Timestamp


class ProjectCreate(ApiModel):
    name: str = Field(min_length=1, max_length=120)
    description: str = Field(default="", max_length=5000)
    status: ProjectStatus = ProjectStatus.PLANNED
    team_ids: list[int] = Field(default_factory=list)


class ProjectUpdate(ApiModel):
    name: str = Field(default="", min_length=1, max_length=120)
    description: str = Field(default="", max_length=5000)
    status: ProjectStatus | None = None
    team_ids: list[int] | None = None


class ProjectMemberIn(ApiModel):
    user_id: int
    role: ProjectRole = "member"


# --- tasks ------------------------------------------------------------------


def _empty_due_date(value: Any) -> date | None:
    if value is None or value == "":
        return None
    return value


class TaskCreate(ApiModel):
    title: str = Field(min_length=1, max_length=120)
    description: str = Field(default="", max_length=1000)
    status: TaskStatus = TaskStatus.TODO
    priority: TaskPriority = TaskPriority.MEDIUM
    assignee_id: int | None = None
    due_date: date | None = None

    @field_validator("due_date", mode="before")
    @classmethod
    def due_date_optional(cls, value: Any) -> date | None:
        return _empty_due_date(value)


class TaskUpdate(ApiModel):
    title: str | None = Field(default=None, min_length=1, max_length=120)
    description: str | None = Field(default=None, max_length=1000)
    status: TaskStatus | None = None
    priority: TaskPriority | None = None
    assignee_id: int | None = None
    due_date: date | None = None

    @field_validator("due_date", mode="before")
    @classmethod
    def due_date_optional(cls, value: Any) -> date | None:
        return _empty_due_date(value)


class TaskOut(ApiModel):
    id: int
    project_id: int
    title: str
    description: str
    status: TaskStatus
    priority: TaskPriority
    assignee_id: int | None
    due_date: Annotated[
        date | None,
        PlainSerializer(lambda d: d.isoformat() if d else "", return_type=str),
    ]
    version: int
    created_at: Timestamp
    updated_at: Timestamp
