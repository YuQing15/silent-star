"""
Luminary — Novels Router
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import Optional, List
from uuid import UUID
import math

from app.core.database import get_db
from app.core.auth import get_current_user, get_optional_user
from app.schemas.novel import (
    NovelListResponse,
    NovelDetailResponse,
    NovelCreateRequest,
    NovelUpdateRequest,
    NovelFilters,
)
from app.services.novel_service import NovelService
from app.services.recommendation_service import RecommendationService

router = APIRouter()


@router.get("/", response_model=NovelListResponse)
async def list_novels(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    genre: Optional[str] = None,
    status: Optional[str] = None,
    origin: Optional[str] = None,
    mood: Optional[str] = None,
    sort: str = Query("trending", enum=["trending", "latest", "rating", "views", "updated"]),
    db=Depends(get_db),
    current_user=Depends(get_optional_user),
):
    """List novels with filtering, sorting, and pagination."""
    service = NovelService(db)
    filters = NovelFilters(genre=genre, status=status, origin=origin, mood=mood)
    novels, total = await service.list_novels(
        page=page, limit=limit, filters=filters, sort=sort
    )
    return {
        "novels": novels,
        "total": total,
        "page": page,
        "pages": math.ceil(total / limit),
        "limit": limit,
    }


@router.get("/featured", response_model=List[NovelDetailResponse])
async def get_featured_novels(
    limit: int = Query(6, ge=1, le=12),
    db=Depends(get_db),
):
    """Get featured/hero novels for homepage."""
    service = NovelService(db)
    return await service.get_featured(limit=limit)


@router.get("/trending", response_model=List[NovelDetailResponse])
async def get_trending_novels(
    limit: int = Query(10, ge=1, le=20),
    period: str = Query("week", enum=["day", "week", "month"]),
    db=Depends(get_db),
):
    """Get trending novels by view count."""
    service = NovelService(db)
    return await service.get_trending(limit=limit, period=period)


@router.get("/recently-updated", response_model=List[NovelDetailResponse])
async def get_recently_updated(
    limit: int = Query(12, ge=1, le=24),
    db=Depends(get_db),
):
    """Get recently updated novels."""
    service = NovelService(db)
    return await service.get_recently_updated(limit=limit)


@router.get("/new-releases", response_model=List[NovelDetailResponse])
async def get_new_releases(
    limit: int = Query(8, ge=1, le=16),
    db=Depends(get_db),
):
    service = NovelService(db)
    return await service.get_new_releases(limit=limit)


@router.get("/{slug}", response_model=NovelDetailResponse)
async def get_novel(
    slug: str,
    db=Depends(get_db),
    current_user=Depends(get_optional_user),
):
    """Get novel details by slug."""
    service = NovelService(db)
    novel = await service.get_by_slug(slug, user_id=current_user.id if current_user else None)
    if not novel:
        raise HTTPException(status_code=404, detail="Novel not found")

    # Track view
    await service.increment_view(novel["id"])

    return novel


@router.get("/{slug}/chapters")
async def get_novel_chapters(
    slug: str,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    db=Depends(get_db),
    current_user=Depends(get_optional_user),
):
    """Get paginated chapter list for a novel."""
    service = NovelService(db)
    novel = await service.get_by_slug(slug)
    if not novel:
        raise HTTPException(status_code=404, detail="Novel not found")

    chapters, total = await service.get_chapters(
        novel_id=novel["id"],
        page=page,
        limit=limit,
        user_id=current_user.id if current_user else None,
    )
    return {
        "chapters": chapters,
        "total": total,
        "page": page,
        "pages": math.ceil(total / limit),
    }


@router.get("/{slug}/similar", response_model=List[NovelDetailResponse])
async def get_similar_novels(
    slug: str,
    limit: int = Query(6, ge=1, le=12),
    db=Depends(get_db),
):
    """Get similar novels based on tags and mood."""
    service = NovelService(db)
    novel = await service.get_by_slug(slug)
    if not novel:
        raise HTTPException(status_code=404, detail="Novel not found")
    return await service.get_similar(novel["id"], limit=limit)


@router.post("/", response_model=NovelDetailResponse, status_code=status.HTTP_201_CREATED)
async def create_novel(
    data: NovelCreateRequest,
    db=Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Create a new novel (translator/admin only)."""
    if current_user.role not in ("translator", "moderator", "admin"):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    service = NovelService(db)
    return await service.create(data, creator_id=current_user.id)


@router.patch("/{slug}", response_model=NovelDetailResponse)
async def update_novel(
    slug: str,
    data: NovelUpdateRequest,
    db=Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Update novel details (owner/admin only)."""
    service = NovelService(db)
    novel = await service.get_by_slug(slug)
    if not novel:
        raise HTTPException(status_code=404, detail="Novel not found")

    if current_user.role not in ("moderator", "admin") and novel["translator_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    return await service.update(novel["id"], data)
