from app import app, db
from datetime import datetime

print("=" * 60)
print("데이터베이스 마이그레이션 시작...")
print("=" * 60)

with app.app_context():
    # 기존 테이블 삭제하지 않고 새 테이블만 생성
    db.create_all()
    print("✅ 테이블 생성 완료")
    
    # User 테이블에 새 컬럼 추가 확인
    from sqlalchemy import inspect
    inspector = inspect(db.engine)
    
    user_columns = [col['name'] for col in inspector.get_columns('user')]
    print(f"\n📋 User 테이블 컬럼: {user_columns}")
    
    # UserPromptAccess 테이블 확인
    if 'user_prompt_access' in inspector.get_table_names():
        print("✅ UserPromptAccess 테이블 존재")
    else:
        print("⚠️  UserPromptAccess 테이블이 없습니다")
    
    print("\n" + "=" * 60)
    print("✅ 마이그레이션 완료!")
    print("=" * 60)
