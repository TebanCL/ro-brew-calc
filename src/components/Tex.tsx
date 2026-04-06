import katex from "katex";

export const Tex = ({ tex, display = false }: { tex: string; display?: boolean }) => (
  <span dangerouslySetInnerHTML={{ __html: katex.renderToString(tex, { throwOnError: false, displayMode: display }) }} />
);
