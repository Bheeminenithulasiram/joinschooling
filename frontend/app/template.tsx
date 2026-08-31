import GlobalErrorHandler from "./GlobalErrorHandler";

/**
 * `template.tsx` sits between `layout.tsx` and `page.tsx` and is re-mounted on
 * every navigation. Ideal spot to attach the global error handler without
 * modifying the root layout.
 */
export default function RootTemplate({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GlobalErrorHandler />
      {children}
    </>
  );
}
