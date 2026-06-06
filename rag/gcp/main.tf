terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region

  # These settings help resolve "quota project" errors with ADC
  user_project_override = true
  billing_project       = var.project_id
}

# ─── APIs ──────────────────────────────────────────────────────────────────
resource "google_project_service" "apis" {
  for_each = toset([
    "discoveryengine.googleapis.com",
    "cloudfunctions.googleapis.com",
    "run.googleapis.com",
    "artifactregistry.googleapis.com",
    "cloudbuild.googleapis.com",
    "storage.googleapis.com",
    "aiplatform.googleapis.com"
  ])
  service            = each.key
  disable_on_destroy = false
}

# ─── Data & Config ──────────────────────────────────────────────────────────
data "google_project" "project" {}

# ─── Modules ────────────────────────────────────────────────────────────────

module "frontend" {
  source       = "./modules/frontend"
  project_name = var.project_name
  environment  = var.environment
  region       = var.region
  depends_on   = [google_project_service.apis]
}

module "vertex_search" {
  source       = "./modules/vertex_search"
  project_name = var.project_name
  environment  = var.environment
  region       = var.region
  project_id   = var.project_id
  project_number = data.google_project.project.number
  depends_on   = [google_project_service.apis]
}

module "api" {
  source       = "./modules/api"
  project_name = var.project_name
  environment  = var.environment
  region       = var.region
  project_id   = var.project_id
  datastore_id = module.vertex_search.datastore_id
  location_id  = module.vertex_search.location_id
  depends_on   = [google_project_service.apis]
}
