---
term: Template Version
question: What is
description: "A template version is a saved snapshot of an email template's content. How versions make edits safe to release and roll back, and how Lettr activates them."
related: [template-slug, merge-tag, topol-email-editor, project]
reading:
  - title: Template Versions
    href: https://docs.lettr.com/learn/templates/versions
  - title: Templates Introduction
    href: https://docs.lettr.com/learn/templates/introduction
  - title: Update Template
    href: https://docs.lettr.com/api-reference/templates/update-template
---

**A template version** is a stored snapshot of an email template's content at one point in time. A template keeps several versions side by side, and one of them is marked as the version that production sends use. New content can be prepared and tested in another version while the current one keeps sending, so a change reaches recipients only when it is deliberately switched on, and the previous content stays available to switch back to.

## How template versions work

A template is identified by a stable name, such as a [template slug](/glossary/template-slug/), and holds a numbered list of versions under it. **Each version stores the full content**: the HTML and, for templates built in a visual editor, the editor's own design data. Creating a version copies the current content into a new entry with the next number, so later edits cannot change what an earlier version contains. Versioning is per template, so templates in the same [project](/glossary/project/) each keep their own history.

One version at a time is active. A send request that names only the template gets the active version, which lets application code stay the same while the content behind it changes. Most platforms also accept an explicit version number in the request, which is useful for testing a new version against real data or for sending an older design on purpose.

Activation is the release step. Making a new version active moves production sends to it, and the previously active version becomes inactive without being deleted. Some platforms add scheduled activation, where a version becomes active on its own at a set date and time.

## Template versions vs autosave history

Visual editors often keep an autosave history as well, and the two are easy to mix up. **Autosaves protect work in progress**: the editor records snapshots at intervals during editing, so a crashed browser or an unwanted change can be undone. They serve recovery during editing, and they are never what gets sent.

Versions are created on purpose and represent a state someone decided to keep. Autosaves record how a draft looked during an editing session, while versions record which content recipients were sent at a given time, which makes versions the record to consult when a past send needs explaining.

## Best practices for template versions

- **Version before a redesign:** a snapshot taken before major changes gives a known good state to return to.
- **Test before activating:** a preview and a test send catch broken layout and [merge tags](/glossary/merge-tag/) that no longer match the data the application sends.
- **Release data before content:** a version that introduces a new merge tag needs the application to supply that value before the version goes live.
- **Pin version numbers sparingly:** a request that names a version keeps sending that content, and later releases silently pass it by.

## Template version in Lettr

In Lettr, versions live in the **Versions** tab of a template, which lists each version with its number, status (Active, Inactive or Scheduled), creation date and publish date. **Clicking Create Version copies the template's current HTML and JSON** into a new version with an auto-incremented number and offers three settings: **Active**, **Publish At** and **Merge Tags**, the last defining the variables that version requires. Through the API, a `PUT /api/templates/{slug}` request with new `html` or `json` content creates a new version automatically, while a request that changes only the name or project does not.

Only one version per template is active, and activating another makes the previous one inactive. Sends without `template_version` use the active version, `template_version: 2` targets version 2, and a version number that does not exist returns an error, as does a template whose versions are all inactive. A version with a **Publish At** date becomes active automatically at that time.

Rolling back means clicking **Activate** on an older version, which applies to all future sends immediately, and the delete option is disabled for the active version. The editor type, `topol` or `custom_html`, is stored per version, so a template can move between visual and code editing across versions. Versions are compared by opening two previews side by side.

The [Topol email editor](/glossary/topol-email-editor/) has a separate **Autosave history**: timestamped autosaves that record who was editing, can be restored in the editor and are stored separately from manual saves. The [Template Versions](https://docs.lettr.com/learn/templates/versions) page covers scheduled publishing and the full API behaviour.
