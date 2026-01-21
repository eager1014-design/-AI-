#!/usr/bin/env python3
import http.server
import socketserver
import json
import os
from urllib.parse import urlparse, parse_qs

PORT = 8003

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # 정적 파일 제공
        return http.server.SimpleHTTPRequestHandler.do_GET(self)
    
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode('utf-8'))
        except:
            data = {}
        
        path = self.path
        
        # API 라우팅 (더미 응답)
        if path == '/api/register':
            self.send_json_response({
                'success': True,
                'message': '회원가입이 완료되었습니다!',
                'token': 'fake_token_' + str(hash(data.get('email', ''))),
                'user': {
                    'id': 1,
                    'email': data.get('email'),
                    'username': data.get('username'),
                    'is_member': data.get('is_member', False),
                    'is_admin': False
                }
            })
        elif path == '/api/login':
            self.send_json_response({
                'success': True,
                'message': '로그인 성공!',
                'token': 'fake_token_' + str(hash(data.get('email', ''))),
                'user': {
                    'id': 1,
                    'email': data.get('email'),
                    'username': '사용자',
                    'is_member': True,
                    'is_admin': data.get('email') == 'admin@jinbubu.com'
                }
            })
        else:
            self.send_json_response({'success': False, 'message': '알 수 없는 API'})
    
    def send_json_response(self, data):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))
    
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Expires', '0')
        return super().end_headers()

os.chdir('/home/user/webapp')

with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print(f"✅ 서버 시작: http://localhost:{PORT}")
    print(f"📂 루트 디렉토리: /home/user/webapp")
    httpd.serve_forever()
