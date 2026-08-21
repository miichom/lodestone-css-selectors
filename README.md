# Lodestone Selectors

A ready-to-use collection of CSS selectors, XPath expressions, and Zod schemas for scraping data from the Final Fantasy XIV Lodestone. Designed for fast, lightweight parsing across any programming language.

## Quick Start

If you are incorporating these selectors into another project, you can add this repository using Git submodules. This allows you to track updates without manually copying files.

```sh
git submodule add https://github.com/miichom/lodestone-selectors.git <path>
```

For more details on managing submodules, check out the [Official Git Submodules Documentation](https://git-scm.com/book/en/v2/Git-Tools-Submodules).

## Key Features

- **XPath & CSS Selectors:** Choose standard CSS selectors for fast direct matching, or XPath for complex text matching and parent-node traversal.
- **Zod & JSON Schemas:** Written in Zod for TypeScript type safety, and automatically compiled to standard JSON for non-TypeScript environments (Python, Go, Rust, etc.).
- **Lightweight & DOMless:** Optimized for fast HTML parsers like Cheerio or Happy DOM without needing a full browser.

## Project Lineage

This repository inherits its design from [miichom/lodestone](https://github.com/miichom/lodestone) (now merged into [xivapi/nodestone](https://github.com/xivapi/nodestone)).

## Contributing

Contributions are welcome! If you want to update or add new selectors, simply submit a Pull Request with your changes to the TypeScript/Zod source schemas.

> **Note:** You don't need to manually recompile the JSON output. The CI pipeline generates and commits the updated JSON files automatically when merged.
