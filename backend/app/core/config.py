"""
Luminary — Application Configuration
"""

from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Luminary"
    DEBUG: bool = os.getenv("NODE_ENV") != "production"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "changeme-in-production")

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/luminary")

    # Supabase
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
    SUPABASE_SERVICE_KEY: str = os.getenv("SUPABASE_SERVICE_KEY", "")
    SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET", "")

    # OpenAI / Translation
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    TRANSLATION_MODEL: str = "gpt-4o"

    # Storage
    STORAGE_BUCKET: str = "luminary-assets"
    CDN_URL: str = os.getenv("CDN_URL", "")

    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "https://luminary.app",
        os.getenv("FRONTEND_URL", ""),
    ]

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_AUTH_PER_MINUTE: int = 10

    # Pagination
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100

    # Reading
    CHAPTER_PRELOAD_COUNT: int = 2

    # Membership Pricing (USD)
    PRICE_SUPPORTER: float = 4.99
    PRICE_PREMIUM: float = 9.99
    PRICE_ELITE: float = 19.99

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
