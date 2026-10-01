"""Compare inline and attachment HTTP responses against the local contract fixture."""
import threading
import unittest
from http.server import ThreadingHTTPServer
from urllib.parse import quote, unquote, urlencode
from urllib.request import urlopen
from mock_download_server import Handler, NAMES


class DownloadContractTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
        cls.worker = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.worker.start()
        cls.origin = f'http://127.0.0.1:{cls.server.server_port}'

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.worker.join()

    def test_inline_vs_attachment(self):
        for name in NAMES + ["한글 + 공백 (1)'%.png"]:
            with self.subTest(name=name):
                key = 'blog/files/1700000000_0_' + name
                with urlopen(self.origin + '/objects?' + urlencode({'key': key})) as before:
                    self.assertIsNone(before.headers.get('Content-Disposition'))
                    before_type, before_body = before.headers['Content-Type'], before.read()
                with urlopen(self.origin + '/objects?' + urlencode({'key': key, 'download': 'true'})) as after:
                    header = after.headers['Content-Disposition']
                    self.assertEqual(header, "attachment; filename*=UTF-8''" + quote(name, safe=''))
                    self.assertEqual(unquote(header.split("''", 1)[1]), name)
                    self.assertEqual(after.headers['Content-Type'], before_type)
                    self.assertEqual(after.read(), before_body)
                print(f'{name}: inline -> attachment; filename/body preserved')


if __name__ == '__main__':
    unittest.main()
