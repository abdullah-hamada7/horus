import os
import subprocess
import json
import time
from google.cloud import storage
from google.cloud import discoveryengine_v1 as discoveryengine


def get_terraform_outputs():
    try:
        # Run terraform output from the gcp directory
        result = subprocess.run(
            ["terraform", "output", "-json"], capture_output=True, text=True, cwd="."
        )
        if result.returncode != 0:
            print("Error running terraform output")
            return None
        return json.loads(result.stdout)
    except Exception as e:
        print(f"Error: {e}")
        return None


def upload_to_gcs(bucket_name, source_dir):
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)

    print(f"Uploading documents from {source_dir} to gs://{bucket_name}...")

    # In a real scenario, we'd iterate over files in source_dir
    # For now, let's look at the same 'docs' folder as the AWS version
    docs_path = os.path.join("..", "docs")
    if not os.path.exists(docs_path):
        os.makedirs(docs_path)
        with open(os.path.join(docs_path, "sample.txt"), "w") as f:
            f.write(
                "Google Cloud Platform RAG Architecture testing. Vertex AI Search is equivalent to Bedrock Knowledge Bases."
            )

    supported_extensions = (".pdf", ".txt", ".docx", ".md")
    uploaded_count = 0

    for filename in os.listdir(docs_path):
        if filename.endswith(supported_extensions):
            source_path = os.path.join(docs_path, filename)
            blob_name = filename

            # Vertex AI Discovery Engine doesn't support text/markdown
            # Rename .md to .txt for ingestion
            if filename.endswith(".md"):
                blob_name = filename[:-3] + ".txt"
                blob = bucket.blob(blob_name)
                blob.upload_from_filename(source_path, content_type="text/plain")
                print(f"  Uploaded {filename} as {blob_name} (converted to text/plain)")
            else:
                blob = bucket.blob(blob_name)
                blob.upload_from_filename(source_path)
                print(f"  Uploaded {filename}")
            uploaded_count += 1

    if uploaded_count == 0:
        print(
            "  No supported documents found. Add .pdf, .txt, or .docx files to ../docs/"
        )


def sync_datastore(project_id, location, datastore_id, gcs_uri):
    client = discoveryengine.DocumentServiceClient()

    # The parent resource of the documents
    parent = client.branch_path(
        project=project_id,
        location=location,
        data_store=datastore_id,
        branch="default_branch",
    )

    request = discoveryengine.ImportDocumentsRequest(
        parent=parent,
        gcs_source=discoveryengine.GcsSource(
            input_uris=[f"{gcs_uri}/*"], data_schema="content"
        ),
        # This will trigger an asynchronous ingestion
        reconciliation_mode=discoveryengine.ImportDocumentsRequest.ReconciliationMode.FULL,
    )

    print(f"Triggering ingestion for Datastore {datastore_id}...")
    operation = client.import_documents(request=request)

    print(f"Waiting for operation {operation.operation.name} to complete...")
    try:
        response = operation.result(timeout=300)
        print(f"Ingestion complete. Response: {response}")
    except Exception as e:
        print(f"Ingestion operation failed or timed out: {e}")
        print(
            "The operation may still be running in the background. Check the GCP Console."
        )


def main():
    outputs = get_terraform_outputs()
    if not outputs:
        print("Could not get Terraform outputs. Make sure you ran 'terraform apply'.")
        return

    project_id = "gcp-ai-494313"  # Hardcoded based on user input for reliability
    bucket_name = outputs["documents_bucket"]["value"]
    datastore_id = outputs["datastore_id"]["value"]
    location = "global"

    upload_to_gcs(bucket_name, "../docs")
    sync_datastore(project_id, location, datastore_id, f"gs://{bucket_name}")


if __name__ == "__main__":
    main()
