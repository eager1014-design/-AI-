import sys
sys.path.append('..')
from app import app

# Vercel을 위한 엔트리포인트
def handler(event, context):
    return app(event, context)
