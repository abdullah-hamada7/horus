resource "random_string" "suffix" {
  length  = 8
  special = false
  upper   = false
}

# Storage bucket for Cloud Function source code
resource "google_storage_bucket" "function_bucket" {
  name          = "${var.project_name}-${var.environment}-fn-source-${random_string.suffix.result}"
  location      = var.region
  force_destroy = true
}

# Archive the source code
data "archive_file" "function_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../../backend"
  output_path = "${path.module}/function-source.zip"
}

resource "google_storage_bucket_object" "function_source" {
  name   = "function-source-${data.archive_file.function_zip.output_md5}.zip"
  bucket = google_storage_bucket.function_bucket.name
  source = data.archive_file.function_zip.output_path
}

# Service Account for the Cloud Function
resource "google_service_account" "function_sa" {
  account_id   = "${var.project_name}-fn-sa"
  display_name = "Cloud Function Service Account"
}

# IAM role for Vertex AI Search access
resource "google_project_iam_member" "vertex_ai_search_user" {
  project = var.project_id
  role    = "roles/discoveryengine.editor"
  member  = "serviceAccount:${google_service_account.function_sa.email}"
}

# Cloud Function (Gen 2)
resource "google_cloudfunctions2_function" "query_function" {
  name        = "${var.project_name}-${var.environment}-query"
  location    = var.region
  description = "RAG Query Function"

  build_config {
    runtime     = "python311"
    entry_point = "query_kb"
    source {
      storage_source {
        bucket = google_storage_bucket.function_bucket.name
        object = google_storage_bucket_object.function_source.name
      }
    }
  }

  service_config {
    max_instance_count = 1
    available_memory   = "256Mi"
    timeout_seconds    = 60
    service_account_email = google_service_account.function_sa.email
    environment_variables = {
      PROJECT_ID   = var.project_id
      LOCATION_ID  = var.location_id
      DATASTORE_ID = var.datastore_id
    }
  }

  depends_on = [google_project_iam_member.vertex_ai_search_user]
}

# Allow unauthenticated access
resource "google_cloud_run_service_iam_member" "unauthenticated" {
  location = google_cloudfunctions2_function.query_function.location
  project  = var.project_id
  service  = google_cloudfunctions2_function.query_function.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloudfunctions2_function_iam_member" "invoker" {
  project        = google_cloudfunctions2_function.query_function.project
  location       = google_cloudfunctions2_function.query_function.location
  cloud_function = google_cloudfunctions2_function.query_function.name
  role           = "roles/cloudfunctions.invoker"
  member         = "allUsers"
}
