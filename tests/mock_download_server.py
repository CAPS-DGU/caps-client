"""Local API/S3 contract fixture; never contacts the production API or bucket."""
import base64
import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, quote, urlencode, urlsplit

PNG = base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=')
NAMES = ['한글 사진.png', '행사 영상.mp4', '정산 자료.xlsx']
REQUESTS = []


def disposition(key):
    import re
    name = re.sub(r'^\d+_\d+_', '', key.rsplit('/', 1)[-1])
    return "attachment; filename*=UTF-8''" + quote(name, safe='')


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *_):
        pass

    def send(self, body, content_type='application/json', status=200, headers=None):
        self.send_response(status)
        self.send_header('Content-Type', content_type)
        self.send_header('Access-Control-Allow-Origin', 'http://127.0.0.1:4177')
        self.send_header('Access-Control-Allow-Credentials', 'true')
        for name, value in (headers or {}).items():
            self.send_header(name, value)
        self.end_headers()
        self.wfile.write(body if isinstance(body, bytes) else json.dumps(body, ensure_ascii=False).encode())

    def do_OPTIONS(self):
        self.send(b'', headers={'Access-Control-Allow-Headers': 'Content-Type, Accept', 'Access-Control-Allow-Methods': 'GET, OPTIONS'})

    def do_GET(self):
        url = urlsplit(self.path)
        query = parse_qs(url.query)
        if url.path == '/health':
            return self.send({'ok': True})
        if url.path == '/__requests':
            return self.send(REQUESTS)
        if url.path == '/api/v1/members/me':
            return self.send({'data': {'id': 1, 'name': '테스트', 'grade': '40', 'role': 'MEMBER', 'registrationComplete': True}})
        if url.path == '/api/v1/blogs':
            return self.send({'data': {'content': [{'id': 1, 'title': '첨부파일 테스트', 'thumbnailUrl': 'blog/images/thumbnail.png', 'category': 'TECH'}], 'totalPages': 1}})
        if url.path in ['/api/v1/blogs/1', '/api/v1/ledgers/1']:
            prefix = 'blog/files' if 'blogs' in url.path else 'ledger/1'
            return self.send({'data': {'id': 1, 'title': '첨부파일 테스트', 'content': '![본문 이미지](blog/images/body.png)',
                'category': 'TECH', 'thumbnailUrl': 'blog/images/thumbnail.png', 'imageUrls': [],
                'fileUrls': [f'{prefix}/1700000000_{i}_{name}' for i, name in enumerate(NAMES)],
                'member': {'id': 1, 'name': '테스트', 'grade': 40}, 'createdAt': '2026-10-01T00:00:00Z'}})
        if url.path in ['/api/v1/files/blog/presigned-url', '/api/v1/files/presigned-url']:
            REQUESTS.append({'path': url.path, 'query': query})
            return self.send({'data': {'downloadURL': 'http://127.0.0.1:4178/objects?' + urlencode({k: v[0] for k, v in query.items()})}})
        if url.path == '/objects':
            key = query.get('key', [''])[0]
            ext = key.rsplit('.', 1)[-1]
            mime = {'png': 'image/png', 'mp4': 'video/mp4', 'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}.get(ext, 'application/octet-stream')
            headers = {'Content-Disposition': disposition(key)} if query.get('download') == ['true'] else {}
            return self.send(PNG if ext == 'png' else b'attachment-test-bytes', mime, headers=headers)
        return self.send({'data': []})


if __name__ == '__main__':
    ThreadingHTTPServer(('127.0.0.1', 4178), Handler).serve_forever()
