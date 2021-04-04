# Zotero Roam Translator

Based off code from [cortex futura](https://www.cortexfutura.com/zotero-and-roam-research/) and [melat0nin](https://github.com/melat0nin/zotero-roam-export).

## Installation

1. Copy the translator into `/Users/<username>/Zotero/tanslators` with `./import_to_zotero.sh`

## Installation

1. Install Zutilio and Better Bibtex for roam
2. Zotero > Preferences > Export > Default Format
   Set to `Better BibText Roam Cite Key Quick Copy`
3. Zotero > Preferences > Advanced > Config Editor
   Set `extensions.zutilio.quickCopy_alt1` to `export=0ccb789a-2237-41cf-a594-c122c798009e`
4. Zotero > Tools > Zutilio Preferences > Shortcuts
   Set your shortcut for quick copy items alt 1. I use `cmd + shift + d`

Now highlight a zotero item. Press `cmd + shift + c` to copy it's bibtex key.
Press `cmd + shfit + d` to copy it's metadata.
