import type { PageServerLoad } from "./$types";

import { createHighlighter } from "shiki";
import { lettrTheme } from "$lib/utils/shiki";
import {
  idempotentSyncSend,
  orderShippedDto,
  orderShippedMailable,
  shipOrderCall,
  smtpEnv,
  templateEnum,
} from "$lib/laravel/snippets";

const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Highlights the page's code at prerender time with the site's Shiki theme, so
 * the page ships coloured HTML lines and no highlighter.
 */
export const load: PageServerLoad = async () => {
  const highlighter = await createHighlighter({ themes: [lettrTheme], langs: ["php", "dotenv"] });

  const lines = (code: string, lang: "php" | "dotenv" = "php") => {
    // A PHP fragment without an opening tag is highlighted with one, then it is dropped.
    const fragment = lang === "php" && !code.startsWith("<?php");
    const tokens = highlighter.codeToTokensBase(fragment ? `<?php\n${code}` : code, {
      lang,
      theme: lettrTheme,
    });
    return (fragment ? tokens.slice(1) : tokens).map((line) =>
      line
        .map((token) => `<span style="color:${token.color}">${escape(token.content)}</span>`)
        .join(""),
    );
  };

  const highlighted = {
    mailable: lines(orderShippedMailable.code),
    call: lines(shipOrderCall.code),
    templateEnum: lines(templateEnum.code),
    dto: lines(orderShippedDto.code),
    syncSend: lines(idempotentSyncSend),
    smtpEnv: lines(smtpEnv, "dotenv"),
  };
  highlighter.dispose();

  return {
    highlighted,
    footerCta: {
      title: "Send your first email",
      accent: "from Laravel today.",
      description: "composer require lettr/lettr-laravel. Free for 3,000 emails a month.",
    },
  };
};
