# Clocktopus

A local-first time tracker for keeping track of tasks and understanding where your time goes. Organize entries into categories, review your week, and explore your work habits through statistics.

**[Open Clocktopus](https://prettycoffee.github.io/clocktopus/)**

## Features

- **Time tracking:** Add entries with descriptions, categories, dates, and start and end times.
- **Calendar and summaries:** Review recorded time in a calendar or switch between editable tables and summaries.
- **Categories and groups:** Organize tasks into categories and group related categories together. Mark categories as private to exclude them from statistics.
- **Search:** Find entries with filters and save frequently used filters for quick access.
- **Statistics:** Explore time distribution by category and trends by weekday, month, or year.
- **Import and export:** Transfer entries using CSV files, or export and restore backups.

## Data and Backups

Your entries and settings are stored locally in your browser, not on a server. This means they cannot be accessed by anyone except you, but they can also not automatically be synchronized across devices.

**Clearing your browser's site data deletes your Clocktopus data.** Export backups regularly from **Settings → Data**, and use backup imports to restore or transfer your data. You can define a schedule for automated backups in the data settings.

The hosted app runs on GitHub Pages, which may collect visitor information as described in the [GitHub Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement).

## Local Development

Requirements: Node.js + pnpm

To set up and start the project locally, use:

```sh
git clone https://github.com/PrettyCoffee/clocktopus.git
cd clocktopus
pnpm install
pnpm run l10n:build
pnpm run dev
```

Then open the local URL printed by Vite.

### Commands

| Command               | Description                                                   |
| --------------------- | ------------------------------------------------------------- |
| `pnpm run dev`        | Start the development server                                  |
| `pnpm run build`      | Type-check, build translations, and create a production build |
| `pnpm run preview`    | Preview the production build locally                          |
| `pnpm run lint`       | Run ESLint                                                    |
| `pnpm run knip`       | Check for unused code and dependencies                        |
| `pnpm run l10n:build` | Extract and compile translations                              |
| `pnpm run validate`   | Run the build, unused-code checks, and linting                |

## Having Issues?

If you encounter any issues, feel free to raise a ticket in [GitHub Issues](https://github.com/PrettyCoffee/clocktopus/issues) to report problems or discuss changes.

## License

[MIT](https://github.com/PrettyCoffee/clocktopus/blob/main/LICENSE)
