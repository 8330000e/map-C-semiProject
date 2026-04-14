#!/usr/bin/env python3
import argparse
import os
import sys
import pathlib
import mimetypes
from google.cloud import storage


def parse_args():
    parser = argparse.ArgumentParser(
        description="Upload a local folder recursively to Firebase Storage preserving relative paths."
    )
    parser.add_argument(
        "source_dir",
        help="Local folder to upload",
    )
    parser.add_argument(
        "bucket_name",
        help="Firebase Storage bucket name",
    )
    parser.add_argument(
        "--target-prefix",
        default="",
        help="Optional prefix inside the bucket where files should be uploaded",
    )
    parser.add_argument(
        "--credentials",
        default="",
        help="Path to Firebase service account JSON file. If omitted, uses GOOGLE_APPLICATION_CREDENTIALS environment variable.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be uploaded without actually performing uploads",
    )
    return parser.parse_args()


def normalize_blob_name(prefix: str, relative_path: pathlib.Path) -> str:
    normalized = str(relative_path.as_posix())
    if prefix:
        normalized = f"{prefix.rstrip('/')}/{normalized}"
    return normalized


def upload_folder(source_dir: pathlib.Path, bucket_name: str, target_prefix: str, dry_run: bool):
    if not source_dir.exists() or not source_dir.is_dir():
        raise ValueError(f"Source folder does not exist or is not a directory: {source_dir}")

    client = storage.Client()
    bucket = client.bucket(bucket_name)
    if not bucket.exists():
        raise ValueError(f"Firebase Storage bucket does not exist: {bucket_name}")

    total_files = 0
    uploaded_files = 0
    skipped = 0

    for root, _, files in os.walk(source_dir):
        root_path = pathlib.Path(root)
        for filename in sorted(files):
            file_path = root_path / filename
            if not file_path.is_file():
                skipped += 1
                continue

            relative_path = file_path.relative_to(source_dir)
            blob_name = normalize_blob_name(target_prefix, relative_path)
            content_type, _ = mimetypes.guess_type(str(file_path))

            total_files += 1
            print(f"[UPLOAD] {file_path} -> gs://{bucket_name}/{blob_name}")
            if dry_run:
                continue

            blob = bucket.blob(blob_name)
            blob.upload_from_filename(str(file_path), content_type=content_type)
            uploaded_files += 1

    print("\nUpload complete.")
    print(f"Total files found: {total_files}")
    print(f"Uploaded files: {uploaded_files}")
    print(f"Skipped files: {skipped}")


if __name__ == "__main__":
    args = parse_args()
    if args.credentials:
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = args.credentials

    source_dir = pathlib.Path(args.source_dir).expanduser().resolve()
    try:
        upload_folder(source_dir, args.bucket_name, args.target_prefix, args.dry_run)
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        sys.exit(1)
