/// <reference types="vite/client" />

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

interface ImportMetaEnv {
  readonly VITE_API_HOST: string;
  // 다른 환경변수를 여기에 추가하세요
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
