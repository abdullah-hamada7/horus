resource "random_string" "suffix" {
  length  = 8
  special = false
  upper   = false
}

resource "google_storage_bucket" "frontend_bucket" {
  name          = "${var.project_name}-${var.environment}-frontend-${random_string.suffix.result}"
  location      = var.region
  force_destroy = true

  website {
    main_page_suffix = "index.html"
    not_found_page   = "index.html"
  }

  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD", "OPTIONS"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}

resource "google_storage_bucket_iam_member" "public_read" {
  bucket = google_storage_bucket.frontend_bucket.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}
