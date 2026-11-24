import type { PageServerLoad } from "./$types";
import { highlightCode } from "$lib/server/highlight";

const smtpSettings = `SMTP_HOST=smtp.lettr.com
SMTP_PORT=587            # STARTTLS; 465 for implicit TLS
SMTP_USERNAME=lettr
SMTP_PASSWORD=lttr_...   # your Lettr API key`;

export const load: PageServerLoad = async () => ({
  code: { smtpSettings: await highlightCode(smtpSettings, "bash") },
});
