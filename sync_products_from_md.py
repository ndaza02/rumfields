import json
import re
import sys
from pathlib import Path


def normalize_name(name: str) -> str:
    """Normalize product names so markdown headings match JSON names.

    - Lowercase
    - Strip leading 'TotalEnergies'
    - Remove all non-alphanumeric characters
    """
    name = name.strip()
    name = name.replace("\u00ae", "")  # drop registered symbol if present
    name = re.sub(r"^totalenergies\s+", "", name, flags=re.IGNORECASE)
    name = re.sub(r"\s*\([^)]*\)", "", name)
    # Treat TRAXIUM and TRAX. as the same brand prefix so names match
    name = re.sub(r"traxium", "trax", name, flags=re.IGNORECASE)
    name = name.lower()
    name = re.sub(r"[^a-z0-9]+", "", name)
    return name


def clean_text(text: str) -> str:
    """Clean encoding artifacts and whitespace from catalog text."""
    if not text:
        return ""
    # Fix common encoding issues
    replacements = {
        "Â": "",
        "ï\u0002·": "",
        "â": "'",
        "â": "'",
        "â": "-",
        "â": "-",
        "â¢": "-",
        "â": "->",
        "ï¬": "",
        "â": "",
        "â¦": "...",
        "â": "-",
    }
    for bad, good in replacements.items():
        text = text.replace(bad, good)
    # Collapse whitespace
    text = re.sub(r"\s+", " ", text).strip()
    return text


def parse_markdown(md_path: Path):
    """Parse products.md into a mapping of normalized name -> details.

    We extract:
    - display_name
    - viscosity
    - tds_url
    - combined description (Marketing Text + Description)
    """
    products = {}

    with md_path.open("r", encoding="utf-8", errors="replace") as f:
        lines = f.readlines()

    current = None
    marketing_lines = []
    desc_lines = []
    in_marketing = False
    in_desc = False

    for raw in lines:
        line = raw.rstrip("\n")

        # New product heading
        if line.startswith("## ["):
            # Flush previous
            if current is not None:
                current_desc = clean_text(" ".join(desc_lines))
                current["description"] = current_desc
                if marketing_lines:
                    current["marketing_text"] = clean_text(" ".join(marketing_lines))
                norm = normalize_name(current["display_name"])
                products[norm] = current

            # Start new
            m = re.match(r"## \[(.+?)\]\((.+?)\)", line.strip())
            if not m:
                current = None
                desc_lines = []
                in_desc = False
                continue

            current = {
                "display_name": m.group(1).strip(),
                "catalog_url": m.group(2).strip(),
                "viscosity": "",
                "tds_url": "",
                "applications": [],
                "market_segments": [],
                "range": "",
                "available_packaging": [],
            }
            marketing_lines = []
            desc_lines = []
            in_marketing = False
            in_desc = False
            continue

        if current is None:
            continue

        s = line.strip()

        # Field lines
        if s.startswith("**Viscosity:**"):
            value = s.split("**Viscosity:**", 1)[1].strip()
            current["viscosity"] = clean_text(value)
            continue

        if s.startswith("**[Technical Data Sheet]("):
            m = re.search(r"\]\((.+?)\)", s)
            if m:
                current["tds_url"] = m.group(1).strip()
            continue

        if s.startswith("**Application:**"):
            value = s.split("**Application:**", 1)[1].strip()
            value = clean_text(value)
            if value:
                parts = [p.strip() for p in value.split(",") if p.strip()]
                current.setdefault("applications", [])
                current["applications"].extend(parts)
            continue

        if s.startswith("**Market Segment:**"):
            value = s.split("**Market Segment:**", 1)[1].strip()
            value = clean_text(value)
            if value:
                parts = [p.strip() for p in value.split(",") if p.strip()]
                current.setdefault("market_segments", [])
                current["market_segments"].extend(parts)
            continue

        if s.startswith("**Range:**"):
            value = s.split("**Range:**", 1)[1].strip()
            value = clean_text(value)
            current["range"] = value
            continue

        if s.startswith("**Available Packaging:**"):
            value = s.split("**Available Packaging:**", 1)[1].strip()
            value = clean_text(value)
            if value:
                parts = [p.strip() for p in value.split(",") if p.strip()]
                current["available_packaging"] = parts
            continue

        # Description / Marketing text blocks
        if s.startswith("**Marketing Text:**"):
            in_marketing = True
            in_desc = False
            after = s.split("**Marketing Text:**", 1)[1].strip()
            if after:
                marketing_lines.append(after)
            continue

        if s.startswith("**Description:**"):
            in_desc = True
            in_marketing = False
            after = s.split("**Description:**", 1)[1].strip()
            if after:
                desc_lines.append(after)
            continue

        if in_marketing:
            if s.startswith("**") or s.startswith("---"):
                in_marketing = False
            else:
                if s:
                    marketing_lines.append(s)

        if in_desc:
            if s.startswith("**") or s.startswith("---"):
                in_desc = False
            else:
                if s:
                    desc_lines.append(s)

    # Flush final block
    if current is not None:
        current_desc = clean_text(" ".join(desc_lines))
        current["description"] = current_desc
        if marketing_lines:
            current["marketing_text"] = clean_text(" ".join(marketing_lines))
        norm = normalize_name(current["display_name"])
        products[norm] = current

    return products


def update_products_json(json_path: Path, md_map: dict):
    with json_path.open("r", encoding="utf-8") as f:
        data = json.load(f)

    updated_count = 0

    for cat in data.get("categories", []):
        for sub in cat.get("subcategories", []):
            for prod in sub.get("products", []):
                name = prod.get("name", "")
                norm = normalize_name(name)
                md_entry = md_map.get(norm)
                if not md_entry:
                    continue

                # Preserve local image path
                # Update viscosity if present
                vis = md_entry.get("viscosity")
                if vis:
                    prod["viscosity"] = vis

                # Update description
                desc = md_entry.get("description")
                if desc is not None:
                    desc_clean = str(desc).strip()
                    # Treat a lone dash '-' from markdown as a placeholder (no real description)
                    if desc_clean and desc_clean != "-":
                        prod["description"] = desc_clean
                    elif desc_clean == "-":
                        # If JSON currently holds just '-', clear it to empty so we don't show '-'
                        existing_desc = str(prod.get("description") or "").strip()
                        if existing_desc == "-":
                            prod["description"] = ""

                range_name = md_entry.get("range")
                if range_name:
                    prod["range"] = range_name

                packs = md_entry.get("available_packaging")
                if packs:
                    prod["packSizes"] = packs

                # Merge applications and market segments into applications array
                md_apps = md_entry.get("applications") or []
                md_markets = md_entry.get("market_segments") or []
                combined = list(md_apps) + list(md_markets)
                if combined:
                    existing = prod.get("applications") or []
                    seen = set()
                    new_apps = []
                    for item in list(existing) + combined:
                        item_clean = item.strip()
                        if not item_clean:
                            continue
                        if item_clean in seen:
                            continue
                        seen.add(item_clean)
                        new_apps.append(item_clean)
                    prod["applications"] = new_apps

                market_segments = md_entry.get("market_segments") or []
                if market_segments:
                    prod["marketSegments"] = market_segments

                # Update datasheet to official TDS URL if present
                tds = md_entry.get("tds_url")
                if tds:
                    prod["datasheet"] = tds

                updated_count += 1

    with json_path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    return updated_count


def main(argv):
    if len(argv) < 3:
        print("Usage: python sync_products_from_md.py <products.md> <products.json>")
        sys.exit(1)

    md_path = Path(argv[1])
    json_path = Path(argv[2])

    if not md_path.is_file():
        print(f"Markdown file not found: {md_path}")
        sys.exit(1)
    if not json_path.is_file():
        print(f"JSON file not found: {json_path}")
        sys.exit(1)

    md_map = parse_markdown(md_path)
    updated = update_products_json(json_path, md_map)
    print(f"Updated {updated} products from markdown.")


if __name__ == "__main__":
    main(sys.argv)
