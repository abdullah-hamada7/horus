from google.cloud import discoveryengine_v1 as discoveryengine

project_id = "gcp-ai-494313"
location = "global"
datastore_id = "gcp-rag-dev-ds-tm21ktg9"

client = discoveryengine.DocumentServiceClient()
parent = client.branch_path(
    project=project_id,
    location=location,
    data_store=datastore_id,
    branch="default_branch",
)

try:
    response = client.list_documents(parent=parent)
    print("Documents in Datastore default_branch:")
    count = 0
    for doc in response:
        title = "N/A"
        if doc.derived_struct_data:
            title = doc.derived_struct_data.get('title', 'N/A')
        print(f"- ID: {doc.id}, Title: {title}")
        count += 1
    print(f"Total: {count}")
except Exception as e:
    print(f"Error listing documents: {e}")
