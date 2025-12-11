from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
import os
import json

app = Flask(__name__, static_folder='.', static_url_path='')
app.config['SECRET_KEY'] = 'jjinbubu-secret-key-2024-ai-prompt-market'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///jjinbubu_market.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)

db = SQLAlchemy(app)
CORS(app, supports_credentials=True)

# ==================== 데이터베이스 모델 ====================

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(20), nullable=True)  # 전화번호
    birthdate = db.Column(db.Date, nullable=True)  # 생년월일
    is_member = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    purchases = db.relationship('Purchase', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def generate_token(self):
        payload = {
            'user_id': self.id,
            'email': self.email,
            'is_member': self.is_member,
            'exp': datetime.utcnow() + timedelta(days=7)
        }
        return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

class Purchase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    prompt_id = db.Column(db.Integer, nullable=False)
    prompt_title = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    purchased_at = db.Column(db.DateTime, default=datetime.utcnow)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    username = db.Column(db.String(80), nullable=False)
    category = db.Column(db.String(50), nullable=False)  # '질문', '정보공유', '성공사례', '자유'
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    likes = db.Column(db.Integer, default=0)
    views = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    comments = db.relationship('Comment', backref='post', lazy=True, cascade='all, delete-orphan')
    user = db.relationship('User', backref='posts')

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    username = db.Column(db.String(80), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship('User', backref='comments')

# ==================== 헬퍼 함수 ====================

def token_required(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': '토큰이 없습니다.'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
            if not current_user:
                return jsonify({'message': '유효하지 않은 사용자입니다.'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': '토큰이 만료되었습니다.'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': '유효하지 않은 토큰입니다.'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

# ==================== API 엔드포인트 ====================

@app.route('/')
def index():
    return app.send_static_file('index.html')

# 회원가입
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # 입력 검증
    if not data or not data.get('email') or not data.get('password') or not data.get('username'):
        return jsonify({'message': '이메일, 이름, 비밀번호를 모두 입력해주세요.'}), 400
    
    if not data.get('phone'):
        return jsonify({'message': '전화번호를 입력해주세요.'}), 400
    
    if not data.get('birthdate'):
        return jsonify({'message': '생년월일을 입력해주세요.'}), 400
    
    # 이메일 중복 확인
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': '이미 가입된 이메일입니다.'}), 400
    
    # 전화번호 중복 확인
    if User.query.filter_by(phone=data['phone']).first():
        return jsonify({'message': '이미 등록된 전화번호입니다.'}), 400
    
    # 생년월일 파싱
    try:
        birthdate = datetime.strptime(data['birthdate'], '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'message': '생년월일 형식이 올바르지 않습니다. (YYYY-MM-DD)'}), 400
    
    # 새 사용자 생성
    new_user = User(
        email=data['email'],
        username=data['username'],
        phone=data['phone'],
        birthdate=birthdate,
        is_member=data.get('is_member', False)
    )
    new_user.set_password(data['password'])
    
    db.session.add(new_user)
    db.session.commit()
    
    # 토큰 생성
    token = new_user.generate_token()
    
    return jsonify({
        'message': '회원가입이 완료되었습니다!',
        'token': token,
        'user': {
            'id': new_user.id,
            'email': new_user.email,
            'username': new_user.username,
            'phone': new_user.phone,
            'birthdate': new_user.birthdate.isoformat(),
            'is_member': new_user.is_member
        }
    }), 201

# 로그인
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': '이메일과 비밀번호를 입력해주세요.'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'message': '이메일 또는 비밀번호가 일치하지 않습니다.'}), 401
    
    token = user.generate_token()
    
    return jsonify({
        'message': '로그인 성공!',
        'token': token,
        'user': {
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'is_member': user.is_member
        }
    }), 200

# 사용자 정보 조회
@app.route('/api/user/me', methods=['GET'])
@token_required
def get_user_info(current_user):
    purchases = Purchase.query.filter_by(user_id=current_user.id).all()
    
    return jsonify({
        'user': {
            'id': current_user.id,
            'email': current_user.email,
            'username': current_user.username,
            'phone': current_user.phone,
            'birthdate': current_user.birthdate.isoformat() if current_user.birthdate else None,
            'is_member': current_user.is_member,
            'created_at': current_user.created_at.isoformat()
        },
        'purchases': [{
            'id': p.id,
            'prompt_id': p.prompt_id,
            'prompt_title': p.prompt_title,
            'price': p.price,
            'purchased_at': p.purchased_at.isoformat()
        } for p in purchases]
    }), 200

# 프롬프트 구매
@app.route('/api/purchase', methods=['POST'])
@token_required
def purchase_prompt(current_user):
    data = request.get_json()
    
    if not data or not data.get('prompt_id'):
        return jsonify({'message': '프롬프트 ID가 필요합니다.'}), 400
    
    # 이미 구매했는지 확인
    existing_purchase = Purchase.query.filter_by(
        user_id=current_user.id,
        prompt_id=data['prompt_id']
    ).first()
    
    if existing_purchase:
        return jsonify({'message': '이미 구매한 프롬프트입니다.'}), 400
    
    # 구매 기록 생성
    new_purchase = Purchase(
        user_id=current_user.id,
        prompt_id=data['prompt_id'],
        prompt_title=data.get('prompt_title', '프롬프트'),
        price=data.get('price', 0)
    )
    
    db.session.add(new_purchase)
    db.session.commit()
    
    return jsonify({
        'message': '구매가 완료되었습니다!',
        'purchase': {
            'id': new_purchase.id,
            'prompt_id': new_purchase.prompt_id,
            'prompt_title': new_purchase.prompt_title,
            'price': new_purchase.price,
            'purchased_at': new_purchase.purchased_at.isoformat()
        }
    }), 201

# 구매 내역 확인
@app.route('/api/purchases', methods=['GET'])
@token_required
def get_purchases(current_user):
    purchases = Purchase.query.filter_by(user_id=current_user.id).order_by(Purchase.purchased_at.desc()).all()
    
    return jsonify({
        'purchases': [{
            'id': p.id,
            'prompt_id': p.prompt_id,
            'prompt_title': p.prompt_title,
            'price': p.price,
            'purchased_at': p.purchased_at.isoformat()
        } for p in purchases]
    }), 200

# 프롬프트 접근 권한 확인
@app.route('/api/check-access/<int:prompt_id>', methods=['GET'])
@token_required
def check_prompt_access(current_user, prompt_id):
    # 무료 프롬프트(ID 0)는 항상 접근 가능
    if prompt_id == 0:
        return jsonify({'has_access': True}), 200
    
    # 구매 확인
    purchase = Purchase.query.filter_by(
        user_id=current_user.id,
        prompt_id=prompt_id
    ).first()
    
    return jsonify({'has_access': purchase is not None}), 200

# 통계 (관리자용)
@app.route('/api/stats', methods=['GET'])
def get_stats():
    total_users = User.query.count()
    total_members = User.query.filter_by(is_member=True).count()
    total_purchases = Purchase.query.count()
    total_revenue = db.session.query(db.func.sum(Purchase.price)).scalar() or 0
    total_posts = Post.query.count()
    total_comments = Comment.query.count()
    
    return jsonify({
        'total_users': total_users,
        'total_members': total_members,
        'total_purchases': total_purchases,
        'total_revenue': total_revenue,
        'total_posts': total_posts,
        'total_comments': total_comments
    }), 200

# ==================== 커뮤니티 API ====================

# 게시글 목록 조회
@app.route('/api/posts', methods=['GET'])
def get_posts():
    category = request.args.get('category', None)
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    
    query = Post.query
    
    if category:
        query = query.filter_by(category=category)
    
    posts = query.order_by(Post.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return jsonify({
        'posts': [{
            'id': p.id,
            'user_id': p.user_id,
            'username': p.username,
            'category': p.category,
            'title': p.title,
            'content': p.content[:100] + '...' if len(p.content) > 100 else p.content,
            'likes': p.likes,
            'views': p.views,
            'comment_count': len(p.comments),
            'created_at': p.created_at.isoformat(),
            'updated_at': p.updated_at.isoformat()
        } for p in posts.items],
        'total': posts.total,
        'pages': posts.pages,
        'current_page': posts.page
    }), 200

# 게시글 상세 조회
@app.route('/api/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    post = Post.query.get_or_404(post_id)
    
    # 조회수 증가
    post.views += 1
    db.session.commit()
    
    return jsonify({
        'post': {
            'id': post.id,
            'user_id': post.user_id,
            'username': post.username,
            'category': post.category,
            'title': post.title,
            'content': post.content,
            'likes': post.likes,
            'views': post.views,
            'created_at': post.created_at.isoformat(),
            'updated_at': post.updated_at.isoformat()
        },
        'comments': [{
            'id': c.id,
            'user_id': c.user_id,
            'username': c.username,
            'content': c.content,
            'created_at': c.created_at.isoformat()
        } for c in post.comments]
    }), 200

# 게시글 작성
@app.route('/api/posts', methods=['POST'])
@token_required
def create_post(current_user):
    data = request.get_json()
    
    if not data or not data.get('title') or not data.get('content'):
        return jsonify({'message': '제목과 내용을 입력해주세요.'}), 400
    
    new_post = Post(
        user_id=current_user.id,
        username=current_user.username,
        category=data.get('category', '자유'),
        title=data['title'],
        content=data['content']
    )
    
    db.session.add(new_post)
    db.session.commit()
    
    return jsonify({
        'message': '게시글이 등록되었습니다!',
        'post': {
            'id': new_post.id,
            'title': new_post.title,
            'category': new_post.category,
            'created_at': new_post.created_at.isoformat()
        }
    }), 201

# 게시글 수정
@app.route('/api/posts/<int:post_id>', methods=['PUT'])
@token_required
def update_post(current_user, post_id):
    post = Post.query.get_or_404(post_id)
    
    if post.user_id != current_user.id:
        return jsonify({'message': '권한이 없습니다.'}), 403
    
    data = request.get_json()
    
    if data.get('title'):
        post.title = data['title']
    if data.get('content'):
        post.content = data['content']
    if data.get('category'):
        post.category = data['category']
    
    post.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({'message': '게시글이 수정되었습니다.'}), 200

# 게시글 삭제
@app.route('/api/posts/<int:post_id>', methods=['DELETE'])
@token_required
def delete_post(current_user, post_id):
    post = Post.query.get_or_404(post_id)
    
    if post.user_id != current_user.id:
        return jsonify({'message': '권한이 없습니다.'}), 403
    
    db.session.delete(post)
    db.session.commit()
    
    return jsonify({'message': '게시글이 삭제되었습니다.'}), 200

# 댓글 작성
@app.route('/api/posts/<int:post_id>/comments', methods=['POST'])
@token_required
def create_comment(current_user, post_id):
    post = Post.query.get_or_404(post_id)
    data = request.get_json()
    
    if not data or not data.get('content'):
        return jsonify({'message': '댓글 내용을 입력해주세요.'}), 400
    
    new_comment = Comment(
        post_id=post_id,
        user_id=current_user.id,
        username=current_user.username,
        content=data['content']
    )
    
    db.session.add(new_comment)
    db.session.commit()
    
    return jsonify({
        'message': '댓글이 등록되었습니다!',
        'comment': {
            'id': new_comment.id,
            'username': new_comment.username,
            'content': new_comment.content,
            'created_at': new_comment.created_at.isoformat()
        }
    }), 201

# 댓글 삭제
@app.route('/api/comments/<int:comment_id>', methods=['DELETE'])
@token_required
def delete_comment(current_user, comment_id):
    comment = Comment.query.get_or_404(comment_id)
    
    if comment.user_id != current_user.id:
        return jsonify({'message': '권한이 없습니다.'}), 403
    
    db.session.delete(comment)
    db.session.commit()
    
    return jsonify({'message': '댓글이 삭제되었습니다.'}), 200

# 게시글 좋아요
@app.route('/api/posts/<int:post_id>/like', methods=['POST'])
@token_required
def like_post(current_user, post_id):
    post = Post.query.get_or_404(post_id)
    post.likes += 1
    db.session.commit()
    
    return jsonify({'message': '좋아요!', 'likes': post.likes}), 200

# ==================== 초기화 ====================

def init_db():
    with app.app_context():
        db.create_all()
        print("✅ 데이터베이스 테이블 생성 완료!")

if __name__ == '__main__':
    init_db()
    print("=" * 50)
    print("🚀 찐부부 AI 프롬프트 마켓 서버 시작!")
    print("=" * 50)
    app.run(host='0.0.0.0', port=8003, debug=True)
