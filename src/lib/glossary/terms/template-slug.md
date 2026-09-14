---
term: Template Slug
question: What is
description: "A template slug is the stable, URL-safe identifier your code uses to send a Lettr template. How slugs are formed and why they beat numeric IDs."
related: [template-version, project, premade-template, merge-tag]
reading:
  - title: Templates Introduction
    href: https://docs.lettr.com/learn/templates/introduction
  - title: Type-safe templates in Laravel
    href: https://docs.lettr.com/quickstart/laravel/type-safety
---

**A template slug** is a short, human-readable identifier for an email template, such as `password-reset` or `order-confirmation`. Application code names the slug when it sends an email and the email platform supplies the stored design, so the HTML never has to live in the codebase. The slug stays the same when the template's name or content changes, which makes it a stable reference between code and content.

## How template slugs work

A slug is written in lowercase, with words joined by hyphens and no spaces or special characters, which keeps it safe in URLs, JSON payloads and configuration files. **It is typically derived from the template name** when the template is created, so a template called "Welcome Email" gets the slug `welcome-email`. From then on the slug is independent of the name, and renaming the template does not break code that sends it.

A slug has to be unique inside the container that holds the template. Where templates are grouped into a [project](/glossary/project/), two projects can each hold a `welcome-email` template, and the send request identifies the project to say which one it means.

## Why slugs instead of numeric IDs

**A slug carries meaning that a numeric ID does not.** A line of code that sends `password-reset` explains itself in a code review, and a log entry showing `order-confirmation` can be read without looking anything up. A template ID such as `48213` says nothing about the email behind it.

Slugs also decouple application code from the platform's database. An ID is assigned by whichever database stores the template, so the same email can carry different IDs in staging and production, or a new ID after it is recreated. A slug is part of the template's definition, so a template recreated under the same slug in another environment works with the same code and configuration.

The format helps too. Because a slug contains only lowercase letters, digits and hyphens, it needs no escaping in a URL path, an environment variable or a YAML file, and it survives copying between tools unchanged.

## Best practices for template slugs

**Name a slug for the job the email does**, not for a campaign or a date. `password-reset` still describes the template years later, while `spring-promo-v2` stops making sense once the promotion ends. For transactional mail, one slug per intent keeps the mapping clear: a single `order-confirmation` template instead of several near-copies that code has to choose between.

A slug that production code sends should be treated as fixed. Renaming it breaks every integration that still uses the old value, and the failure only surfaces when that particular email is sent. Content changes belong in a new [template version](/glossary/template-version/), which updates what recipients see while the identifier stays put.

Per-recipient details belong in the send data. Names, order numbers and links fill [merge tags](/glossary/merge-tag/) at send time, so one template and one slug serve every recipient.

## Template slug in Lettr

Every Lettr template has a unique slug that API calls use to reference it. **Slugs are auto-generated from template names and can be customized**, and they must be unique within a project. A send request to `POST /api/emails` names the template in the `template_slug` field, for example `"template_slug": "welcome-email"`.

When a request carries `template_slug`, Lettr renders the template's active version, and any inline `html` in the same request is ignored entirely rather than used as a fallback. The optional `template_version` field selects a specific version number, and `project_id` selects the project; without it Lettr uses the team's default project. The `subject` always comes from the request, because templates do not provide a fallback subject.

The Laravel SDK adds type safety on top of slugs. The `php artisan lettr:generate-enum` command reads the account's templates through the Lettr API and generates a `LettrTemplate` backed enum in `app/Enums/LettrTemplate.php`, with one PascalCase case per slug. A mistyped slug then fails as a missing enum case before deployment instead of sending the wrong template at runtime. The [Templates Introduction](https://docs.lettr.com/learn/templates/introduction) and [Type Safety](https://docs.lettr.com/quickstart/laravel/type-safety) pages cover both.
