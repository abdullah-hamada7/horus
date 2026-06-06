resource "random_string" "suffix" {
  length  = 8
  special = false
  upper   = false
}

# GCS Bucket for Document Storage
resource "google_storage_bucket" "docs_bucket" {
  name          = "${var.project_name}-${var.environment}-docs-${random_string.suffix.result}"
  location      = var.region
  force_destroy = true

  uniform_bucket_level_access = true
}

# Vertex AI Search (Agent Builder) Data Store
resource "google_discovery_engine_data_store" "kb_datastore" {
  location                    = "global"
  data_store_id               = "${var.project_name}-${var.environment}-ds-${random_string.suffix.result}"
  display_name                = "${var.project_name} Knowledge Base"
  industry_vertical           = "GENERIC"
  content_config              = "CONTENT_REQUIRED"
  solution_types              = ["SOLUTION_TYPE_SEARCH"]
  create_advanced_site_search = false

  document_processing_config {
    default_parsing_config {
      digital_parsing_config {}
    }
  }
}

# Vertex AI Search Engine
resource "google_discovery_engine_search_engine" "kb_search_engine" {
  engine_id      = "${var.project_name}-${var.environment}-engine-${random_string.suffix.result}"
  collection_id  = "default_collection"
  location       = google_discovery_engine_data_store.kb_datastore.location
  display_name   = "${var.project_name} Search Engine"
  data_store_ids = [google_discovery_engine_data_store.kb_datastore.data_store_id]
  search_engine_config {
    search_tier    = "SEARCH_TIER_ENTERPRISE"
    search_add_ons = ["SEARCH_ADD_ON_LLM"]
  }
}
