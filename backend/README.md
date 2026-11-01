# NEU Video Library API

## Run locally

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python run.py
```

The API listens at `http://localhost:5000/api`; the SQLite database is created and seeded on first startup.

Demo accounts use password `123456`:

- `admin` - administrator
- `lecturer` - lecturer
- `student` - student

The frontend automatically starts a demo admin session only because it has no sign-in screen yet. Replace that bootstrap with the normal login flow before deployment.

## Main endpoints

- `POST /api/auth/login`, `GET /api/auth/me`
- `GET|POST|PATCH|DELETE /api/faculties`, `/api/majors`, `/api/subjects`
- `GET|POST /api/lectures`, `GET|PATCH|DELETE /api/lectures/:id`
- `GET /api/lectures/featured`, `GET /api/lectures/latest`
- `GET|POST|DELETE /api/bookmarks`
- `GET|POST|DELETE /api/history`
- `GET /api/dashboard/stats`, `GET /api/dashboard/lectures`
