variable "project_id" {
  description = "The GCP Project ID"
  type        = string
  default     = "gcp-ai-494313"
}

variable "region" {
  description = "The GCP region to deploy resources"
  type        = string
  default     = "us-central1"
}

variable "project_name" {
  description = "Name of the project used for tagging and resource naming"
  type        = string
  default     = "gcp-rag"
}

variable "environment" {
  description = "Environment name (e.g., dev, prod)"
  type        = string
  default     = "dev"
}
