"""merge heads

Revision ID: 1cc8c2b39444
Revises: 4a6dbfd3c30a, 93567b0ca727
Create Date: 2026-06-24 07:49:59.721375

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1cc8c2b39444'
down_revision: Union[str, Sequence[str], None] = ('4a6dbfd3c30a', '93567b0ca727')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
