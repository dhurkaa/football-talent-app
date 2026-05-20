# Football Talent App

Ky projekt eshte ndertuar me:

- MongoDB per databazen
- Node.js dhe Express.js per backend
- React.js me Vite per frontend

Projekti permban:

- Login dhe register me JWT token
- CRUD per `teams`
- CRUD per `players`
- CRUD per `matches`
- CRUD per `scouts`
- CRUD per `scout reports`
- Lidhje mes koleksioneve ne MongoDB me `ObjectId` dhe `populate`

## Si te niset projekti

### 1. Backend

Shko ne folderin `backend` dhe krijo `.env` sipas `backend/.env.example`.

```powershell
cd C:\Users\ADMIN\Desktop\football-talent-app\backend
npm install
npm start
```

Backend zakonisht hapet ne:

```text
http://localhost:5000
```

### 2. Frontend

```powershell
cd C:\Users\ADMIN\Desktop\football-talent-app\frontend
npm install
npm run dev -- --host 127.0.0.1
```

Frontend hapet ne:

```text
http://127.0.0.1:5173
```

## Rruget kryesore

- `/login`
- `/register`
- `/dashboard`
- `/teams`
- `/players`
- `/matches`
- `/scouts`
- `/scout-reports`
- `/analytics`
- `/kosovo-live`

## Dokumentimi

Per prezantim dhe sqarim te logjikes se kodit, shiko:

- [DOKUMENTIMI_PROJEKTIT.md](C:/Users/ADMIN/Desktop/football-talent-app/DOKUMENTIMI_PROJEKTIT.md)
