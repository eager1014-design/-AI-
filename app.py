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

# 정산 계좌 정보
app.config['SETTLEMENT_BANK'] = '농협'
app.config['SETTLEMENT_ACCOUNT'] = '3521621346013'
app.config['SETTLEMENT_HOLDER'] = '천성준'

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
    is_admin = db.Column(db.Boolean, default=False)  # 관리자 여부
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
            'is_admin': self.is_admin,
            'exp': datetime.utcnow() + timedelta(days=7)
        }
        return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
    
    def is_in_welcome_discount_period(self):
        """가입 후 3시간 이내인지 확인 (50% 추가 할인)"""
        if not self.created_at:
            return False
        time_since_signup = datetime.utcnow() - self.created_at
        return time_since_signup < timedelta(hours=3)
    
    def get_discount_rate(self):
        """사용자의 할인율 계산"""
        if self.is_member:
            # 회원이면서 가입 3시간 이내인 경우 50% 할인
            if self.is_in_welcome_discount_period():
                return 0.50  # 50% 할인
            else:
                return 0.30  # 기본 회원 할인 (예: 30%)
        return 0  # 비회원은 할인 없음

class Purchase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    prompt_id = db.Column(db.Integer, nullable=False)
    prompt_title = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    purchased_at = db.Column(db.DateTime, default=datetime.utcnow)

class Payment(db.Model):
    """실제 결제 내역 테이블 (PG사 연동)"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    order_id = db.Column(db.String(100), unique=True, nullable=False)  # 주문번호
    payment_method = db.Column(db.String(50), nullable=False)  # 'card', 'kakao', 'toss' etc.
    amount = db.Column(db.Integer, nullable=False)  # 결제 금액
    status = db.Column(db.String(20), default='pending')  # pending, completed, failed, refunded
    pg_transaction_id = db.Column(db.String(200))  # PG사 거래 ID
    pg_provider = db.Column(db.String(50))  # 'toss', 'kakao', 'portone' etc.
    buyer_name = db.Column(db.String(100))
    buyer_email = db.Column(db.String(120))
    buyer_phone = db.Column(db.String(20))
    item_name = db.Column(db.String(200))  # 상품명
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)  # 결제 완료 시간
    refunded_at = db.Column(db.DateTime)  # 환불 시간
    user = db.relationship('User', backref='payments')

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

def admin_required(f):
    """관리자 전용 decorator"""
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
            
            if not current_user.is_admin:
                return jsonify({'message': '⛔ 관리자 권한이 필요합니다.'}), 403
                
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
            'is_admin': current_user.is_admin,
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

# 비밀번호 찾기 (이메일 + 전화번호 확인)
@app.route('/api/password/reset-request', methods=['POST'])
def password_reset_request():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('phone'):
        return jsonify({'message': '이메일과 전화번호를 입력해주세요.'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user:
        return jsonify({'message': '등록되지 않은 이메일입니다.'}), 404
    
    # 전화번호 확인
    if user.phone != data['phone']:
        return jsonify({'message': '전화번호가 일치하지 않습니다.'}), 400
    
    # 임시 토큰 생성 (비밀번호 재설정용, 15분 유효)
    reset_token_payload = {
        'user_id': user.id,
        'email': user.email,
        'type': 'password_reset',
        'exp': datetime.utcnow() + timedelta(minutes=15)
    }
    reset_token = jwt.encode(reset_token_payload, app.config['SECRET_KEY'], algorithm='HS256')
    
    return jsonify({
        'message': '본인 인증이 완료되었습니다. 새 비밀번호를 설정해주세요.',
        'reset_token': reset_token,
        'email': user.email
    }), 200

# 비밀번호 재설정
@app.route('/api/password/reset', methods=['POST'])
def password_reset():
    data = request.get_json()
    
    if not data or not data.get('reset_token') or not data.get('new_password'):
        return jsonify({'message': '토큰과 새 비밀번호를 입력해주세요.'}), 400
    
    try:
        # 토큰 검증
        payload = jwt.decode(data['reset_token'], app.config['SECRET_KEY'], algorithms=['HS256'])
        
        if payload.get('type') != 'password_reset':
            return jsonify({'message': '유효하지 않은 토큰입니다.'}), 400
        
        user = User.query.get(payload['user_id'])
        if not user:
            return jsonify({'message': '사용자를 찾을 수 없습니다.'}), 404
        
        # 비밀번호 길이 확인
        if len(data['new_password']) < 8:
            return jsonify({'message': '비밀번호는 8자 이상이어야 합니다.'}), 400
        
        # 비밀번호 변경
        user.set_password(data['new_password'])
        db.session.commit()
        
        return jsonify({
            'message': '비밀번호가 성공적으로 변경되었습니다.',
            'email': user.email
        }), 200
        
    except jwt.ExpiredSignatureError:
        return jsonify({'message': '토큰이 만료되었습니다. 다시 시도해주세요.'}), 400
    except jwt.InvalidTokenError:
        return jsonify({'message': '유효하지 않은 토큰입니다.'}), 400

# 회원정보 수정
@app.route('/api/user/update', methods=['PUT'])
@token_required
def update_user(current_user):
    data = request.get_json()
    
    if not data:
        return jsonify({'message': '수정할 정보를 입력해주세요.'}), 400
    
    # 이름 수정
    if 'username' in data and data['username']:
        current_user.username = data['username']
    
    # 전화번호 수정
    if 'phone' in data and data['phone']:
        # 다른 사용자가 이미 사용 중인지 확인
        existing_user = User.query.filter_by(phone=data['phone']).first()
        if existing_user and existing_user.id != current_user.id:
            return jsonify({'message': '이미 등록된 전화번호입니다.'}), 400
        current_user.phone = data['phone']
    
    # 생년월일 수정
    if 'birthdate' in data and data['birthdate']:
        try:
            birthdate = datetime.strptime(data['birthdate'], '%Y-%m-%d').date()
            current_user.birthdate = birthdate
        except ValueError:
            return jsonify({'message': '생년월일 형식이 올바르지 않습니다. (YYYY-MM-DD)'}), 400
    
    # 비밀번호 변경
    if 'current_password' in data and 'new_password' in data:
        if not current_user.check_password(data['current_password']):
            return jsonify({'message': '현재 비밀번호가 일치하지 않습니다.'}), 400
        
        if len(data['new_password']) < 8:
            return jsonify({'message': '새 비밀번호는 8자 이상이어야 합니다.'}), 400
        
        current_user.set_password(data['new_password'])
    
    db.session.commit()
    
    return jsonify({
        'message': '회원정보가 수정되었습니다.',
        'user': {
            'id': current_user.id,
            'email': current_user.email,
            'username': current_user.username,
            'phone': current_user.phone,
            'birthdate': current_user.birthdate.isoformat() if current_user.birthdate else None,
            'is_member': current_user.is_member,
            'created_at': current_user.created_at.isoformat()
        }
    }), 200

# 회원 탈퇴
@app.route('/api/user/delete', methods=['DELETE'])
@token_required
def delete_user(current_user):
    data = request.get_json()
    
    # 비밀번호 확인
    if not data or not data.get('password'):
        return jsonify({'message': '비밀번호를 입력해주세요.'}), 400
    
    if not current_user.check_password(data['password']):
        return jsonify({'message': '비밀번호가 일치하지 않습니다.'}), 400
    
    # 관리자는 탈퇴 불가
    if current_user.is_admin:
        return jsonify({'message': '관리자 계정은 탈퇴할 수 없습니다.'}), 403
    
    # 사용자 이메일 저장 (로그용)
    user_email = current_user.email
    
    # 사용자 삭제 (관련 구매 내역, 게시글, 댓글도 함께 삭제됨)
    db.session.delete(current_user)
    db.session.commit()
    
    return jsonify({
        'message': '회원 탈퇴가 완료되었습니다. 그동안 이용해주셔서 감사합니다.',
        'deleted_email': user_email
    }), 200

# 사용자 할인 정보 조회
@app.route('/api/user/discount', methods=['GET'])
@token_required
def get_user_discount(current_user):
    is_welcome = current_user.is_in_welcome_discount_period()
    discount_rate = current_user.get_discount_rate()
    
    time_since_signup = datetime.utcnow() - current_user.created_at
    remaining_time = timedelta(hours=3) - time_since_signup
    
    return jsonify({
        'is_member': current_user.is_member,
        'is_welcome_period': is_welcome,
        'discount_rate': discount_rate,
        'discount_percentage': int(discount_rate * 100),
        'created_at': current_user.created_at.isoformat(),
        'remaining_minutes': int(remaining_time.total_seconds() / 60) if is_welcome else 0
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

# ==================== 관리자 API ====================

# 관리자 로그인 시 관리자 정보 반환
@app.route('/api/admin/check', methods=['GET'])
@admin_required
def admin_check(current_user):
    """관리자 권한 확인"""
    return jsonify({
        'is_admin': True,
        'username': current_user.username,
        'email': current_user.email
    }), 200

# 전체 사용자 목록
@app.route('/api/admin/users', methods=['GET'])
@admin_required
def get_all_users(current_user):
    """전체 사용자 목록 조회 (관리자 전용)"""
    users = User.query.order_by(User.created_at.desc()).all()
    
    users_data = []
    for user in users:
        users_data.append({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'phone': user.phone,
            'birthdate': user.birthdate.strftime('%Y-%m-%d') if user.birthdate else None,
            'is_member': user.is_member,
            'is_admin': user.is_admin,
            'created_at': user.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'purchase_count': len(user.purchases),
            'total_spent': sum(p.price for p in user.purchases)
        })
    
    return jsonify({
        'users': users_data,
        'total_count': len(users_data)
    }), 200

# 특정 사용자 상세 정보
@app.route('/api/admin/users/<int:user_id>', methods=['GET'])
@admin_required
def get_user_detail(current_user, user_id):
    """특정 사용자 상세 정보 (관리자 전용)"""
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': '사용자를 찾을 수 없습니다.'}), 404
    
    purchases = Purchase.query.filter_by(user_id=user_id).order_by(Purchase.purchased_at.desc()).all()
    purchases_data = [{
        'id': p.id,
        'prompt_title': p.prompt_title,
        'price': p.price,
        'purchased_at': p.purchased_at.strftime('%Y-%m-%d %H:%M:%S')
    } for p in purchases]
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'phone': user.phone,
        'birthdate': user.birthdate.strftime('%Y-%m-%d') if user.birthdate else None,
        'is_member': user.is_member,
        'is_admin': user.is_admin,
        'created_at': user.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        'purchases': purchases_data,
        'total_spent': sum(p.price for p in purchases)
    }), 200

# 사용자 권한 변경 (일반 회원 ↔ 관리자)
@app.route('/api/admin/users/<int:user_id>/role', methods=['PUT'])
@admin_required
def update_user_role(current_user, user_id):
    """사용자 권한 변경 (관리자 전용)"""
    if current_user.id == user_id:
        return jsonify({'message': '⛔ 자기 자신의 권한은 변경할 수 없습니다.'}), 400
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': '사용자를 찾을 수 없습니다.'}), 404
    
    data = request.get_json()
    
    if 'is_admin' in data:
        user.is_admin = data['is_admin']
    if 'is_member' in data:
        user.is_member = data['is_member']
    
    db.session.commit()
    
    return jsonify({
        'message': '권한이 변경되었습니다.',
        'user': {
            'id': user.id,
            'username': user.username,
            'is_member': user.is_member,
            'is_admin': user.is_admin
        }
    }), 200

# 전체 구매 내역
@app.route('/api/admin/purchases', methods=['GET'])
@admin_required
def get_all_purchases(current_user):
    """전체 구매 내역 조회 (관리자 전용)"""
    purchases = Purchase.query.order_by(Purchase.purchased_at.desc()).limit(100).all()
    
    purchases_data = []
    for p in purchases:
        user = User.query.get(p.user_id)
        purchases_data.append({
            'id': p.id,
            'user_id': p.user_id,
            'username': user.username if user else '알 수 없음',
            'email': user.email if user else '알 수 없음',
            'prompt_title': p.prompt_title,
            'price': p.price,
            'purchased_at': p.purchased_at.strftime('%Y-%m-%d %H:%M:%S')
        })
    
    return jsonify({
        'purchases': purchases_data,
        'total_count': len(purchases_data)
    }), 200

# 전체 결제 내역
@app.route('/api/admin/payments', methods=['GET'])
@admin_required
def get_all_payments(current_user):
    """전체 결제 내역 조회 (관리자 전용)"""
    payments = Payment.query.order_by(Payment.created_at.desc()).limit(100).all()
    
    payments_data = []
    for payment in payments:
        user = User.query.get(payment.user_id)
        payments_data.append({
            'id': payment.id,
            'order_id': payment.order_id,
            'user_id': payment.user_id,
            'username': user.username if user else '알 수 없음',
            'payment_method': payment.payment_method,
            'amount': payment.amount,
            'status': payment.status,
            'item_name': payment.item_name,
            'created_at': payment.created_at.strftime('%Y-%m-%d %H:%M:%S')
        })
    
    return jsonify({
        'payments': payments_data,
        'total_count': len(payments_data)
    }), 200

# 통계 대시보드 (관리자용 확장)
@app.route('/api/admin/dashboard', methods=['GET'])
@admin_required
def admin_dashboard(current_user):
    """관리자 대시보드 통계"""
    from sqlalchemy import func
    
    total_users = User.query.count()
    total_members = User.query.filter_by(is_member=True).count()
    total_admins = User.query.filter_by(is_admin=True).count()
    total_purchases = Purchase.query.count()
    total_revenue = db.session.query(func.sum(Purchase.price)).scalar() or 0
    total_posts = Post.query.count()
    total_comments = Comment.query.count()
    total_payments = Payment.query.filter_by(status='completed').count()
    
    # 최근 가입자 (7일)
    week_ago = datetime.utcnow() - timedelta(days=7)
    new_users_week = User.query.filter(User.created_at >= week_ago).count()
    
    # 최근 구매 (7일)
    new_purchases_week = Purchase.query.filter(Purchase.purchased_at >= week_ago).count()
    
    # 인기 프롬프트
    popular_prompts = db.session.query(
        Purchase.prompt_title,
        func.count(Purchase.id).label('count'),
        func.sum(Purchase.price).label('revenue')
    ).group_by(Purchase.prompt_title).order_by(func.count(Purchase.id).desc()).limit(5).all()
    
    popular_prompts_data = [{
        'title': p[0],
        'sales_count': p[1],
        'revenue': p[2]
    } for p in popular_prompts]
    
    return jsonify({
        'total_users': total_users,
        'total_members': total_members,
        'total_admins': total_admins,
        'total_purchases': total_purchases,
        'total_revenue': total_revenue,
        'total_posts': total_posts,
        'total_comments': total_comments,
        'total_payments': total_payments,
        'new_users_week': new_users_week,
        'new_purchases_week': new_purchases_week,
        'popular_prompts': popular_prompts_data,
        'settlement_account': {
            'bank': app.config['SETTLEMENT_BANK'],
            'account': app.config['SETTLEMENT_ACCOUNT'],
            'holder': app.config['SETTLEMENT_HOLDER']
        }
    }), 200

# ==================== 결제 API ====================

# 결제 준비 (주문번호 생성)
@app.route('/api/payment/prepare', methods=['POST'])
@token_required
def prepare_payment(current_user):
    """결제 준비 - 주문번호 생성"""
    data = request.get_json()
    
    if not data.get('prompt_id') or not data.get('amount') or not data.get('item_name'):
        return jsonify({'message': '필수 정보가 누락되었습니다.'}), 400
    
    # 주문번호 생성 (timestamp + user_id)
    import time
    order_id = f"ORDER_{int(time.time())}_{current_user.id}"
    
    # Payment 레코드 생성 (pending 상태)
    payment = Payment(
        user_id=current_user.id,
        order_id=order_id,
        payment_method=data.get('payment_method', 'card'),
        amount=data['amount'],
        status='pending',
        buyer_name=current_user.username,
        buyer_email=current_user.email,
        buyer_phone=current_user.phone,
        item_name=data['item_name']
    )
    
    db.session.add(payment)
    db.session.commit()
    
    return jsonify({
        'message': '결제 준비가 완료되었습니다.',
        'order_id': order_id,
        'amount': data['amount'],
        'payment': {
            'id': payment.id,
            'order_id': order_id,
            'buyer_name': current_user.username,
            'buyer_email': current_user.email
        }
    }), 200

# 결제 검증 및 완료
@app.route('/api/payment/complete', methods=['POST'])
@token_required
def complete_payment(current_user):
    """결제 완료 처리 (PG사 결제 확인 후)"""
    data = request.get_json()
    
    order_id = data.get('order_id')
    pg_transaction_id = data.get('pg_transaction_id')
    
    if not order_id:
        return jsonify({'message': '주문번호가 없습니다.'}), 400
    
    # Payment 찾기
    payment = Payment.query.filter_by(order_id=order_id, user_id=current_user.id).first()
    if not payment:
        return jsonify({'message': '결제 정보를 찾을 수 없습니다.'}), 404
    
    # 이미 완료된 결제인지 확인
    if payment.status == 'completed':
        return jsonify({'message': '이미 처리된 결제입니다.'}), 400
    
    # TODO: 여기서 실제 PG사 API로 결제 검증
    # (Toss Payments, KakaoPay, PortOne 등)
    # 예시:
    # response = verify_payment_with_pg(pg_transaction_id, payment.amount)
    # if not response.success:
    #     payment.status = 'failed'
    #     db.session.commit()
    #     return jsonify({'message': '결제 검증에 실패했습니다.'}), 400
    
    # 결제 완료 처리
    payment.status = 'completed'
    payment.pg_transaction_id = pg_transaction_id
    payment.completed_at = datetime.utcnow()
    
    # Purchase 레코드 생성 (프롬프트 접근 권한 부여)
    prompt_id = data.get('prompt_id')
    prompt_title = data.get('prompt_title', payment.item_name)
    
    purchase = Purchase(
        user_id=current_user.id,
        prompt_id=prompt_id,
        prompt_title=prompt_title,
        price=payment.amount
    )
    
    db.session.add(purchase)
    db.session.commit()
    
    return jsonify({
        'message': '✅ 결제가 완료되었습니다!',
        'payment': {
            'order_id': payment.order_id,
            'amount': payment.amount,
            'status': payment.status,
            'completed_at': payment.completed_at.strftime('%Y-%m-%d %H:%M:%S')
        },
        'purchase': {
            'id': purchase.id,
            'prompt_title': purchase.prompt_title
        }
    }), 200

# 결제 취소/환불
@app.route('/api/payment/<order_id>/refund', methods=['POST'])
@token_required
def refund_payment(current_user, order_id):
    """결제 환불 처리"""
    payment = Payment.query.filter_by(order_id=order_id, user_id=current_user.id).first()
    
    if not payment:
        return jsonify({'message': '결제 정보를 찾을 수 없습니다.'}), 404
    
    if payment.status != 'completed':
        return jsonify({'message': '완료된 결제만 환불할 수 있습니다.'}), 400
    
    # 7일 환불 보장 확인
    if payment.completed_at:
        days_passed = (datetime.utcnow() - payment.completed_at).days
        if days_passed > 7:
            return jsonify({'message': '환불 기간이 지났습니다. (7일 이내)'}), 400
    
    # TODO: PG사 환불 API 호출
    # refund_response = request_refund_to_pg(payment.pg_transaction_id, payment.amount)
    
    # 환불 처리
    payment.status = 'refunded'
    payment.refunded_at = datetime.utcnow()
    
    # Purchase 삭제 (프롬프트 접근 권한 제거)
    Purchase.query.filter_by(user_id=current_user.id, prompt_title=payment.item_name).delete()
    
    db.session.commit()
    
    return jsonify({
        'message': '✅ 환불이 완료되었습니다.',
        'payment': {
            'order_id': payment.order_id,
            'amount': payment.amount,
            'status': payment.status,
            'refunded_at': payment.refunded_at.strftime('%Y-%m-%d %H:%M:%S')
        }
    }), 200

# ==================== 초기화 ====================

def init_db():
    with app.app_context():
        db.create_all()
        print("✅ 데이터베이스 테이블 생성 완료!")
        
        # 관리자 계정 초기화 (eager1014@gmail.com)
        admin_email = 'eager1014@gmail.com'
        admin = User.query.filter_by(email=admin_email).first()
        
        if not admin:
            admin = User(
                email=admin_email,
                username='찐부부 관리자',
                is_member=True,
                is_admin=True
            )
            admin.set_password('admin1234')  # 초기 비밀번호 (나중에 변경 필요)
            db.session.add(admin)
            db.session.commit()
            print(f"👑 관리자 계정 생성 완료: {admin_email}")
            print(f"   초기 비밀번호: admin1234 (로그인 후 변경하세요!)")
        else:
            # 기존 계정을 관리자로 승격
            if not admin.is_admin:
                admin.is_admin = True
                db.session.commit()
                print(f"👑 기존 계정을 관리자로 승격: {admin_email}")
            else:
                print(f"✅ 관리자 계정 이미 존재: {admin_email}")

if __name__ == '__main__':
    init_db()
    print("=" * 50)
    print("🚀 찐부부 AI 프롬프트 마켓 서버 시작!")
    print("=" * 50)
    print("👑 관리자 이메일: eager1014@gmail.com")
    print("=" * 50)
    app.run(host='0.0.0.0', port=8003, debug=True)
