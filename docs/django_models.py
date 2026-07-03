"""
Django models for the entire platform:
  - Auth / Users / Roles
  - Admin Labs, Sprints, Tasks (Lab authoring side)
  - Collaboration Hub (Sprints, Tickets, PRs, Chat, Forum, Teams, Squads)
  - Individual & Team Reports

Single-file schema reference. Split into multiple apps/files in a real project.

Conventions:
  - UUID primary keys everywhere.
  - `created_at` / `updated_at` on most rows.
  - TextChoices for enums (mirrors the TypeScript union types).
  - Foreign keys use related_name to enable reverse lookups.

Requires: Django >= 4.2
"""

from __future__ import annotations

import uuid
from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


# ============================================================
# 1. BASE
# ============================================================

class TimeStamped(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


# ============================================================
# 2. USERS, ROLES, PROFILE
# ============================================================

class AppRole(models.TextChoices):
    ADMIN = "admin", "Admin"
    MODERATOR = "moderator", "Moderator"
    USER = "user", "User"


class RoleKey(models.TextChoices):
    BACKEND = "Backend", "Backend"
    FRONTEND = "Frontend", "Frontend"
    QA = "QA", "QA"
    DEVOPS = "DevOps", "DevOps"
    SQL = "SQL", "SQL"
    MOBILE = "Mobile", "Mobile"


class User(AbstractUser):
    """Auth user. Use settings.AUTH_USER_MODEL = 'core.User'."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    display_name = models.CharField(max_length=120, blank=True)
    avatar_initials = models.CharField(max_length=4, blank=True)
    title = models.CharField(max_length=64, default="Apprentice")
    level = models.PositiveIntegerField(default=1)
    points = models.PositiveIntegerField(default=0)
    sprints_completed = models.PositiveIntegerField(default=0)
    online = models.BooleanField(default=False)
    is_ai = models.BooleanField(default=False)


class UserRoleAssignment(TimeStamped):
    """App-level role. Stored separately to prevent privilege escalation."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="role_assignments")
    role = models.CharField(max_length=16, choices=AppRole.choices)

    class Meta:
        unique_together = ("user", "role")


class UserSkillRole(TimeStamped):
    """A skill role the user can be assigned in a sprint (Backend, QA…)."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="skill_roles")
    role = models.CharField(max_length=16, choices=RoleKey.choices)

    class Meta:
        unique_together = ("user", "role")


# ============================================================
# 3. ADMIN LABS (Authoring side)
# ============================================================

class ProgrammingLanguage(models.TextChoices):
    C = "c", "C"
    CPP = "cpp", "C++"
    PYTHON = "python", "Python"
    JAVA = "java", "Java"
    SQL = "sql", "SQL"
    BASH = "bash", "Bash"
    JAVASCRIPT = "javascript", "JavaScript"
    TYPESCRIPT = "typescript", "TypeScript"


class Difficulty(models.TextChoices):
    EASY = "easy", "Easy"
    MEDIUM = "medium", "Medium"
    HARD = "hard", "Hard"


class LabType(models.TextChoices):
    DATABASE = "database", "Database"
    BACKEND = "backend", "Backend"
    FRONTEND = "frontend", "Frontend"
    FULL_STACK = "full_stack", "Full Stack"
    QA = "qa", "Quality Assurance"
    DEVOPS = "devops", "DevOps"
    AI = "ai", "AI"


class TaskProgressStatus(models.TextChoices):
    BACKLOG = "backlog", "Backlog"
    IN_PROGRESS = "in_progress", "In Progress"
    IN_REVIEW = "in_review", "In Review"
    DONE = "done", "Done"


class Lab(TimeStamped):
    title = models.CharField(max_length=200)
    type = models.CharField(max_length=16, choices=LabType.choices)
    description = models.TextField(blank=True)
    prerequisites = models.JSONField(default=list, help_text="List of prerequisite skills/labs")
    skills = models.JSONField(default=list, help_text="List of skills taught")
    git_repo_starter_url = models.URLField(blank=True)
    difficulty = models.CharField(max_length=8, choices=Difficulty.choices, default=Difficulty.EASY)
    is_active = models.BooleanField(default=True)
    icon = models.CharField(max_length=64, blank=True)


class UserLabEnrollment(TimeStamped):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="lab_enrollments")
    lab = models.ForeignKey(Lab, on_delete=models.CASCADE, related_name="enrollments")

    class Meta:
        unique_together = ("user", "lab")


class LabSprint(TimeStamped):
    lab = models.ForeignKey(Lab, on_delete=models.CASCADE, related_name="sprints")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    order_index = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order_index"]


class LabTicket(TimeStamped):
    sprint = models.ForeignKey(LabSprint, on_delete=models.CASCADE, related_name="tickets")
    code = models.CharField(max_length=32, help_text="e.g. PY-101")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    learning_objectives = models.JSONField(default=list)
    tasks = models.JSONField(default=list)
    common_mistakes = models.TextField(blank=True)
    hints = models.JSONField(default=list)
    solution = models.TextField(blank=True)
    difficulty = models.CharField(max_length=8, choices=Difficulty.choices, default=Difficulty.EASY)
    yuvro_points = models.PositiveIntegerField(default=10)
    estimated_minutes = models.PositiveIntegerField(default=15)
    programming_language = models.CharField(max_length=16, choices=ProgrammingLanguage.choices)
    order_index = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order_index"]


# ============================================================
# 4. STUDENT PROGRESS (per user against authored labs)
# ============================================================

class UserLabTicketSubmission(TimeStamped):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="ticket_submissions")
    lab_ticket = models.ForeignKey(LabTicket, on_delete=models.CASCADE, related_name="submissions")
    status = models.CharField(max_length=16, choices=TaskProgressStatus.choices, default=TaskProgressStatus.BACKLOG)
    solution = models.TextField(blank=True)
    solution_output = models.TextField(
        blank=True,
        help_text="Output from the last validation run (stdout/stderr, test results)",
    )
    feedback = models.TextField(
        blank=True,
        help_text="Manual feedback from an instructor or system hints",
    )
    yuvro_points = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ("user", "lab_ticket")



# ============================================================
# 5. COLLABORATION HUB
# ============================================================

class Domain(models.TextChoices):
    FINANCE = "Finance", "Finance"
    HEALTHCARE = "Healthcare", "Healthcare"
    ECOMMERCE = "E-Commerce", "E-Commerce"
    EDUCATION = "Education", "Education"
    LOGISTICS = "Logistics", "Logistics"
    AI_ML = "AI & ML", "AI & ML"


class SprintStatus(models.TextChoices):
    OPEN = "Open", "Open"
    IN_PROGRESS = "In Progress", "In Progress"
    COMPLETED = "Completed", "Completed"


class TicketStatus(models.TextChoices):
    NOT_STARTED = "Not Started", "Not Started"
    IN_PROGRESS = "In Progress", "In Progress"
    COMPLETED = "Completed", "Completed"


class PRStatus(models.TextChoices):
    PENDING = "Pending Review", "Pending Review"
    CHANGES = "Changes Requested", "Changes Requested"
    APPROVED = "Approved", "Approved"
    MERGED = "Merged", "Merged"


class MemberStatus(models.TextChoices):
    JOINED = "joined", "Joined"
    AI = "ai", "AI"
    OPEN = "open", "Open"
    INACTIVE = "inactive", "Inactive"
    REMOVED = "removed", "Removed"


class CollabSprint(TimeStamped):
    title = models.CharField(max_length=200)
    domain = models.CharField(max_length=24, choices=Domain.choices)
    description = models.TextField(blank=True)
    duration_days = models.PositiveIntegerField(default=7)
    status = models.CharField(max_length=16, choices=SprintStatus.choices, default=SprintStatus.OPEN)
    required_roles = models.JSONField(default=list)         # list[RoleKey]
    objectives = models.JSONField(default=list)             # list[str]
    dependencies = models.JSONField(default=list)           # [{role, dependsOn, unlocks}]
    ai_auto_fill = models.BooleanField(default=False)
    started_at = models.DateTimeField(null=True, blank=True)
    deadline_at = models.DateTimeField(null=True, blank=True)
    submitted_at = models.DateTimeField(null=True, blank=True)


class CollabSprintMember(TimeStamped):
    sprint = models.ForeignKey(CollabSprint, on_delete=models.CASCADE, related_name="members")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="sprint_memberships")
    role = models.CharField(max_length=16, choices=RoleKey.choices)
    status = models.CharField(max_length=16, choices=MemberStatus.choices, default=MemberStatus.OPEN)

    class Meta:
        unique_together = ("sprint", "role", "user")


class CollabTicket(TimeStamped):
    sprint = models.ForeignKey(CollabSprint, on_delete=models.CASCADE, related_name="tickets")
    code = models.CharField(max_length=32)  # e.g. S01, B01
    title = models.CharField(max_length=200)
    role = models.CharField(max_length=16, choices=RoleKey.choices)
    difficulty = models.CharField(max_length=8, choices=Difficulty.choices)
    points = models.PositiveIntegerField(default=10)
    status = models.CharField(max_length=16, choices=TicketStatus.choices, default=TicketStatus.NOT_STARTED)
    depends_on = models.ForeignKey("self", on_delete=models.SET_NULL, null=True, blank=True, related_name="dependents")
    description = models.TextField(blank=True)
    acceptance = models.JSONField(default=list)
    refs = models.JSONField(default=list)       # [{label, url}]
    starter = models.TextField(blank=True)
    language = models.CharField(max_length=16, choices=ProgrammingLanguage.choices)

    assignee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="tickets")


class CollabTicketTest(TimeStamped):
    ticket = models.ForeignKey(CollabTicket, on_delete=models.CASCADE, related_name="tests")
    name = models.CharField(max_length=120)
    input = models.TextField(blank=True)
    expected = models.TextField(blank=True)


class CollabCommit(TimeStamped):
    ticket = models.ForeignKey(CollabTicket, on_delete=models.CASCADE, related_name="commits")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="commits")
    message = models.CharField(max_length=300)
    at = models.DateTimeField(default=timezone.now)


class PullRequest(TimeStamped):
    ticket = models.OneToOneField(CollabTicket, on_delete=models.CASCADE, related_name="pull_request")
    sprint = models.ForeignKey(CollabSprint, on_delete=models.CASCADE, related_name="prs")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="prs")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=PRStatus.choices, default=PRStatus.PENDING)
    diff = models.JSONField(default=list)           # [{type, text, line}]
    overall_feedback = models.TextField(blank=True)
    raised_at = models.DateTimeField(default=timezone.now)


class PRComment(TimeStamped):
    pr = models.ForeignKey(PullRequest, on_delete=models.CASCADE, related_name="comments")
    parent = models.ForeignKey("self", on_delete=models.CASCADE, null=True, blank=True, related_name="replies")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="pr_comments")
    line = models.PositiveIntegerField(default=0)
    text = models.TextField()


# ---------- chat / forum ----------

class ChatMessage(TimeStamped):
    sprint = models.ForeignKey(CollabSprint, on_delete=models.CASCADE, related_name="chat_messages")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="chat_messages")
    text = models.TextField()
    is_ai = models.BooleanField(default=False)
    at = models.DateTimeField(default=timezone.now)


class ForumTag(models.TextChoices):
    QUESTION = "Question", "Question"
    DISCUSSION = "Discussion", "Discussion"
    HELP = "Help", "Help"
    TIP = "Tip", "Tip"


class ForumThread(TimeStamped):
    sprint = models.ForeignKey(CollabSprint, on_delete=models.SET_NULL, null=True, blank=True, related_name="forum_threads")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="forum_threads")
    title = models.CharField(max_length=200)
    body = models.TextField(blank=True)
    tag = models.CharField(max_length=16, choices=ForumTag.choices, default=ForumTag.DISCUSSION)
    upvotes = models.PositiveIntegerField(default=0)


class ForumReply(TimeStamped):
    thread = models.ForeignKey(ForumThread, on_delete=models.CASCADE, related_name="replies")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="forum_replies")
    text = models.TextField()
    upvotes = models.PositiveIntegerField(default=0)


# ---------- teams / squads ----------

class TeamStatus(models.TextChoices):
    RECRUITING = "Recruiting", "Recruiting"
    FULL = "Full", "Full"
    ACTIVE = "Active", "Active"


class Team(TimeStamped):
    sprint = models.ForeignKey(CollabSprint, on_delete=models.CASCADE, related_name="teams")
    name = models.CharField(max_length=120)
    status = models.CharField(max_length=16, choices=TeamStatus.choices, default=TeamStatus.RECRUITING)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="owned_teams")
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="teams", blank=True)


class TeamInviteStatus(models.TextChoices):
    PENDING = "pending", "Pending"
    ACCEPTED = "accepted", "Accepted"
    DECLINED = "declined", "Declined"


class TeamInvite(TimeStamped):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="invites")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="team_invites")
    role = models.CharField(max_length=16, choices=RoleKey.choices)
    status = models.CharField(max_length=12, choices=TeamInviteStatus.choices, default=TeamInviteStatus.PENDING)


class TeamOpenRole(TimeStamped):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="open_roles")
    role = models.CharField(max_length=16, choices=RoleKey.choices)
    note = models.CharField(max_length=240, blank=True)


class SquadVisibility(models.TextChoices):
    PUBLIC = "Public", "Public"
    INVITE = "Invite Only", "Invite Only"


class Squad(TimeStamped):
    name = models.CharField(max_length=120)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="owned_squads")
    visibility = models.CharField(max_length=16, choices=SquadVisibility.choices, default=SquadVisibility.PUBLIC)
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="squads", blank=True)
    pending = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="pending_squads", blank=True)


# ---------- notifications ----------

class NotificationType(models.TextChoices):
    SPRINT_INVITE = "sprint-invite", "Sprint invite"
    ROLE_REQUEST = "role-request", "Role request"
    SPRINT_STARTED = "sprint-started", "Sprint started"
    DEP_RESOLVED = "dep-resolved", "Dependency resolved"
    PR_REVIEW = "pr-review", "PR review"
    PR_APPROVED = "pr-approved", "PR approved"
    PR_CHANGES = "pr-changes", "PR changes requested"
    INACTIVITY = "inactivity", "Inactivity"
    REMOVED = "removed", "Removed"
    SPRINT_SUBMITTED = "sprint-submitted", "Sprint submitted"
    REPORT_READY = "report-ready", "Report ready"
    CONNECTION = "connection", "Connection"
    SQUAD_INVITE = "squad-invite", "Squad invite"
    LEVEL = "level", "Level up"


class Notification(TimeStamped):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications")
    type = models.CharField(max_length=24, choices=NotificationType.choices)
    message = models.CharField(max_length=300)
    link = models.CharField(max_length=300, blank=True)
    read = models.BooleanField(default=False)
    at = models.DateTimeField(default=timezone.now)


# ============================================================
# 6. REPORTS (Individual + Team)
# ============================================================

class IndividualReport(TimeStamped):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="individual_reports")
    sprint = models.ForeignKey(CollabSprint, on_delete=models.CASCADE, related_name="individual_reports")
    role = models.CharField(max_length=16, choices=RoleKey.choices)

    # high-level numbers
    total_points = models.PositiveIntegerField(default=0)
    tickets_completed = models.PositiveIntegerField(default=0)
    prs_merged = models.PositiveIntegerField(default=0)
    review_score = models.FloatField(default=0.0)        # 0..5
    collaboration_score = models.FloatField(default=0.0)
    on_time = models.BooleanField(default=True)

    summary_md = models.TextField(blank=True)

    class Meta:
        unique_together = ("user", "sprint")


class IndividualMetric(TimeStamped):
    """Granular metric rows backing the report's charts/bars."""
    report = models.ForeignKey(IndividualReport, on_delete=models.CASCADE, related_name="metrics")
    label = models.CharField(max_length=120)            # e.g. "Code quality"
    value = models.FloatField(default=0)
    max_value = models.FloatField(default=100)
    category = models.CharField(max_length=40, blank=True)  # "points" / "skill" / "behavior"


class TeamReport(TimeStamped):
    sprint = models.OneToOneField(CollabSprint, on_delete=models.CASCADE, related_name="team_report")
    velocity = models.FloatField(default=0)
    cohesion_score = models.FloatField(default=0)
    blockers_resolved = models.PositiveIntegerField(default=0)
    summary_md = models.TextField(blank=True)


class TeamContribution(TimeStamped):
    report = models.ForeignKey(TeamReport, on_delete=models.CASCADE, related_name="contributions")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="team_contributions")
    role = models.CharField(max_length=16, choices=RoleKey.choices)
    points = models.PositiveIntegerField(default=0)
    tickets = models.PositiveIntegerField(default=0)
    reviews_given = models.PositiveIntegerField(default=0)


class TeamDependencyEdge(TimeStamped):
    """Captures who unblocked whom — used in the team report graph."""
    report = models.ForeignKey(TeamReport, on_delete=models.CASCADE, related_name="dependencies")
    from_role = models.CharField(max_length=16, choices=RoleKey.choices)
    to_role = models.CharField(max_length=16, choices=RoleKey.choices)
    unlocks = models.CharField(max_length=200, blank=True)
