# Application Endpoints and Pages Reference

This document maps all the active pages and API endpoints available in the Virtual Egyptian Museum application.

---

## 🌐 Frontend Pages (Next.js)

| Route | Description | File Location |
|---|---|---|
| `/` | Landing / Main Museum Page | [page.tsx](file:///d:/horus2/frontend/app/page.tsx) |
| `/about` | About the Virtual Egyptian Museum | [about/page.tsx](file:///d:/horus2/frontend/app/about/page.tsx) |
| `/admin` | Admin Dashboard (Protected by passcode) | [admin/page.tsx](file:///d:/horus2/frontend/app/admin/page.tsx) |
| `/docs` | Historical Documents / Audio Archive | [docs/page.tsx](file:///d:/horus2/frontend/app/docs/page.tsx) |
| `/hieroglyphics` | Hieroglyphics Translator Tool | [hieroglyphics/page.tsx](file:///d:/horus2/frontend/app/hieroglyphics/page.tsx) |
| `/library` | Digital Archive Library | [library/page.tsx](file:///d:/horus2/frontend/app/library/page.tsx) |
| `/team` | Project Team & Contributors | [team/page.tsx](file:///d:/horus2/frontend/app/team/page.tsx) |

---

## 🔌 Frontend API Routes (Next.js)

| Route | Method | Description | File Location |
|---|---|---|---|
| `/api/chat` | `POST` | Proxy endpoint communicating with the GCP RAG API | [route.ts](file:///d:/horus2/frontend/app/api/chat/route.ts) |
| `/api/admin/auth` | `POST` | Validates admin credentials against `ADMIN_PASSCODE` | [route.ts](file:///d:/horus2/frontend/app/api/admin/auth/route.ts) |

---

## ⚙️ Backend API Endpoints (Python Flask)

The backend runs on port `5000` and interacts with Supabase.

| Route | Methods | Description |
|---|---|---|
| `/api` | `GET` | API Root status, metadata, and versioning |
| `/api/swagger.json` | `GET` | Swagger API specification JSON documentation |
| `/api/eras` | `GET`, `POST` | Retrieve all historical eras or create a new era |
| `/api/eras/<id>` | `GET`, `PUT`, `DELETE` | Retrieve, update, or delete a specific era |
| `/api/kings` | `GET`, `POST` | Retrieve all Pharaohs/Kings or add a new entry |
| `/api/kings/<id>` | `GET`, `PUT`, `DELETE` | Retrieve, update, or delete a specific Pharaoh/King |
| `/api/uploads/<filename>`| `GET` | Serving uploaded media assets (e.g. Pharaoh photos) |
