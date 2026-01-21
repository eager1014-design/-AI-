#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
데이터베이스 직접 생성 스크립트 - SQL로 직접 테이블 생성
"""

import sqlite3
from werkzeug.security import generate_password_hash
from datetime import datetime

# 데이터베이스 연결
conn = sqlite3.connect('jjinbubu_market.db')
cursor = conn.cursor()

# User 테이블 생성 (subscription 필드 포함)
cursor.execute('''
CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(120) UNIQUE NOT NULL,
    username VARCHAR(80) NOT NULL,
    password_hash VARCHAR(200) NOT NULL,
    phone VARCHAR(20),
    birthdate DATE,
    is_member BOOLEAN DEFAULT 0,
    is_admin BOOLEAN DEFAULT 0,
    referral_source VARCHAR(50),
    somoim_id VARCHAR(100),
    subscription_status VARCHAR(20) DEFAULT 'free',
    subscription_start DATETIME,
    subscription_end DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
''')
print("✅ User 테이블 생성 완료")

# UserPromptAccess 테이블 생성
cursor.execute('''
CREATE TABLE IF NOT EXISTS user_prompt_access (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    prompt_id INTEGER NOT NULL,
    granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    granted_by_admin_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES user(id)
)
''')
print("✅ UserPromptAccess 테이블 생성 완료")

# Purchase 테이블 생성
cursor.execute('''
CREATE TABLE IF NOT EXISTS purchase (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    prompt_id INTEGER NOT NULL,
    prompt_title VARCHAR(200) NOT NULL,
    price INTEGER NOT NULL,
    purchased_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id)
)
''')
print("✅ Purchase 테이블 생성 완료")

# Payment 테이블 생성
cursor.execute('''
CREATE TABLE IF NOT EXISTS payment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    order_id VARCHAR(100) UNIQUE NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    amount INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    pg_transaction_id VARCHAR(200),
    pg_provider VARCHAR(50),
    buyer_name VARCHAR(100),
    buyer_email VARCHAR(120),
    buyer_phone VARCHAR(20),
    item_name VARCHAR(200),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    refunded_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES user(id)
)
''')
print("✅ Payment 테이블 생성 완료")

# Post 테이블 생성
cursor.execute('''
CREATE TABLE IF NOT EXISTS post (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    username VARCHAR(80) NOT NULL,
    category VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id)
)
''')
print("✅ Post 테이블 생성 완료")

# Comment 테이블 생성
cursor.execute('''
CREATE TABLE IF NOT EXISTS comment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    username VARCHAR(80) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES post(id),
    FOREIGN KEY (user_id) REFERENCES user(id)
)
''')
print("✅ Comment 테이블 생성 완료")

# Review 테이블 생성
cursor.execute('''
CREATE TABLE IF NOT EXISTS review (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    prompt_id VARCHAR(100) NOT NULL,
    rating INTEGER NOT NULL,
    content TEXT NOT NULL,
    helpful_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id)
)
''')
print("✅ Review 테이블 생성 완료")

# Somoim 테이블 생성
cursor.execute('''
CREATE TABLE IF NOT EXISTS somoim (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    somoim_id VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    kakao_link VARCHAR(500),
    membership_type VARCHAR(20) DEFAULT 'free',
    monthly_fee INTEGER DEFAULT 0,
    max_members INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
''')
print("✅ Somoim 테이블 생성 완료")

# SomoimMember 테이블 생성
cursor.execute('''
CREATE TABLE IF NOT EXISTS somoim_member (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    somoim_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    role VARCHAR(20) DEFAULT 'member',
    status VARCHAR(20) DEFAULT 'active',
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_payment_date DATETIME,
    payment_status VARCHAR(20) DEFAULT 'paid',
    FOREIGN KEY (somoim_id) REFERENCES somoim(id),
    FOREIGN KEY (user_id) REFERENCES user(id)
)
''')
print("✅ SomoimMember 테이블 생성 완료")

# SomoimPromptAccess 테이블 생성
cursor.execute('''
CREATE TABLE IF NOT EXISTS somoim_prompt_access (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    somoim_id INTEGER NOT NULL,
    prompt_id INTEGER NOT NULL,
    granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    granted_by_admin_id INTEGER,
    FOREIGN KEY (somoim_id) REFERENCES somoim(id)
)
''')
print("✅ SomoimPromptAccess 테이블 생성 완료")

# 관리자 계정 생성
admin_email = 'eager1014@gmail.com'
admin_password = generate_password_hash('admin123')
current_time = datetime.utcnow().isoformat()

try:
    cursor.execute('''
        INSERT INTO user (
            email, username, password_hash, is_member, is_admin,
            subscription_status, subscription_start, created_at
        ) VALUES (?, ?, ?, 1, 1, 'annual', ?, ?)
    ''', (admin_email, '관리자', admin_password, current_time, current_time))
    
    print(f"✅ 관리자 계정 생성 완료")
    print(f"   - 이메일: {admin_email}")
    print(f"   - 비밀번호: admin123")
except sqlite3.IntegrityError:
    print(f"ℹ️  관리자 계정이 이미 존재합니다: {admin_email}")

conn.commit()

# 테이블 확인
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()
print(f"\n📋 생성된 테이블: {', '.join([t[0] for t in tables])}")

# User 테이블 컬럼 확인
cursor.execute("PRAGMA table_info(user)")
columns = cursor.fetchall()
print(f"\n👤 User 테이블 컬럼:")
for col in columns:
    print(f"   - {col[1]} ({col[2]})")

conn.close()
print("\n✅ 데이터베이스 생성 완료!")
