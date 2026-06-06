# UML Diagrams Reference (Mermaid)

This file contains the core UML diagrams mapping the structure, behavior, and use cases of the **Virtual Egyptian Museum (HORUS)** application.

---

## 1. Use Case Diagram
Describes the interactions between users (Visitor, Administrator) and the application features.

```mermaid
usecaseDiagram
    actor Visitor as "Normal Visitor"
    actor Admin as "Museum Administrator"

    rectangle "Virtual Egyptian Museum (HORUS)" {
        usecase UC1 as "Browse Eras & Kings"
        usecase UC2 as "Translate English to Hieroglyphics"
        usecase UC3 as "Chat with AI Museum Guide (RAG)"
        usecase UC4 as "Listen to Audio Guides"
        usecase UC5 as "Login to Admin Portal"
        usecase UC6 as "Manage Eras (Create/Edit/Delete)"
        usecase UC7 as "Manage Kings & Upload Media"
    }

    Visitor --> UC1
    Visitor --> UC2
    Visitor --> UC3
    Visitor --> UC4

    Admin --> UC5
    Admin --> UC6
    Admin --> UC7
    UC6 ..> UC5 : "<<include>>"
    UC7 ..> UC5 : "<<include>>"
```

---

## 2. Class Diagram
Represents the system's static structure, models, APIs, and controller layers.

```mermaid
classDiagram
    class Era {
        +int id
        +string name
        +string years
        +get_all()
        +create(name, years)
    }

    class King {
        +int id
        +string name
        +string englishName
        +string dynasty
        +string reign
        +string bio
        +string achievements
        +string cartouche
        +string image
        +string docId
        +int era_id
        +get_all()
        +create(data, image_file)
    }

    class FlaskApp {
        +Config config
        +handle_eras()
        +handle_single_era(id)
        +handle_kings()
        +handle_single_king(id)
        +uploaded_file(filename)
    }

    class NextJsAPI {
        +chat_handler(req)
        +auth_handler(req)
    }

    class GCP_RAG_Service {
        +query_rag(prompt)
    }

    Era "1" -- "0..*" King : contains
    FlaskApp ..> Era : queries
    FlaskApp ..> King : queries
    NextJsAPI ..> FlaskApp : fetches data
    NextJsAPI ..> GCP_RAG_Service : calls query
```

---

## 3. Activity Diagram (RAG Chat Flow)
Illustrates the step-by-step workflow when a visitor queries the AI Museum Guide.

```mermaid
stateDiagram-v2
    [*] --> UserEntersPrompt : Visitor submits query
    UserEntersPrompt --> NextJsAPI_Proxy : Next.js API Route receives POST /api/chat
    NextJsAPI_Proxy --> CheckPasscode : Validates request headers
    
    state CheckPasscode <<choice>>
    [*] --> StartApp : Open http://100.54.141.220
    StartApp --> HomePage : Load Home Landing Page
    
    HomePage --> SelectPath
    
    state SelectPath <<choice>>
    SelectPath --> ViewEras : Choose "Explore History"
    SelectPath --> OpenChat : Choose "AI Museum Guide"
    SelectPath --> TranslatePage : Choose "Hieroglyphic Translator"
    SelectPath --> AdminPortal : Choose "Admin Login"
    
    %% Visitor Flow: Browse History
    ViewEras --> FetchErasFromBackend : GET /api/eras
    FetchErasFromBackend --> DisplayEras : Render Era timelines
    DisplayEras --> SelectPharaoh : Click on specific King
    SelectPharaoh --> FetchKingFromBackend : GET /api/kings/<id>
    FetchKingFromBackend --> DisplayPharaohDetails : Show Bio, Cartouche, Achievements & Audio Guide
    DisplayPharaohDetails --> HomePage : Return Home
    
    %% Visitor Flow: AI Guide
    OpenChat --> PromptInput : Enter question about Ancient Egypt
    PromptInput --> CallNextProxy : Post to /api/chat
    CallNextProxy --> CallGCP_RAG : Request GCP RAG endpoint
    CallGCP_RAG --> EmbeddingsQuery : Search vector DB (GCP)
    EmbeddingsQuery --> ReturnChatResponse : Render markdown stream in Chat
    ReturnChatResponse --> PromptInput : Ask follow-up
    ReturnChatResponse --> HomePage : Return Home
    
    %% Visitor Flow: Hieroglyphic Translator
    TranslatePage --> EnterEnglishText : Type word/phrase
    EnterEnglishText --> TranslateMapping : Local dictionary / lookup mapping
    TranslateMapping --> DisplayHieroglyphs : Render Hieroglyphic glyphs on screen
    DisplayHieroglyphs --> HomePage : Return Home
    
    %% Administrator Flow
    AdminPortal --> RequestPasscode : Prompt for ADMIN_PASSCODE
    RequestPasscode --> ValidateAuth : POST /api/admin/auth
    
    state AuthChoice <<choice>>
    ValidateAuth --> AdminDashboard : Passcode Valid (Session set)
    ValidateAuth --> RequestPasscode : Invalid Passcode (Show Error)
    
    AdminDashboard --> ChooseCrudAction
    state ChooseCrudAction <<choice>>
    ChooseCrudAction --> CreateRecord : Add new Era/King
    ChooseCrudAction --> UpdateRecord : Modify existing details
    ChooseCrudAction --> DeleteRecord : Remove Era/King
    
    CreateRecord --> SendPostRequest : POST /api/eras or /api/kings (with file upload)
    UpdateRecord --> SendPutRequest : PUT /api/eras/<id> or /api/kings/<id>
    DeleteRecord --> SendDeleteRequest : DELETE /api/eras/<id> or /api/kings/<id>
    
    SendPostRequest --> SyncDatabase : Apply database mutations (Supabase)
    SendPutRequest --> SyncDatabase
    SendDeleteRequest --> SyncDatabase
    
    SyncDatabase --> RefreshDashboard : 200/201 OK
    RefreshDashboard --> ChooseCrudAction : Perform another action
    RefreshDashboard --> HomePage : Logout / Leave
```

---

## 4. Global Sequence Diagram
Details the sequence of message exchanges across all subsystems (Visitor, Administrator, Next.js Frontend, Flask API Backend, GCP RAG API, and Supabase PostgreSQL Database).

```mermaid
sequenceDiagram
    autonumber
    actor User as User (Visitor / Admin)
    participant FE as Next.js Frontend
    participant NextAPI as Next.js API Proxy
    participant Flask as Flask Backend (Port 5000)
    participant GCP as GCP RAG API
    participant DB as Supabase PostgreSQL

    %% SCENARIO 1: Browsing Content
    note over User, DB: Scenario 1: Browsing Eras & Kings (Visitor)
    User->>FE: Access "History" section
    FE->>Flask: GET /api/eras
    activate Flask
    Flask->>DB: SELECT * FROM era
    activate DB
    DB-->>Flask: List of eras
    deactivate DB
    Flask-->>FE: JSON (eras data)
    deactivate Flask
    FE-->>User: Display era timelines
    
    User->>FE: Select a Pharaoh
    FE->>Flask: GET /api/kings/1
    activate Flask
    Flask->>DB: SELECT * FROM king WHERE id = 1
    activate DB
    DB-->>Flask: King details
    deactivate DB
    Flask-->>FE: JSON (king details)
    deactivate Flask
    FE-->>User: Display details & audio files

    %% SCENARIO 2: AI Museum Guide
    note over User, DB: Scenario 2: Chatting with AI Guide (Visitor)
    User->>FE: Ask: "Who built Abu Simbel?"
    FE->>NextAPI: POST /api/chat { message }
    activate NextAPI
    NextAPI->>GCP: POST /query { query }
    activate GCP
    GCP->>GCP: Lookup Vector Embeddings & Generate Response
    GCP-->>NextAPI: AI generated reply
    deactivate GCP
    NextAPI-->>FE: JSON (reply message)
    deactivate NextAPI
    FE-->>User: Display chat bubble

    %% SCENARIO 3: Admin login & CRUD management
    note over User, DB: Scenario 3: Administrative Login & Record Management (Admin)
    User->>FE: Navigate to /admin and enter passcode
    FE->>NextAPI: POST /api/admin/auth { passcode }
    activate NextAPI
    NextAPI->>NextAPI: Compare with ADMIN_PASSCODE env
    NextAPI-->>FE: Auth token / success
    deactivate NextAPI
    FE-->>User: Access Admin Dashboard

    User->>FE: Modify Pharaoh details + upload new image
    FE->>Flask: PUT /api/kings/1 (Form data + image file)
    activate Flask
    Flask->>Flask: Save image to local uploads/ directory
    Flask->>DB: UPDATE king SET name, bio, image WHERE id = 1
    activate DB
    DB-->>Flask: Database updated
    deactivate DB
    Flask-->>FE: 200 OK (Success message)
    deactivate Flask
    FE-->>User: Show success popup & refresh list
```

