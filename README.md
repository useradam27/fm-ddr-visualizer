# FM Solution Explorer

A free, browser-based tool for exploring FileMaker solutions. Drop in an XML
export and browse the tables, fields, scripts, and layouts without opening
FileMaker.

Works with both export formats:

- **DDR** (Tools → Database Design Report) - FileMaker 19+
- **Save-As-XML** (File → Save a XML) - FileMaker 2023+

Everything runs locally in the browser and your file is never uploaded anywhere.

**Live:** https://useradam27.github.io/fm-ddr-visualizer/

## Purpose

When I first started working with Filemaker, I was a little overwhelmed by job's chaotic database.  I was left to myself to explore it, mapping out each relationship, script and field.  I wanted to make a tool that would have made my life a lot easier back then.  I have since learned that there are a lot of similar tools online.  Some paid, others Mac-only.  I wanted something lightweight easy and to access anywhere, and hopefully this does the job.  The feature set is heavily inspire by some of those other tools on the market, and I will be add more to get closer to it (some of them really do have some great features.)


## Current features

- Upload DDR or Save-As-XML, auto-detected on drop
- Parsing runs in a Web Worker with a progress bar, so the UI stays responsive
  on large files
- Handles UTF-8 and UTF-16 encoded exports
- Overview dashboard with counts for every component type
- Table browser — click a table, see its fields, click a field for full detail
  (type, auto-enter, global, repetitions, validation, comment)
- Script browser — grouped by folder, step-by-step view, disabled steps marked
- Script source view for Save-As-XML exports (DDR doesn't include it)
- Notes and tags on any field or script, saved in the browser
- Saved searches

## Planned

- Relationship graph
- Cross-references — which scripts and layouts use a given field, which scripts
  call which
- Issues report — empty scripts, unused fields, broken references
- Privilege set matrix
- Global search across everything (Cmd+K)
- Layout, value list, and custom function browsers
- AI script summaries (would need an API key — not decided yet)

## Running locally

```bash
npm install
npm run dev
```

## Built with

React, Vite, Tailwind, Zustand, fast-xml-parser.

## Notes

Notes and tags are stored in localStorage keyed by filename, so renaming your
export will lose them.

Not affiliated with Claris.

## License

MIT