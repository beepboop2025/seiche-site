# Seiche published site

This repository is the generated static release served at [seiche.info](https://seiche.info). It contains the current dashboard bundle, public data snapshots, documentation pages, dispatches, and discovery files produced by the main Seiche project.

The canonical source code and development history are in [beepboop2025/seiche](https://github.com/beepboop2025/seiche).

## Repository role

Treat this repository as a deployment record. Files under `assets/`, current data snapshots, dispatch indexes, and generated documentation are published by the Seiche release process. Direct edits may be replaced by the next publish.

The repository remains public so readers and automated systems can inspect the exact static files behind the live site, including:

- `data/public.json` and `data/overview.json` for published readings
- `methodology.html` and `skeptic.html` for methods and verification
- `dispatches/` for dated market notes and their feed
- `robots.txt`, `sitemap.xml`, `llms.txt`, and `product-card.json` for discovery
- `.well-known/ai-catalog.json` for compatible agent clients

## Preview locally

```bash
git clone https://github.com/beepboop2025/seiche-site.git
cd seiche-site
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Contributing

Make product, backend, frontend, documentation-template, and publishing changes in [the source repository](https://github.com/beepboop2025/seiche). This repository should receive the resulting generated release as one coherent update.

For API and MCP integration, use the [developer guide](https://seiche.info/developers.html) or connect to `https://api.seiche.info/mcp`.
