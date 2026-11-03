import type { PageServerLoad } from "./$types";

import { highlightCode } from "$lib/server/highlight";

const webhookHandler = `return new class extends S3Handler
{
    public function handleS3(S3Event $event, Context $context): void
    {
        foreach ($event->getRecords() as $record) {
            app(ProcessWebhookBatch::class)(
                $record->getBucket()->getName(),
                urldecode($record->getObject()->getKey()),
            );
        }
    }
};`;

/** Highlights the post's code at prerender time, so the page ships no highlighter. */
export const load: PageServerLoad = async () => ({
  code: {
    webhookHandler: await highlightCode(webhookHandler, "php"),
  },
});
