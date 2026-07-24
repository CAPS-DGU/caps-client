import React, { useEffect, useState } from "react";
import { isAbsoluteUrl, resolveBlogFileUrl } from "../../utils/blogFiles";

interface BlogImageProps {
  src?: string | null;
  alt?: string;
  className?: string;
  /** src 가 없거나 불러오지 못했을 때 대신 보여줄 내용 */
  fallback?: React.ReactNode;
}

/** 저장된 값이 S3 key 든 완전한 URL 이든 동일하게 이미지를 그려준다. */
const BlogImage: React.FC<BlogImageProps> = ({ src, alt, className, fallback = null }) => {
  const [resolved, setResolved] = useState<string | null>(isAbsoluteUrl(src) ? src! : null);
  const [failed, setFailed] = useState<boolean>(false);

  useEffect(() => {
    let ignore = false;
    setFailed(false);

    if (!src) {
      setResolved(null);
      return;
    }
    if (isAbsoluteUrl(src)) {
      setResolved(src);
      return;
    }

    setResolved(null);
    resolveBlogFileUrl(src)
      .then((url) => {
        if (!ignore) setResolved(url);
      })
      .catch((e) => {
        console.error("블로그 이미지 주소 변환 실패:", e);
        if (!ignore) setFailed(true);
      });

    return () => {
      ignore = true;
    };
  }, [src]);

  if (!src || failed) return <>{fallback}</>;
  if (!resolved) return <div className={`${className ?? ""} animate-pulse bg-gray-100`} />;

  return (
    <img src={resolved} alt={alt} className={className} onError={() => setFailed(true)} />
  );
};

export default BlogImage;
