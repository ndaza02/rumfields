import json
import sys
from pathlib import Path
import shutil


def backfill_missing_images(project_root: Path, placeholder_path: Path) -> int:
    json_path = project_root / "products" / "database" / "products.json"
    if not json_path.is_file():
        print(f"products.json not found: {json_path}")
        return 0

    with json_path.open("r", encoding="utf-8") as f:
        data = json.load(f)

    count = 0

    for cat in data.get("categories", []):
        for sub in cat.get("subcategories", []):
            for prod in sub.get("products", []):
                image_rel = prod.get("image")
                if not image_rel:
                    continue
                # Skip remote URLs just in case
                if image_rel.startswith("http://") or image_rel.startswith("https://"):
                    continue

                target = project_root / Path(image_rel)

                # Only backfill where there is no image file yet
                if target.is_file():
                    continue

                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(placeholder_path, target)
                count += 1

    return count


def main(argv):
    if len(argv) < 2:
        print("Usage: python backfill_missing_images.py <placeholder.png>")
        sys.exit(1)

    placeholder_path = Path(argv[1]).expanduser()
    if not placeholder_path.is_file():
        print(f"Placeholder image not found: {placeholder_path}")
        sys.exit(1)

    project_root = Path(__file__).resolve().parent

    count = backfill_missing_images(project_root, placeholder_path)
    print(f"Backfilled {count} missing product images with placeholder.")


if __name__ == "__main__":
    main(sys.argv)
