export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BROWSER: 'chrome' | 'firefox' | 'webkit';
      ENV: 'prod' | 'test';
      BASEURL: string;
      HEAD: 'true' | 'false';
    }
  }
}
