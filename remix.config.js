/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ['**/.*'],
  serverModuleFormat: 'esm',
  future: {
    v2_errorBoundary: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_headers: true,
  },
  serverBuildPath: 'build/index.js',
  server: './server.ts',
  appDirectory: 'app',
  dev: {
    port: 5173,
  },
  serverDependenciesToBundle: [/^@huggingface\/.*/, 'tensorblock/Smaug-Llama-3-70B-Instruct-32K-GGUF'],
};
