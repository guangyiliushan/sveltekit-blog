-- 启用 uuid-ossp 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建 users 表
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    nickname VARCHAR(50) NOT NULL,
    avatar TEXT DEFAULT 'default.svg',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    birthday DATE CHECK (birthday > '1900-01-01'),
    location VARCHAR(100)
) WITH (autovacuum_enabled = true);

-- 在 users 表下方添加 session 表
CREATE TABLE IF NOT EXISTS session (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_agent TEXT,
    ip_address INET
) WITH (autovacuum_enabled = true);

-- 在 session 表下方添加 verification_codes 表
CREATE TABLE IF NOT EXISTS verification_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    verification_code VARCHAR(6) NOT NULL,
    target VARCHAR(255) NOT NULL,
    code_type VARCHAR(10) NOT NULL CHECK (code_type IN ('email', 'sms')),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '5 minutes'),
    is_used BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
) WITH (autovacuum_enabled = true);

-- 创建 posts 表
CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY, 
    title VARCHAR(120) NOT NULL,
    content TEXT NOT NULL,
    published BOOLEAN DEFAULT FALSE,
    views INTEGER DEFAULT 0 CHECK (views >= 0),
    likes INTEGER DEFAULT 0 CHECK (likes >= 0),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(30),
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL
) WITH (autovacuum_enabled = true);

-- 建议新增关联表代替数组字段
CREATE TABLE IF NOT EXISTS user_posts (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, post_id)
);

-- 添加 phone 字段验证
ALTER TABLE users
ADD CONSTRAINT valid_phone 
CHECK (phone ~ '^1[3456789]\d{9}$'); 

-- 添加邮箱格式验证约束
ALTER TABLE users 
ADD CONSTRAINT valid_email 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- 添加软删除标记列
ALTER TABLE users
ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE NOT NULL;

-- 创建 users 表的 email 索引
CREATE UNIQUE INDEX idx_users_email ON users(email) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX idx_users_phone ON users(phone) WHERE phone IS NOT NULL;

-- 添加 session 表索引
CREATE INDEX idx_session_user ON session(user_id);
CREATE INDEX idx_session_expires ON session(expires_at);

-- 添加 session 表注释
COMMENT ON TABLE session IS '用户会话记录表';
COMMENT ON COLUMN session.user_agent IS '用户客户端信息';
COMMENT ON COLUMN session.ip_address IS '登录IP地址';

-- 添加验证码表索引
CREATE INDEX idx_verification_code ON verification_codes(verification_code, target);
CREATE INDEX idx_unused_codes ON verification_codes USING BRIN (created_at) WHERE is_used = FALSE;

-- 添加验证码表注释
COMMENT ON TABLE verification_codes IS '验证码存储表';
COMMENT ON COLUMN verification_codes.target IS '验证目标（邮箱/手机号）';

-- 创建软删除用户的索引
CREATE INDEX idx_users_deleted ON users(is_deleted) WHERE is_deleted = TRUE;

-- 索引优化
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_created ON posts USING BRIN (created_at);

-- 更新时间自动更新
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建更新时间触发器
CREATE TRIGGER update_posts_modtime 
BEFORE UPDATE ON posts 
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 创建历史归档表
CREATE TABLE posts_archive (LIKE posts INCLUDING ALL) PARTITION BY RANGE (created_at);

