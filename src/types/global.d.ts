// global.d.ts
interface Window {
  _: typeof _;
  laravel: {
    csrfToken: string;
    baseurl: string;
    apiVersion: string;
    appName: string;
    appurl: string;
  };
}

declare const laravel: {
  csrfToken: string;
  baseurl: string;
  apiVersion: string;
  appName: string;
  appurl: string;
};

declare const route: (name: string) => string;
