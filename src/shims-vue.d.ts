declare module '*.vue' {
  import type { DefineComponent } from 'vue'; // eslint-disable-line
  const component: DefineComponent<{}, {}, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  export default component;
}
