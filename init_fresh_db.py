#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
데이터베이스 초기화 스크립트 - 모든 테이블 생성 및 관리자 계정 생성
"""

from app import app, db, User
from datetime import datetime

def init_database():
    """데이터베이스 초기화"""
    with app.app_context():
        # 모든 테이블 생성
        print("🔧 데이터베이스 테이블 생성 중...")
        db.create_all()
        print("✅ 테이블 생성 완료")
        
        # 관리자 계정 생성
        admin_email = 'eager1014@gmail.com'
        existing_admin = User.query.filter_by(email=admin_email).first()
        
        if not existing_admin:
            print(f"👤 관리자 계정 생성 중: {admin_email}")
            admin = User(
                email=admin_email,
                username='관리자',
                is_member=True,
                is_admin=True,
                subscription_status='annual',  # 관리자는 annual 구독
                subscription_start=datetime.utcnow(),
                created_at=datetime.utcnow()
            )
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()
            print("✅ 관리자 계정 생성 완료")
            print(f"   - 이메일: {admin_email}")
            print(f"   - 비밀번호: admin123")
        else:
            print(f"ℹ️  관리자 계정이 이미 존재합니다: {admin_email}")
        
        # 테이블 확인
        from sqlalchemy import inspect
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        print(f"\n📋 생성된 테이블 목록: {', '.join(tables)}")
        
        # User 테이블 컬럼 확인
        if 'user' in tables:
            columns = [col['name'] for col in inspector.get_columns('user')]
            print(f"👤 User 테이블 컬럼: {', '.join(columns)}")
        
        print("\n✅ 데이터베이스 초기화 완료!")

if __name__ == '__main__':
    init_database()
