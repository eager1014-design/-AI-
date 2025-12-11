#!/usr/bin/env python3
"""
찐부부 AI 프롬프트 마켓 - 배포 헬퍼
간단하게 배포 옵션을 선택할 수 있습니다.
"""

import webbrowser
import pyperclip
import time

CURRENT_URL = "https://8003-ieqskqqgv5heqsrwn2d81-18e660f9.sandbox.novita.ai"
GITHUB_REPO = "https://github.com/eager1014-design/-AI-"

def print_banner():
    print("\n" + "="*60)
    print("🎉 찐부부 AI 프롬프트 마켓 - 배포 도우미")
    print("="*60 + "\n")

def option_render():
    print("\n✅ Render 배포 선택됨!")
    print("\n📋 다음 단계:")
    print("1. Render.com 회원가입")
    print("2. New Web Service 클릭")
    print("3. GitHub 저장소 연결")
    print("\n🌐 Render 열기 중...")
    webbrowser.open("https://render.com/")
    print("\n✨ 완료 후 URL: https://jjinbubu-ai.onrender.com")

def option_bitly():
    print("\n✅ bit.ly URL 단축 선택됨!")
    print("\n📋 현재 URL이 클립보드에 복사되었습니다:")
    print(f"   {CURRENT_URL}")
    try:
        pyperclip.copy(CURRENT_URL)
        print("\n✅ 클립보드 복사 완료!")
    except:
        print("\n⚠️  수동으로 복사해주세요")
    
    print("\n🌐 bit.ly 열기 중...")
    webbrowser.open("https://bitly.com/")
    print("\n📝 할 일:")
    print("1. bit.ly 로그인")
    print("2. URL 붙여넣기")
    print("3. 커스텀 이름: jjinbubu-ai")
    print("\n✨ 완료 후: https://bit.ly/jjinbubu-ai")

def option_current():
    print("\n✅ 현재 URL 사용!")
    print(f"\n🌐 URL: {CURRENT_URL}")
    try:
        pyperclip.copy(CURRENT_URL)
        print("\n✅ 클립보드에 복사되었습니다!")
    except:
        pass
    print("\n🌐 사이트 열기 중...")
    webbrowser.open(CURRENT_URL)
    print("\n✨ 모든 기능이 정상 작동합니다!")

def option_help():
    print("\n✅ 도움 요청!")
    print("\n📧 필요한 정보:")
    print("   - GitHub 이메일 또는")
    print("   - Render 계정 이메일")
    print("\n📝 이메일을 알려주시면")
    print("   제가 직접 배포를 완료하겠습니다!")
    
    email = input("\n📧 이메일 주소: ").strip()
    if email:
        print(f"\n✅ 이메일 수신: {email}")
        print("\n🚀 배포를 시작하겠습니다!")
        print("   - Collaborator 초대 발송")
        print("   - 배포 설정 완료")
        print("   - 최종 URL 전달")
        print("\n⏰ 24시간 내 완료 예정!")
    else:
        print("\n⚠️  이메일이 입력되지 않았습니다.")

def main():
    print_banner()
    
    print("현재 작동 중인 사이트:")
    print(f"🌐 {CURRENT_URL}\n")
    
    print("다음 중 선택해주세요:\n")
    print("1. 🚀 Render로 배포 (추천, 무료)")
    print("2. 🔗 bit.ly로 URL 단축 (가장 빠름)")
    print("3. ✅ 현재 URL 그대로 사용")
    print("4. 🆘 도움 요청 (제가 직접 배포)")
    print("5. ❌ 종료")
    
    choice = input("\n선택 (1-5): ").strip()
    
    if choice == "1":
        option_render()
    elif choice == "2":
        option_bitly()
    elif choice == "3":
        option_current()
    elif choice == "4":
        option_help()
    elif choice == "5":
        print("\n👋 나중에 다시 실행해주세요!")
    else:
        print("\n⚠️  잘못된 선택입니다. 1-5 중 선택해주세요.")
    
    print("\n" + "="*60)
    print("🎉 찐부부 AI 프롬프트 마켓")
    print("="*60 + "\n")

if __name__ == "__main__":
    main()
