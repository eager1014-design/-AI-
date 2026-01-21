"""
SQLAlchemy 메타데이터를 강제로 리프레시하는 스크립트
"""
from app import app, db

with app.app_context():
    # 메타데이터 강제 리로드
    db.metadata.reflect(db.engine)
    print("✅ SQLAlchemy 메타데이터 리프레시 완료")
    
    # User 테이블 확인
    if 'user' in db.metadata.tables:
        user_table = db.metadata.tables['user']
        print(f"👤 User 테이블 컬럼: {list(user_table.columns.keys())}")
    else:
        print("⚠️  User 테이블을 찾을 수 없습니다")
