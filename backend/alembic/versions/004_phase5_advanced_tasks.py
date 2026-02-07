"""Phase 5: Add priority, due_date, recurrence, tags to tasks and activity_logs table

Revision ID: 004_phase5
Revises: 003
Create Date: 2025-01-01 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSON

# revision identifiers
revision = '004_phase5'
down_revision = '003'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add Phase 5 columns to tasks table
    op.add_column('tasks', sa.Column('priority', sa.String(10), nullable=False, server_default='medium'))
    op.add_column('tasks', sa.Column('due_date', sa.DateTime(), nullable=True))
    op.add_column('tasks', sa.Column('recurrence_pattern', sa.String(10), nullable=False, server_default='none'))
    op.add_column('tasks', sa.Column('tags', JSON, nullable=True))

    # Create activity_logs table
    op.create_table(
        'activity_logs',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Uuid(), nullable=False),
        sa.Column('task_id', sa.Integer(), nullable=True),
        sa.Column('action', sa.String(50), nullable=False),
        sa.Column('details', sa.String(1000), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
    )
    op.create_index('ix_activity_logs_user_id', 'activity_logs', ['user_id'])
    op.create_index('ix_activity_logs_task_id', 'activity_logs', ['task_id'])


def downgrade() -> None:
    op.drop_index('ix_activity_logs_task_id', 'activity_logs')
    op.drop_index('ix_activity_logs_user_id', 'activity_logs')
    op.drop_table('activity_logs')
    op.drop_column('tasks', 'tags')
    op.drop_column('tasks', 'recurrence_pattern')
    op.drop_column('tasks', 'due_date')
    op.drop_column('tasks', 'priority')
