# 모임 관리 API - app.py에 추가할 코드

# ==================== 모임 관리 API ====================

@app.route('/api/admin/somoims', methods=['GET'])
@admin_required
def get_all_somoims(current_user):
    """관리자: 모든 모임 목록 조회"""
    try:
        somoims = Somoim.query.all()
        result = []
        for somoim in somoims:
            member_count = SomoimMember.query.filter_by(
                somoim_id=somoim.id, 
                status='active'
            ).count()
            
            result.append({
                'id': somoim.id,
                'name': somoim.name,
                'somoim_id': somoim.somoim_id,
                'description': somoim.description,
                'kakao_link': somoim.kakao_link,
                'membership_type': somoim.membership_type,
                'monthly_fee': somoim.monthly_fee,
                'max_members': somoim.max_members,
                'current_members': member_count,
                'is_active': somoim.is_active,
                'created_at': somoim.created_at.isoformat() if somoim.created_at else None
            })
        
        return jsonify({'somoims': result}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/somoims', methods=['POST'])
@admin_required
def create_somoim(current_user):
    """관리자: 새 모임 생성"""
    try:
        data = request.get_json()
        
        # 중복 체크
        existing = Somoim.query.filter_by(somoim_id=data['somoim_id']).first()
        if existing:
            return jsonify({'error': '이미 존재하는 모임 ID입니다.'}), 400
        
        somoim = Somoim(
            name=data['name'],
            somoim_id=data['somoim_id'],
            description=data.get('description'),
            kakao_link=data.get('kakao_link'),
            membership_type=data.get('membership_type', 'free'),
            monthly_fee=data.get('monthly_fee', 0),
            max_members=data.get('max_members', 0),
            is_active=data.get('is_active', True)
        )
        
        db.session.add(somoim)
        db.session.commit()
        
        return jsonify({
            'message': f'{somoim.name} 모임이 생성되었습니다.',
            'somoim': {
                'id': somoim.id,
                'name': somoim.name,
                'somoim_id': somoim.somoim_id
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/somoims/<int:somoim_id>', methods=['PUT'])
@admin_required
def update_somoim(current_user, somoim_id):
    """관리자: 모임 정보 수정"""
    try:
        somoim = Somoim.query.get(somoim_id)
        if not somoim:
            return jsonify({'error': '모임을 찾을 수 없습니다.'}), 404
        
        data = request.get_json()
        
        if 'name' in data:
            somoim.name = data['name']
        if 'description' in data:
            somoim.description = data['description']
        if 'kakao_link' in data:
            somoim.kakao_link = data['kakao_link']
        if 'membership_type' in data:
            somoim.membership_type = data['membership_type']
        if 'monthly_fee' in data:
            somoim.monthly_fee = data['monthly_fee']
        if 'max_members' in data:
            somoim.max_members = data['max_members']
        if 'is_active' in data:
            somoim.is_active = data['is_active']
        
        somoim.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': f'{somoim.name} 모임 정보가 수정되었습니다.',
            'somoim': {
                'id': somoim.id,
                'name': somoim.name
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/somoims/<int:somoim_id>/members', methods=['GET'])
@admin_required
def get_somoim_members(current_user, somoim_id):
    """관리자: 모임 회원 목록 조회"""
    try:
        somoim = Somoim.query.get(somoim_id)
        if not somoim:
            return jsonify({'error': '모임을 찾을 수 없습니다.'}), 404
        
        members = SomoimMember.query.filter_by(somoim_id=somoim_id).all()
        result = []
        
        for member in members:
            user = User.query.get(member.user_id)
            result.append({
                'id': member.id,
                'user_id': user.id,
                'username': user.username,
                'email': user.email,
                'role': member.role,
                'status': member.status,
                'joined_at': member.joined_at.isoformat() if member.joined_at else None,
                'payment_status': member.payment_status,
                'last_payment_date': member.last_payment_date.isoformat() if member.last_payment_date else None
            })
        
        return jsonify({
            'somoim': {
                'id': somoim.id,
                'name': somoim.name
            },
            'members': result
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/somoims/<int:somoim_id>/prompts', methods=['GET'])
@admin_required
def get_somoim_prompts(current_user, somoim_id):
    """관리자: 모임에 할당된 프롬프트 목록"""
    try:
        somoim = Somoim.query.get(somoim_id)
        if not somoim:
            return jsonify({'error': '모임을 찾을 수 없습니다.'}), 404
        
        prompt_access = SomoimPromptAccess.query.filter_by(somoim_id=somoim_id).all()
        prompt_ids = [access.prompt_id for access in prompt_access]
        
        return jsonify({
            'somoim': {
                'id': somoim.id,
                'name': somoim.name
            },
            'assigned_prompt_ids': prompt_ids
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/somoims/<int:somoim_id>/prompts', methods=['POST'])
@admin_required
def assign_somoim_prompts(current_user, somoim_id):
    """관리자: 모임에 프롬프트 할당"""
    try:
        somoim = Somoim.query.get(somoim_id)
        if not somoim:
            return jsonify({'error': '모임을 찾을 수 없습니다.'}), 404
        
        data = request.get_json()
        prompt_ids = data.get('prompt_ids', [])
        
        # 기존 할당 삭제
        SomoimPromptAccess.query.filter_by(somoim_id=somoim_id).delete()
        
        # 새로운 할당 추가
        for prompt_id in prompt_ids:
            access = SomoimPromptAccess(
                somoim_id=somoim_id,
                prompt_id=prompt_id,
                granted_by_admin_id=current_user.id
            )
            db.session.add(access)
        
        db.session.commit()
        
        return jsonify({
            'message': f'{somoim.name} 모임에 {len(prompt_ids)}개의 프롬프트를 할당했습니다.',
            'assigned_prompt_ids': prompt_ids
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ==================== 사용자 모임 API ====================

@app.route('/api/user/my-somoims', methods=['GET'])
@token_required
def get_my_somoims(current_user):
    """사용자: 내가 가입한 모임 목록"""
    try:
        memberships = SomoimMember.query.filter_by(
            user_id=current_user.id,
            status='active'
        ).all()
        
        result = []
        for membership in memberships:
            somoim = Somoim.query.get(membership.somoim_id)
            if somoim and somoim.is_active:
                result.append({
                    'id': somoim.id,
                    'name': somoim.name,
                    'description': somoim.description,
                    'kakao_link': somoim.kakao_link,
                    'role': membership.role,
                    'joined_at': membership.joined_at.isoformat() if membership.joined_at else None
                })
        
        return jsonify({'somoims': result}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/somoim-prompts', methods=['GET'])
@token_required
def get_my_somoim_prompts(current_user):
    """사용자: 내 모임을 통해 접근 가능한 프롬프트 목록"""
    try:
        # 내가 가입한 모임 찾기
        memberships = SomoimMember.query.filter_by(
            user_id=current_user.id,
            status='active'
        ).all()
        
        somoim_ids = [m.somoim_id for m in memberships]
        
        # 모임별 프롬프트 접근 권한
        prompt_access = SomoimPromptAccess.query.filter(
            SomoimPromptAccess.somoim_id.in_(somoim_ids)
        ).all()
        
        # 중복 제거
        prompt_ids = list(set([access.prompt_id for access in prompt_access]))
        
        return jsonify({
            'prompt_ids': prompt_ids,
            'source': 'somoim'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
