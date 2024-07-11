React와 Nextjs를 활용한 커뮤니티 게시판입니다.

회원가입, 로그인, 로그아웃, 세션 관리, 게시글 crud, 댓글 crud, 페이지네이션이 구현되어 있습니다.

React Query를 활용하여 데이터 페칭과 상태관리를 구현하였습니다.

---

React 상태 관리와 폼 처리 구현

Next.js 파일 기반 라우팅 및 서버/클라이언트 컴포넌트 분리

TypeScript 사용으로 타입 안정성 확보

Tailwind CSS 반응형 레이아웃 구현

NextAuth 인증 관련 로직 개발

Vercel-postgres 데이터베이스 구현 및 연동

---

폴더 구조

📦src

 ┣ 📂app
 
 ┃ ┣ 📂api
 
 ┃ ┃ ┗ 📂auth
 
 ┃ ┃ ┃ ┗ 📂[...nextauth]      --> NextAuth.js를 이용한 인증 관련 API 라우트
 
 ┃ ┣ 📂components              --> UI, Provider 등 components 모음
 
 ┃ ┣ 📂lib                    --> 서버 사이드 로직 모음
 
 ┃ ┣ 📂login
 
 ┃ ┣ 📂posts
 
 ┃ ┃ ┣ 📂create
 
 ┃ ┃ ┣ 📂[id]
 
 ┃ ┃ ┃ ┣ 📂edit
 
 ┃ ┣ 📂signup
 
 ┃ ┣ 📜globals.css
 
 ┃ ┣ 📜layout.tsx
 
 ┃ ┗ 📜page.tsx
 
 ┣ 📂types                     --> 데이터 모델 인터페이스 정의 + typescript
 
 ┣ 📂utils
 
 ┣ 📜auth.ts                  --> NextAuth.js를 이용한 세션 관리 설정
 
 ┗ 📜db.ts                   --> 데이터베이스 sql문 설정

---

홈페이지 (조회수 순 인기글 목록)

![스크린샷 2024-07-12 025150](https://github.com/user-attachments/assets/aae8e066-7c4b-4f91-9895-5760a4289091)

모바일

![스크린샷 2024-07-12 025053](https://github.com/user-attachments/assets/bcd453f7-2a94-422b-b544-cbccf2d38993)
![스크린샷 2024-07-12 025057](https://github.com/user-attachments/assets/b9164aba-4b9d-43d9-933e-a9b3a370d342)

회원가입 - 로그인

![스크린샷 2024-07-12 040000](https://github.com/user-attachments/assets/6b11d3a8-982d-4873-ac28-679b062f8a5a)
![스크린샷 2024-07-12 040112](https://github.com/user-attachments/assets/6eca657d-2d85-49d0-a5a5-5be6c2ea51a1)
![스크린샷 2024-07-12 040122](https://github.com/user-attachments/assets/36193b4f-33cc-4b29-b498-24385ddfd6cd)
![스크린샷 2024-07-12 040133](https://github.com/user-attachments/assets/f31848d8-5fb5-4cee-b194-a30442da170b)
![스크린샷 2024-07-12 040144](https://github.com/user-attachments/assets/8426cfe1-852d-4cac-80a2-bd22078f10c7)
![스크린샷 2024-07-12 025441](https://github.com/user-attachments/assets/9f86932f-73d0-4d39-907f-359bb51376a3)


게시판 글작성

![스크린샷 2024-07-12 025644](https://github.com/user-attachments/assets/c45b08f5-1603-4373-9e7b-30cb1c4ccb93)
![스크린샷 2024-07-12 040308](https://github.com/user-attachments/assets/62a76deb-965c-462c-bf81-bf2444b9c9af)
![스크린샷 2024-07-12 040318](https://github.com/user-attachments/assets/d8106aea-3bb0-4150-8dd4-c7daaff56cc9)
![스크린샷 2024-07-12 040325](https://github.com/user-attachments/assets/3ef5a1f9-29b9-4288-b51c-cc6d5dbe3965)

게시글

![스크린샷 2024-07-12 025515](https://github.com/user-attachments/assets/2cd25f51-afa8-48a6-b6f1-8b63b2b24608)

댓글수정

![스크린샷 2024-07-12 035708](https://github.com/user-attachments/assets/97e60599-d3f9-4800-98e2-f1bf7d8c6724)
![스크린샷 2024-07-12 035714](https://github.com/user-attachments/assets/03717731-ff85-4bbd-9b3f-ebdf1dc58521)
![스크린샷 2024-07-12 035734](https://github.com/user-attachments/assets/1cd74e19-1e3a-4501-910c-39ab6c7a5c2f)
![스크린샷 2024-07-12 035739](https://github.com/user-attachments/assets/f53484df-839b-44a4-86ac-6f5690991a62)

글 삭제

![스크린샷 2024-07-12 025644](https://github.com/user-attachments/assets/c45b08f5-1603-4373-9e7b-30cb1c4ccb93)
![스크린샷 2024-07-12 035341](https://github.com/user-attachments/assets/15653237-3bf0-47e0-8e02-11daf12826b6)
![스크린샷 2024-07-12 035410](https://github.com/user-attachments/assets/4f3be5b8-9cb8-4a62-8d05-0d388eebf026)
![스크린샷 2024-07-12 035436](https://github.com/user-attachments/assets/e3df5934-37c5-4574-b656-8445d5fa1b21)


