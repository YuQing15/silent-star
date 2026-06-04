"""
Silent Star — FastAPI Backend
Main application entry point
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
import logging

from app.core.config import settings
from app.core.database import init_db
from app.middleware.rate_limit import RateLimitMiddleware
from app.middleware.auth import AuthMiddleware
from app.routers import (
    auth,
    users,
    novels,
    chapters,
    comments,
    ratings,
    bookmarks,
    reading,
    notifications,
    recommendations,
    search,
    admin,
    translations,
    memberships,
)

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    logger.info("🚀 Silent Star API starting up...")
    await init_db()
    yield
    logger.info("👋 Silent Star API shutting down...")


app = FastAPI(
    title="Silent Star API",
    description="Next-generation web novel translation platform",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs" if settings.DEBUG else None,
    redoc_url="/api/redoc" if settings.DEBUG else None,
)

# ---- Middleware ----

app.add_middleware(GZipMiddleware, minimum_size=1000)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(RateLimitMiddleware)
app.add_middleware(AuthMiddleware)

# ---- Routers ----

API_PREFIX = "/api/v1"

app.include_router(auth.router,            prefix=f"{API_PREFIX}/auth",            tags=["Auth"])
app.include_router(users.router,           prefix=f"{API_PREFIX}/users",           tags=["Users"])
app.include_router(novels.router,          prefix=f"{API_PREFIX}/novels",          tags=["Novels"])
app.include_router(chapters.router,        prefix=f"{API_PREFIX}/chapters",        tags=["Chapters"])
app.include_router(comments.router,        prefix=f"{API_PREFIX}/comments",        tags=["Comments"])
app.include_router(ratings.router,         prefix=f"{API_PREFIX}/ratings",         tags=["Ratings"])
app.include_router(bookmarks.router,       prefix=f"{API_PREFIX}/bookmarks",       tags=["Bookmarks"])
app.include_router(reading.router,         prefix=f"{API_PREFIX}/reading",         tags=["Reading"])
app.include_router(notifications.router,   prefix=f"{API_PREFIX}/notifications",   tags=["Notifications"])
app.include_router(recommendations.router, prefix=f"{API_PREFIX}/recommendations", tags=["Recommendations"])
app.include_router(search.router,          prefix=f"{API_PREFIX}/search",          tags=["Search"])
app.include_router(admin.router,           prefix=f"{API_PREFIX}/admin",           tags=["Admin"])
app.include_router(translations.router,    prefix=f"{API_PREFIX}/translations",    tags=["Translations"])
app.include_router(memberships.router,     prefix=f"{API_PREFIX}/memberships",     tags=["Memberships"])


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "version": "1.0.0"}
