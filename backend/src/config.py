"""Application configuration management."""
import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings:
    """Application settings loaded from environment variables."""

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://user:pass@localhost/dbname"
    )

    # Authentication
    JWT_SECRET: str = os.getenv(
        "JWT_SECRET",
        "change-this-jwt-secret-in-production"
    )
    BETTER_AUTH_SECRET: str = os.getenv(
        "BETTER_AUTH_SECRET",
        "change-this-secret-in-production"
    )

    # CORS
    ALLOWED_ORIGINS: str = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:3000"
    )

    # Application
    PORT: int = int(os.getenv("PORT", "8001"))
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"

    # Phase III AI Configuration
    OPENAI_API_KEY: str = os.getenv(
        "OPENAI_API_KEY",
        ""
    )
    OPENAI_MODEL: str = os.getenv(
        "OPENAI_MODEL",
        "gpt-4o-mini"
    )

    # Phase V: Event-Driven Architecture
    PHASE5_ENABLED: bool = os.getenv("PHASE5_ENABLED", "false").lower() == "true"
    DAPR_HTTP_PORT: int = int(os.getenv("DAPR_HTTP_PORT", "3500"))

    @property
    def allowed_origins_list(self) -> list[str]:
        """Parse ALLOWED_ORIGINS into a list."""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]


settings = Settings()
