<script lang="ts">
	import {
		BlogPost,
		Lead,
		Heading,
		Paragraph,
		List,
		TldrList,
		Callout,
		Code,
		Faq,
		FaqItem
	} from '$lib/components/blog';

	const topolServerless = `service: topol-app

provider:
    name: aws
    region: eu-west-1
    runtime: provided.al2

functions:
    app:
        handler: public/index.php
        timeout: 28 # API Gateway has a timeout of 29 seconds
        memorySize: 2048
        layers:
            - \${bref:layer.php-80-fpm}
        events:
            -   httpApi: '*'

package:
    exclude:
        - .ebextensions/**
        - node_modules/**
        - storage/**
        - tests/**

plugins:
    - ./vendor/bref/bref
    - ./vendor/bref/extra-php-extensions`;

	const lettrServerless = `provider:
    iam:
        role:
            statements:         # the execution role is the only AWS credential the app has
                - Effect: Allow
                  Action: [dynamodb:GetItem, dynamodb:PutItem, dynamodb:Query]
                  Resource: arn:aws:dynamodb:<region>:<account>:table/<table>
                - Effect: Allow
                  Action: [sqs:SendMessage, sqs:DeleteMessage]
                  Resource: arn:aws:sqs:<region>:<account>:<queue>
                # ... one statement per table, bucket and queue the app touches

functions:
    web:
        handler: public/index.php
        runtime: php-85-fpm
        events:
            - httpApi: '*'

    api:                        # same code, separate Lambda, scales on its own
        handler: public/index.php
        runtime: php-85-fpm
        events:
            - httpApi: { path: '/api/{proxy+}', method: '*' }

    <name>-queue:
        handler: Bref\\LaravelBridge\\Queue\\QueueHandler
        runtime: php-85
        events:
            - sqs: { arn: arn:aws:sqs:<region>:<account>:<queue>, batchSize: 1 }
    # ... one function per queue, each with its own timeout and memory

    webhook-processor:
        handler: handlers/webhooks.php
        runtime: php-85
        events:
            - s3: { bucket: <webhooks-bucket>, event: 's3:ObjectCreated:*' }

    artisan:
        handler: artisan
        runtime: php-85-console
        events:
            - schedule: { rate: rate(1 minute), input: '"schedule:run"' }`;

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
</script>

<BlogPost
	category="Engineering"
	title="Why Lettr runs on AWS Lambda with Bref"
	excerpt="Why Lettr, a Laravel application, runs on AWS Lambda through Bref: the PHP runtimes and single-file deployment Bref provides, how Lettr's serverless.yml splits HTTP, queues, S3 events, and the scheduler into separate functions with no AWS keys anywhere, the Lambda limits we hit, and why Matthieu Napoli deserves the credit."
	metaDescription="Lettr is a Laravel application with no server. It runs on AWS Lambda through Bref, the open-source project Matthieu Napoli writes and maintains."
	author={{ name: 'Jakub Gause', role: 'CEO', avatar: '/images/authors/jakub.jpg' }}
	date="September 4, 2026"
	datetime="2026-09-04"
	readTime="6 min read"
	slug="why-lettr-runs-on-lambda-with-bref"
>
	<Lead>
		Lettr, our email API, is a Laravel application that has never had a server. Every HTTP request,
		queue job, cron run, and webhook is an AWS Lambda invocation, and what makes a Laravel app run
		on Lambda at all is <a href="https://bref.sh/">Bref</a>, an open-source project by
		<a href="https://github.com/mnapoli">Matthieu Napoli</a>. We first chose Bref for our email
		editor, <a href="https://topol.io">Topol</a>, in August 2022, two and a half years before Laravel
		Cloud existed. When we started building Lettr in December 2025, Bref was the obvious choice.
		This article covers what Bref does for us, where Lambda's limits are, and why Matthieu deserves
		the credit.
	</Lead>

	<Callout variant="info" title="TL;DR">
		<TldrList>
			<li>
				<strong>Bref's core contribution is the PHP runtimes for Lambda</strong>, published for
				every PHP version in every region. Everything else is one <code>serverless.yml</code> that
				compiles to standard CloudFormation.
			</li>
			<li>
				<strong>Lettr is a handful of Lambda functions</strong> from one codebase: three FPM
				functions for HTTP, one function per SQS queue, an S3 handler for webhooks, and a console
				function for the scheduler. No AWS key exists anywhere.
			</li>
			<li>
				<strong>The bet has held since 2022</strong> through three PHP versions, three Bref major
				versions, and a second product. The only non-Lambda piece of Lettr is the SMTP endpoint,
				because Lambda cannot hold a TCP connection open.
			</li>
		</TldrList>
	</Callout>

	<Heading level={2}>A 40-line file from August 2022</Heading>

	<Paragraph>
		This is the first <code>serverless.yml</code> we ever committed, on 29 August 2022, in the Topol
		repository:
	</Paragraph>

	<Code lang="text" filename="serverless.yml" code={topolServerless} />

	<Paragraph>
		The <code>.ebextensions/**</code> exclusion in this file is a leftover from what Bref replaced.
		Topol had run on <strong>AWS Elastic Beanstalk since 2017</strong>: EC2 instances, an Apache
		config in the repository, deploy hooks to keep storage writable, and instances that needed
		patching. Bref 1.7 on PHP 8.0 replaced all of this with one function and one file. We spent the
		following month moving secrets to Parameter Store, adding a GD layer, and trying PHP 8.1. We
		deleted the Elastic Beanstalk folder in November 2022, and the Topol app has not had a server to
		patch since.
	</Paragraph>

	<Paragraph>
		As of September 2026, this file is 251 lines across 126 commits. It runs PHP 8.4, SQS-driven
		queue workers, and a long list of scheduled commands. Bref has gone from 1.7 to 2 underneath.
		Lettr started on Bref 2 and moved to Bref 3 in March 2026, and
		<strong>that upgrade was a 28-line diff</strong> to <code>serverless.yml</code>:
		<code>layers: [$&lbrace;bref:layer.php-84-fpm&rbrace;]</code> became
		<code>runtime: php-84-fpm</code>. Three years and three major versions later, the whole
		deployment is still a single file the team can read.
	</Paragraph>

	<Heading level={2}>What Bref does</Heading>

	<Paragraph>
		Lambda does not run PHP. Bref's core contribution is a set of <strong>open-source PHP runtimes
		for Lambda</strong>, built and published for every supported PHP version in every AWS region and
		kept current with PHP releases. Lettr runs on PHP 8.5. The runtime was published before we
		needed it, and the upgrade was <code>runtime: php-85-fpm</code>. Building and maintaining these
		runtimes is the expensive part of running PHP on Lambda, and it is the part no team wants to
		take on themselves.
	</Paragraph>

	<Paragraph>On top of the runtimes, Bref adds:</Paragraph>

	<List>
		<li>
			<strong>One file for the whole deployment.</strong> A single <code>serverless.yml</code>
			covers functions, events, memory, timeouts, IAM, and environment variables.
			<code>serverless deploy</code> turns it into CloudFormation, so anything AWS can do, the file
			can do too.
		</li>
		<li>
			<strong>Per-function scaling.</strong> Each entry under <code>functions:</code> scales
			independently. Our API and our web UI are the same <code>public/index.php</code>, deployed
			twice with different memory, because they have different traffic.
		</li>
		<li>
			<strong>Pay per invocation.</strong> There is no idle capacity, so a queue that receives no
			messages overnight costs nothing overnight.
		</li>
		<li>
			<strong>A Laravel bridge</strong> that handles what Laravel assumes about a filesystem: caches
			written under <code>/tmp</code>, compiled views, logs sent to <code>stderr</code> so they land
			in CloudWatch, sessions and cache stored in DynamoDB, and a ready-made SQS handler for the
			queue worker.
		</li>
		<li>
			<strong>Lift</strong>, the companion plugin that builds the S3 bucket and CloudFront
			distribution for static assets from a few lines of config.
		</li>
	</List>

	<Paragraph>
		None of this is proprietary. The runtimes are public, the code is on GitHub, and the output is
		standard CloudFormation.
	</Paragraph>

	<Heading level={2}>How Lettr uses Bref</Heading>

	<Paragraph>
		Lettr's <code>serverless.yml</code> follows the same pattern as Topol's, with more functions.
		Here is a trimmed version, with names generalised:
	</Paragraph>

	<Code lang="text" filename="serverless.yml" code={lettrServerless} />

	<Paragraph>
		<strong>HTTP.</strong> Three FPM functions run the same Laravel codebase: <code>web</code> for
		the Inertia app, <code>api</code> for the REST API, and <code>mcp</code> for the
		<a href="/blog/managing-lettr-from-your-ai-assistant/">MCP server</a>, which gets its own Lambda
		so the Passport keys it needs never reach the other two.
	</Paragraph>

	<Paragraph>
		<strong>Queues.</strong> Each SQS queue is a separate Lambda with its own timeout and memory.
		Campaign sends, audience exports, and the AI assistant's long-running template generation all
		have their own, so a slow job never delays a fast one. SQS invokes the Bref queue handler
		directly, so there is no worker process to supervise and no Horizon dashboard to watch. Every
		job is one Lambda invocation with its own log stream, and a campaign to a large audience runs
		across many workers at once.
	</Paragraph>

	<Paragraph>
		<strong>Events.</strong> Delivery webhooks land in S3 as batches, and S3 fires a Lambda for each
		object. The handler is forty lines:
	</Paragraph>

	<Code lang="php" filename="handlers/webhooks.php" code={webhookHandler} />

	<Paragraph>
		<strong>Scheduler.</strong> One console function runs <code>schedule:run</code> every minute,
		and Laravel's scheduler decides what is due. Topol's <code>serverless.yml</code> listed each cron
		entry separately; Lettr's needs one line.
	</Paragraph>

	<Paragraph>
		<strong>Everything else.</strong> Sessions and cache live in DynamoDB. Secrets are
		<code>$&lbrace;ssm:/...&rbrace;</code> references resolved at deploy time, so no secret is ever
		in the repository or the CI log. Lift builds the CloudFront distribution in front of
		<code>assets.lettr.com</code>.
	</Paragraph>

	<Paragraph>
		<strong>No AWS keys anywhere.</strong> Every DynamoDB table, S3 bucket, and SQS queue the
		application touches is granted through the function's own IAM role, declared in the
		<code>iam</code> block of <code>serverless.yml</code>, so the AWS SDK authenticates with the
		Lambda execution role. The same applies to deployment: a GitHub Actions job runs
		<code>serverless deploy</code> on every push to <code>main</code>, after the test suite, by
		assuming a role through OIDC. No long-lived AWS credential exists in the repository, in CI
		secrets, or in the Lambda environment.
	</Paragraph>

	<Heading level={2}>What Bref does not do</Heading>

	<Paragraph>
		Bref's documentation states Lambda's limits up front, and we hit the real ones.
	</Paragraph>

	<Paragraph>
		<strong>28 seconds per HTTP request.</strong> API Gateway cuts off at 29 seconds. Our AI
		assistant's chat turn originally ran inside the request and regularly outlived it, so it now
		runs on a long-timeout queue and the browser receives the result over a broadcast.
	</Paragraph>

	<Paragraph>
		<strong>4 KB of environment variables per function.</strong> Lambda merges provider-level and
		function-level environment variables and caps the total. Adding one token pushed a queue
		function 69 bytes over the limit. The fix was deleting variables that matched their config
		defaults, which we should have done anyway.
	</Paragraph>

	<Paragraph>
		<strong>No GD in the base runtime.</strong> Our brand-kit pipeline measures logo luminance and
		generates a light/dark twin. Without the GD image library it skipped both, and a white logo
		published white on white. <code>bref/extra-php-extensions</code> provides the layer; the
		diagnosis took longer than the fix.
	</Paragraph>

	<Paragraph>
		<strong>15 minutes per invocation, and no long-lived connections.</strong> Lettr's SMTP endpoint
		holds TCP connections open, which Lambda cannot do. This service is a small Go program on ECS,
		and it is the only piece of Lettr that is not a Lambda function.
	</Paragraph>

	<Callout variant="info" title="Sending through Lettr from Laravel">
		The REST API and the SMTP endpoint are both open to any Laravel application. The
		<a href="https://docs.lettr.com/quickstart/laravel/introduction">Laravel quickstart</a> covers
		the SDK, which registers as a native mail transport, and the
		<a href="https://docs.lettr.com/quickstart/smtp/laravel">SMTP quickstart</a> covers the
		credential swap for applications that already send over SMTP.
	</Callout>

	<Heading level={2}>Thank you, Matthieu Napoli</Heading>

	<Paragraph>
		Bref is written and maintained by
		<a href="https://github.com/mnapoli">Matthieu Napoli</a>, who funds the work through GitHub
		Sponsors. He also maintains
		<a href="https://github.com/oss-serverless/osls">oss-serverless</a>, the open-source
		continuation of the Serverless Framework CLI after version 4 moved to a commercial licence,
		which is why our deploy step still runs <code>serverless deploy</code> without a subscription.
		Other contributors like <a href="https://github.com/deleugpn">Marco Deleu</a> and
		<a href="https://github.com/t-richard">Thomas Richard</a> have also carried significant parts of
		the work.
	</Paragraph>

	<Paragraph>
		We have built two commercial products on Bref, one of them since 2022. Every PHP release we
		wanted has had a runtime ready, and every major upgrade has been boring. This is what
		<strong>good open-source maintenance</strong> looks like from the outside. For a company that
		runs PHP on Lambda, <a href="https://github.com/sponsors/mnapoli">sponsoring Matthieu</a> is a
		small line next to the AWS bill.
	</Paragraph>

	<Heading level={2}>FAQ</Heading>

	<Faq>
		<FaqItem question="Why Bref and not Laravel Vapor or Laravel Cloud?">
			<strong>Bref keeps the deployment as a plain file in the repository, on standard
			CloudFormation, with nothing between us and AWS.</strong> When Topol moved in 2022, Laravel
			Cloud was still two and a half years away, and Vapor existed but did not give us that. After
			Laravel Cloud launched we started Lettr and chose Bref almost immediately.
		</FaqItem>

		<FaqItem question="Does cold start matter for an email API?">
			<strong>Rarely.</strong> Bref's published figures put cold starts under 0.5% of invocations,
			and a warm invocation adds a few milliseconds of overhead. Sending email is asynchronous by
			nature: the API accepts the message and the queue does the rest.
		</FaqItem>

		<FaqItem question="What does it cost?">
			<strong>Lambda bills per invocation and per millisecond, SQS per message, and DynamoDB per
			request.</strong> There is no reserved capacity and no instance to size. The AWS free tier
			covers roughly a million Lambda requests a month, which is enough to run a serious side
			project for nothing.
		</FaqItem>

		<FaqItem question="Can I run my Laravel app on Lambda with Bref?">
			<strong>Almost certainly.</strong> If it runs on a traditional server, the
			<a href="https://bref.sh/docs/laravel/getting-started">Bref Laravel guide</a> covers the
			whole setup. The things that will not work are long-running processes and anything that
			writes outside <code>/tmp</code>, and Bref's documentation lists them up front.
		</FaqItem>
	</Faq>

	<Heading level={2}>Bottom line</Heading>

	<Paragraph>
		Bref turned running Laravel on Lambda <strong>from a project into a deployment target</strong>.
		We made this bet for Topol in 2022 with a 40-line file, and it has held through three PHP
		versions, three Bref major versions, and a second product. Lettr's infrastructure is one YAML
		file, a queue handler, and an S3 event, and none of it is a server anyone has to maintain.
	</Paragraph>

	<Paragraph>
		For a Laravel application that sends email,
		<a href="https://app.lettr.com/register">create a free Lettr account</a> and start with the
		<a href="https://docs.lettr.com/quickstart/laravel/introduction">Laravel quickstart</a>.
	</Paragraph>
</BlogPost>
