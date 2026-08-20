# lodestone-css-selectors

A collection of pre-defined CSS selectors and XPath expressions optimized for extracting Final Fantasy XIV Lodestone data in lightweight, server-side environments.

---

## What This Project Does

This repository provides a ready-to-use map of target paths for scraping character, free company, and event data from the FFXIV Lodestone. Instead of manually inspecting HTML structures and writing parsers from scratch, developers can import these pre-built, typed definitions directly into their projects.

## Lineage & Architecture

Following the merge of [`miichom/lodestone`](https://github.com/miichom/lodestone) (now integrated into [`xivapi/nodestone`](https://github.com/xivapi/nodestone) via [#20](https://github.com/xivapi/nodestone/issues/20)), this repository inherits a core design philosophy built specifically around **XPath** queries and **Zod** validation. While CSS selectors were added for broader utility, XPath and Zod remain foundational to how the schemas are structured and verified as the single source of truth.

## Core Concepts

### Why Use CSS Selectors & XPath?

To pull specific information from a web page &ndash; such as a character's level, job, or equipment &ndash; your code needs a precise way to locate elements within the HTML:

- **XPath Queries:** The original foundation of the project. Advanced search expressions capable of complex logic that CSS cannot handle, such as finding elements by exact text content or navigating upward through parent nodes.
- **CSS Selectors:** Fast, clean, and ideal for standard, direct element targeting (e.g., matching a class like `.character__name`).

_Providing both gives developers the flexibility to choose the best strategy for their specific parsing tools._

### Why Zod Outputs to JSON

[Zod](https://zod.dev/) serves as the single source of truth for runtime validation and static inference, automatically compiling into standard JSON schemas:

- **Language-Agnostic:** Standard JSON allows non-TypeScript environments (Python, Rust, Go, Ruby) to easily consume the selectors.
- **DOMless Efficiency:** Lightweight HTML parsers (like Cheerio or Happy DOM) can read raw JSON configurations instantly without the overhead of a full browser engine.
- **Automated Sync:** Schema compilation guarantees that TypeScript definitions and raw JSON exports remain strictly aligned without manual upkeep.
