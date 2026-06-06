variable "aws_region" {
  description = "The AWS Region to deploy the EC2 instance into."
  type        = string
  default     = "us-east-1"
}

variable "aws_profile" {
  description = "The AWS CLI profile to use for authentication."
  type        = string
  default     = "sezar-drive"
}

variable "key_name" {
  description = "The name of the existing AWS Key Pair to use for SSH access."
  type        = string
  default     = "dev"
}

variable "instance_type" {
  description = "The type of instance to start."
  type        = string
  default     = "t3.micro"
}

variable "database_url" {
  description = "The connection string for your Supabase database."
  type        = string
  default     = "postgresql://postgres.urknqovsydpsksbrwzgo:X7ZiwEtWYGhfm5YW@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require"
  sensitive   = true
}

variable "rag_api_url" {
  description = "The endpoint for the RAG query API."
  type        = string
  default     = "https://gcp-rag-dev-query-5bez32ydmq-uc.a.run.app"
}

variable "admin_passcode" {
  description = "The administrator dashboard access passcode."
  type        = string
  default     = "Horus2026"
  sensitive   = true
}
