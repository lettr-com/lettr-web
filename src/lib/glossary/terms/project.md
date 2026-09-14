---
term: Project
question: What is
description: "A project is a container that groups email templates, typically by brand, product or team. How projects organise templates and how Lettr uses them."
related: [template-slug, template-version, premade-template, editor-settings]
reading:
  - title: Projects & Folders
    href: https://docs.lettr.com/learn/templates/projects
  - title: Templates Introduction
    href: https://docs.lettr.com/learn/templates/introduction
  - title: Permissions
    href: https://docs.lettr.com/learn/api-keys/permissions
---

**A project** is a container that groups related email templates, usually one per brand, product or application. Inside a project, templates are typically sorted further into folders. Projects keep a growing template library navigable and give send requests a way to say which set of templates a template name belongs to.

## How projects work

Template platforms commonly arrange templates in a hierarchy. **An account or team holds projects, each project holds folders, and each folder holds templates.** A company that sends email for two brands can keep each brand's welcome email, receipts and newsletters in its own project, with folders inside for transactional mail, onboarding sequences or product updates.

The project also scopes identifiers. A [template slug](/glossary/template-slug/) such as `welcome-email` usually has to be unique only within its project, so two projects can each hold a template with that slug, and a request that sends by slug names the project to say which one it means. A default project covers the common case of a team with a single brand.

## Why projects matter

**Separation keeps templates from colliding.** Brands, products or client accounts that share one flat list collect near-duplicate names, and an edit meant for one brand's template can land on another's. A project boundary makes the owner of each template obvious, and retiring a brand or product means reviewing one project instead of searching a shared list for its templates.

Projects also line up with how code is organised. An application sends a fixed set of emails, and keeping those templates in one project lets its configuration refer to one project and a list of slugs. The same split works for a platform that sends email on behalf of several customers, with one project per customer.

## Best practices for projects

- **One axis per level:** projects split by brand, product or environment, and folders split by email type or lifecycle stage inside them. Mixing both axes at the project level makes templates hard to find.
- **Consistent names:** project and folder names follow one convention, such as "Acme SaaS" and "Acme Enterprise", and slugs describe the email (`password-reset`, not `template-7`).
- **Explicit project in code:** an integration that sends from more than one project passes the project identifier on every request instead of relying on the default.
- **Versions over copies:** content changes go into a new [template version](/glossary/template-version/) of the existing template, not into a second template in another folder.

## Project in Lettr

**Lettr organises templates as Team, Project, Folder and Template.** Every team has a default project created automatically, and that project cannot be deleted and receives templates when no project is specified. During onboarding, Lettr populates the folders with [premade templates](/glossary/premade-template/) that match the business type.

Every template belongs to one of two modes, Transactional for sending through the API or SMTP and Marketing for campaigns, and folders are mode-scoped too. The Copy to Transactional and Copy to Marketing actions create a copy in the other mode with a new unique slug, and deleting a folder moves each of its templates to the project's default folder for its mode instead of deleting them.

Send requests choose a project with the optional `project_id` field, and without it Lettr uses the team's default project. Template slugs are auto-generated from template names and must be unique within a project. Listing projects through the API uses `GET /api/projects`, and a custom-scoped API key needs the `projects:read` scope for it. [Editor settings](/glossary/editor-settings/) are configured across the team and apply to all templates, not per project. The [Projects & Folders](https://docs.lettr.com/learn/templates/projects) page covers naming conventions and folder organisation.
