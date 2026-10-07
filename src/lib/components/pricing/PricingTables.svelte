<script lang="ts">
	import { marketingSteps, transactionalSteps } from '$lib/data/pricing';

	const lastMarketing = marketingSteps.length - 1;
</script>

<!--
	Every price on the page as plain tables, for agents and crawlers: the sliders only
	ever show one stop, and the Marketing tab is not in the prerendered HTML. Hidden for
	people, who get the same numbers from the sliders; read from the same data.
-->
<section hidden data-markdown="only">
	<h2>Transactional pricing by monthly emails</h2>
	<table>
		<thead>
			<tr><th>Emails per month</th><th>Plan</th><th>Price per month</th></tr>
		</thead>
		<tbody>
			{#each transactionalSteps as step}
				<tr><td>{step.volume}</td><td>{step.name}</td><td>{step.price}</td></tr>
			{/each}
		</tbody>
	</table>
	<p>Extra emails on Pro and Business cost $0.80 per 1,000.</p>

	<h2>Marketing pricing by contacts</h2>
	<table>
		<thead>
			<tr><th>Contacts</th><th>Price per month</th></tr>
		</thead>
		<tbody>
			{#each marketingSteps as step, i}
				<tr><td>{step.volume}</td><td>{i === lastMarketing ? 'Custom' : step.price}</td></tr>
			{/each}
		</tbody>
	</table>
</section>
