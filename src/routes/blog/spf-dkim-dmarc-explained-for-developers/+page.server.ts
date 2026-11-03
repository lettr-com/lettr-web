import type { PageServerLoad } from "./$types";

import { highlightCode } from "$lib/server/highlight";

const spfDig = `dig TXT yourapp.com +short`;

const dkimDig = `dig TXT lettr._domainkey.yourapp.com +short`;

const verifyDig = `# Check SPF
dig TXT yourapp.com +short | grep spf

# Check DKIM (replace 'lettr' with your selector)
dig TXT lettr._domainkey.yourapp.com +short

# Check DMARC
dig TXT _dmarc.yourapp.com +short`;

/** Highlights the post's code at prerender time, so the page ships no highlighter. */
export const load: PageServerLoad = async () => ({
  code: {
    spfDig: await highlightCode(spfDig, "bash"),
    dkimDig: await highlightCode(dkimDig, "bash"),
    verifyDig: await highlightCode(verifyDig, "bash"),
  },
});
