# 첨부파일 다운로드 회귀 테스트

```sh
npm ci
npx playwright install chromium
python -X utf8 tests/test_download_contract.py
npm run test:downloads
```

Python 모의 API/S3 서버와 로컬 프로덕션 빌드에서 실행합니다. 운영 API나 S3에는 접속하지 않습니다.

- PC·모바일의 블로그/장부 PNG·MP4·XLSX 다운로드 이벤트, 원래 한글 파일명, 파일 바이트를 검증합니다.
- 썸네일과 본문 이미지는 download 옵션 없이 렌더링하는지 검사합니다.
- URL 발급 실패 안내와 재시도를 확인합니다.
- Python HTTP 검증은 옵션 전후의 Content-Disposition 차이와 한글·특수문자 파일명 보존을 비교합니다.

백엔드 CAPS-DGU/caps-server#87의 download 옵션과 attachment 응답이 배포되어야 실제 S3에서도 다운로드됩니다.
외부 절대 URL은 기존대로 직접 사용하며, 해당 외부 서버의 응답 헤더까지 변경하지 않습니다.
