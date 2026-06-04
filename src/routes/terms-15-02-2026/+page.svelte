<script lang="ts">
	import LegalDocumentPage from '$lib/components/LegalDocumentPage.svelte';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<LegalDocumentPage document={data.document} links={data.links} />
