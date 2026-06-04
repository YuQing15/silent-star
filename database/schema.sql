-- ============================================================
-- LUMINARY — Web Novel Platform Database Schema
-- PostgreSQL + Prisma compatible
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('reader', 'translator', 'moderator', 'admin');
CREATE TYPE novel_status AS ENUM ('ongoing', 'completed', 'hiatus', 'dropped');
CREATE TYPE novel_origin AS ENUM ('chinese', 'korean', 'japanese');
CREATE TYPE chapter_status AS ENUM ('draft', 'scheduled', 'published', 'locked');
CREATE TYPE membership_tier AS ENUM ('free', 'supporter', 'premium', 'elite');
CREATE TYPE notification_type AS ENUM ('new_chapter', 'comment_reply', 'system', 'achievement', 'streak');
CREATE TYPE mood_tag AS ENUM (
  'action', 'romance', 'mystery', 'comedy', 'tragedy',
  'heartwarming', 'thrilling', 'melancholic', 'epic', 'cozy'
);
CREATE TYPE reading_theme AS ENUM ('default', 'sepia', 'night', 'forest', 'ocean', 'paper');

-- ============================================================
-- USERS
-- ============================================================

CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supabase_id     TEXT UNIQUE NOT NULL,
  username        VARCHAR(40) UNIQUE NOT NULL,
  display_name    VARCHAR(80),
  email           TEXT UNIQUE NOT NULL,
  avatar_url      TEXT,
  bio             TEXT,
  role            user_role NOT NULL DEFAULT 'reader',
  membership_tier membership_tier NOT NULL DEFAULT 'free',
  membership_expires_at TIMESTAMPTZ,
  reading_streak  INTEGER NOT NULL DEFAULT 0,
  streak_last_date DATE,
  longest_streak  INTEGER NOT NULL DEFAULT 0,
  total_chapters_read INTEGER NOT NULL DEFAULT 0,
  total_reading_minutes INTEGER NOT NULL DEFAULT 0,
  xp_points       INTEGER NOT NULL DEFAULT 0,
  level           INTEGER NOT NULL DEFAULT 1,
  preferred_theme reading_theme NOT NULL DEFAULT 'default',
  preferred_font_size INTEGER NOT NULL DEFAULT 18,
  preferred_line_height NUMERIC(3,1) NOT NULL DEFAULT 1.8,
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  is_banned       BOOLEAN NOT NULL DEFAULT false,
  last_seen_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_supabase_id ON users(supabase_id);
CREATE INDEX idx_users_membership ON users(membership_tier);

-- ============================================================
-- NOVELS
-- ============================================================

CREATE TABLE novels (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  original_title  TEXT,
  synopsis        TEXT NOT NULL,
  cover_url       TEXT,
  banner_url      TEXT,
  author_name     TEXT NOT NULL,
  translator_id   UUID REFERENCES users(id) ON DELETE SET NULL,
  status          novel_status NOT NULL DEFAULT 'ongoing',
  origin          novel_origin NOT NULL,
  total_chapters  INTEGER NOT NULL DEFAULT 0,
  published_chapters INTEGER NOT NULL DEFAULT 0,
  average_rating  NUMERIC(3,2) NOT NULL DEFAULT 0,
  total_ratings   INTEGER NOT NULL DEFAULT 0,
  total_views     BIGINT NOT NULL DEFAULT 0,
  weekly_views    INTEGER NOT NULL DEFAULT 0,
  monthly_views   INTEGER NOT NULL DEFAULT 0,
  total_bookmarks INTEGER NOT NULL DEFAULT 0,
  word_count_avg  INTEGER NOT NULL DEFAULT 2000,
  ambient_theme   TEXT NOT NULL DEFAULT 'default',  -- dynamic background theme
  primary_mood    mood_tag,
  content_warning TEXT,
  is_premium      BOOLEAN NOT NULL DEFAULT false,
  is_featured     BOOLEAN NOT NULL DEFAULT false,
  is_trending     BOOLEAN NOT NULL DEFAULT false,
  published_at    TIMESTAMPTZ,
  last_chapter_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_novels_slug ON novels(slug);
CREATE INDEX idx_novels_status ON novels(status);
CREATE INDEX idx_novels_trending ON novels(is_trending, weekly_views DESC);
CREATE INDEX idx_novels_rating ON novels(average_rating DESC);
CREATE INDEX idx_novels_search ON novels USING gin(to_tsvector('english', title || ' ' || synopsis));

-- ============================================================
-- TAGS & GENRES
-- ============================================================

CREATE TABLE tags (
  id    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name  VARCHAR(50) UNIQUE NOT NULL,
  slug  VARCHAR(50) UNIQUE NOT NULL,
  color VARCHAR(7),
  is_genre BOOLEAN NOT NULL DEFAULT false,
  usage_count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE novel_tags (
  novel_id UUID REFERENCES novels(id) ON DELETE CASCADE,
  tag_id   UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (novel_id, tag_id)
);

CREATE INDEX idx_novel_tags_novel ON novel_tags(novel_id);
CREATE INDEX idx_novel_tags_tag ON novel_tags(tag_id);

-- ============================================================
-- CHAPTERS
-- ============================================================

CREATE TABLE chapters (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  novel_id        UUID NOT NULL REFERENCES novels(id) ON DELETE CASCADE,
  chapter_number  INTEGER NOT NULL,
  volume_number   INTEGER,
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL,
  content         TEXT,                    -- translated content
  raw_content     TEXT,                    -- original Chinese/Korean
  word_count      INTEGER NOT NULL DEFAULT 0,
  status          chapter_status NOT NULL DEFAULT 'draft',
  is_premium      BOOLEAN NOT NULL DEFAULT false,
  unlock_cost     INTEGER NOT NULL DEFAULT 0,  -- coins required
  translator_note TEXT,
  scheduled_at    TIMESTAMPTZ,
  published_at    TIMESTAMPTZ,
  total_views     INTEGER NOT NULL DEFAULT 0,
  total_comments  INTEGER NOT NULL DEFAULT 0,
  estimated_read_minutes INTEGER NOT NULL DEFAULT 5,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(novel_id, chapter_number)
);

CREATE INDEX idx_chapters_novel ON chapters(novel_id, chapter_number);
CREATE INDEX idx_chapters_status ON chapters(status, published_at);
CREATE INDEX idx_chapters_slug ON chapters(novel_id, slug);

-- ============================================================
-- READING HISTORY & PROGRESS
-- ============================================================

CREATE TABLE reading_history (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  novel_id    UUID NOT NULL REFERENCES novels(id) ON DELETE CASCADE,
  chapter_id  UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  scroll_position NUMERIC(5,2) NOT NULL DEFAULT 0,  -- 0-100 percentage
  completed   BOOLEAN NOT NULL DEFAULT false,
  read_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, chapter_id)
);

CREATE INDEX idx_reading_history_user ON reading_history(user_id, read_at DESC);
CREATE INDEX idx_reading_history_novel ON reading_history(user_id, novel_id);

-- Continue reading (latest chapter per novel per user)
CREATE TABLE reading_progress (
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  novel_id    UUID NOT NULL REFERENCES novels(id) ON DELETE CASCADE,
  chapter_id  UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  scroll_position NUMERIC(5,2) NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, novel_id)
);

CREATE INDEX idx_reading_progress_user ON reading_progress(user_id, updated_at DESC);

-- ============================================================
-- READING SESSIONS (for analytics & streak tracking)
-- ============================================================

CREATE TABLE reading_sessions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  novel_id        UUID REFERENCES novels(id) ON DELETE SET NULL,
  started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at        TIMESTAMPTZ,
  duration_minutes INTEGER NOT NULL DEFAULT 0,
  chapters_read   INTEGER NOT NULL DEFAULT 0,
  words_read      INTEGER NOT NULL DEFAULT 0,
  session_date    DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE INDEX idx_sessions_user ON reading_sessions(user_id, session_date DESC);

-- ============================================================
-- BOOKMARKS & FAVOURITES
-- ============================================================

CREATE TABLE bookmarks (
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  novel_id   UUID NOT NULL REFERENCES novels(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, novel_id)
);

CREATE INDEX idx_bookmarks_user ON bookmarks(user_id, created_at DESC);

-- Chapter-level bookmarks (specific moments)
CREATE TABLE chapter_bookmarks (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chapter_id  UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  note        TEXT,
  position    NUMERIC(5,2),  -- scroll percentage
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- RATINGS & REVIEWS
-- ============================================================

CREATE TABLE ratings (
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  novel_id   UUID NOT NULL REFERENCES novels(id) ON DELETE CASCADE,
  score      SMALLINT NOT NULL CHECK (score BETWEEN 1 AND 10),
  review     TEXT,
  is_spoiler BOOLEAN NOT NULL DEFAULT false,
  helpful_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, novel_id)
);

CREATE INDEX idx_ratings_novel ON ratings(novel_id, score DESC);

-- Emotional reactions on chapters
CREATE TABLE chapter_reactions (
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  mood       mood_tag NOT NULL,
  PRIMARY KEY (user_id, chapter_id)
);

-- ============================================================
-- COMMENTS
-- ============================================================

CREATE TABLE comments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chapter_id  UUID REFERENCES chapters(id) ON DELETE CASCADE,
  novel_id    UUID REFERENCES novels(id) ON DELETE CASCADE,
  parent_id   UUID REFERENCES comments(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  is_spoiler  BOOLEAN NOT NULL DEFAULT false,
  like_count  INTEGER NOT NULL DEFAULT 0,
  reply_count INTEGER NOT NULL DEFAULT 0,
  is_deleted  BOOLEAN NOT NULL DEFAULT false,
  is_pinned   BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_comments_chapter ON comments(chapter_id, created_at DESC);
CREATE INDEX idx_comments_novel ON comments(novel_id, created_at DESC);
CREATE INDEX idx_comments_parent ON comments(parent_id);

CREATE TABLE comment_likes (
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, comment_id)
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type        notification_type NOT NULL,
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  link        TEXT,
  is_read     BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);

-- ============================================================
-- MEMBERSHIPS & COINS
-- ============================================================

CREATE TABLE membership_transactions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier        membership_tier NOT NULL,
  amount_usd  NUMERIC(8,2) NOT NULL,
  stripe_id   TEXT,
  starts_at   TIMESTAMPTZ NOT NULL,
  ends_at     TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE coin_balance (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE coin_transactions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount      INTEGER NOT NULL,  -- positive=credit, negative=debit
  description TEXT NOT NULL,
  chapter_id  UUID REFERENCES chapters(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TRANSLATION MANAGEMENT
-- ============================================================

CREATE TABLE glossaries (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  novel_id    UUID NOT NULL REFERENCES novels(id) ON DELETE CASCADE,
  original    TEXT NOT NULL,
  translation TEXT NOT NULL,
  context     TEXT,
  category    VARCHAR(50),  -- 'character', 'place', 'skill', 'item'
  created_by  UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_glossaries_novel ON glossaries(novel_id);

CREATE TABLE translation_jobs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id  UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  raw_text    TEXT NOT NULL,
  status      VARCHAR(20) NOT NULL DEFAULT 'pending',
  model_used  TEXT,
  tokens_used INTEGER,
  completed_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- RECOMMENDATIONS ENGINE
-- ============================================================

CREATE TABLE recommendation_signals (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  novel_id    UUID NOT NULL REFERENCES novels(id) ON DELETE CASCADE,
  signal_type VARCHAR(30) NOT NULL,  -- 'viewed', 'bookmarked', 'completed', 'rated', 'binge'
  weight      NUMERIC(4,2) NOT NULL DEFAULT 1.0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_signals_user ON recommendation_signals(user_id);
CREATE INDEX idx_signals_novel ON recommendation_signals(novel_id);

CREATE TABLE novel_similarity (
  novel_a     UUID NOT NULL REFERENCES novels(id) ON DELETE CASCADE,
  novel_b     UUID NOT NULL REFERENCES novels(id) ON DELETE CASCADE,
  score       NUMERIC(4,3) NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (novel_a, novel_b)
);

-- ============================================================
-- ACHIEVEMENTS
-- ============================================================

CREATE TABLE achievements (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        VARCHAR(60) UNIQUE NOT NULL,
  name        VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  icon        TEXT,
  xp_reward   INTEGER NOT NULL DEFAULT 0,
  rarity      VARCHAR(20) NOT NULL DEFAULT 'common'  -- common, rare, epic, legendary
);

CREATE TABLE user_achievements (
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id  UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_novels_updated BEFORE UPDATE ON novels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_chapters_updated BEFORE UPDATE ON chapters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-update novel published_chapters count
CREATE OR REPLACE FUNCTION update_novel_chapter_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE novels
  SET published_chapters = (
    SELECT COUNT(*) FROM chapters
    WHERE novel_id = COALESCE(NEW.novel_id, OLD.novel_id)
    AND status = 'published'
  ),
  last_chapter_at = NOW()
  WHERE id = COALESCE(NEW.novel_id, OLD.novel_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_chapter_count
AFTER INSERT OR UPDATE OR DELETE ON chapters
FOR EACH ROW EXECUTE FUNCTION update_novel_chapter_count();

-- Auto-update novel average rating
CREATE OR REPLACE FUNCTION update_novel_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE novels
  SET
    average_rating = (
      SELECT ROUND(AVG(score)::numeric, 2) FROM ratings
      WHERE novel_id = COALESCE(NEW.novel_id, OLD.novel_id)
    ),
    total_ratings = (
      SELECT COUNT(*) FROM ratings
      WHERE novel_id = COALESCE(NEW.novel_id, OLD.novel_id)
    )
  WHERE id = COALESCE(NEW.novel_id, OLD.novel_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_novel_rating
AFTER INSERT OR UPDATE OR DELETE ON ratings
FOR EACH ROW EXECUTE FUNCTION update_novel_rating();
