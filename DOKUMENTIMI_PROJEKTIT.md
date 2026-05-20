# Dokumentimi i Projektit

Ky dokument eshte nje version orientues per prezantim. Meqenese ne kerkese thuhet qe dokumentimi nuk duhet te jete me shume se 30% i gjeneruar nga AI, perdore kete si baze dhe pershtate me fjalet e tua para dorezimit final.

## 1. Qellimi i projektit

Ky projekt eshte nje aplikacion web per menaxhimin e te dhenave ne futboll. Perdoruesi mund te regjistrohet, te beje login dhe pastaj te menaxhoje ekipe, lojtare, ndeshje, scout dhe scout reports.

Qellimi kryesor ka qene:

- te realizohet autentikimi i perdoruesit
- te realizohen CRUD operacionet
- te lidhet backend-i me databazen MongoDB
- te lidhet frontend-i React me backend-in Express

## 2. Teknologjite e perdorura

- MongoDB: ruajtja e te dhenave
- Mongoose: modelimi i koleksioneve dhe lidhjeve me databaze
- Node.js: ekzekutimi i backend-it
- Express.js: krijimi i API routes
- React.js: ndertimi i frontend-it
- Axios: komunikimi frontend-backend
- JWT: autentikimi i perdoruesit

## 3. Logjika e pergjithshme e aplikacionit

Aplikacioni ndahet ne dy pjese kryesore:

- Backend: menaxhon kerkesat HTTP, autentikimin, validimin bazik dhe komunikimin me databazen
- Frontend: shfaq format, tabelat dhe faqet ku perdoruesi menaxhon te dhenat

Rrjedha e punes eshte kjo:

1. Perdoruesi regjistrohet ose ben login.
2. Backend kthen nje JWT token.
3. Frontend e ruan token-in ne `localStorage`.
4. Per cdo kerkese te mbrojtur, frontend e dergon token-in ne `Authorization` header.
5. Backend e verifikon token-in me middleware dhe lejon ose refuzon qasjen.
6. Nese kerkesa eshte valide, backend lexon ose ndryshon te dhenat ne MongoDB dhe kthen pergjigje JSON.

## 4. Lidhja databaze-backend

Lidhja me MongoDB realizohet te [db.js](C:/Users/ADMIN/Desktop/football-talent-app/backend/config/db.js). Aty perdoret `mongoose.connect(process.env.MONGO_URI)` per t'u lidhur me databazen.

Modelet e databazes ndodhen te folderi `backend/models`:

- [user.js](C:/Users/ADMIN/Desktop/football-talent-app/backend/models/user.js)
- [team.js](C:/Users/ADMIN/Desktop/football-talent-app/backend/models/team.js)
- [player.js](C:/Users/ADMIN/Desktop/football-talent-app/backend/models/player.js)
- [match.js](C:/Users/ADMIN/Desktop/football-talent-app/backend/models/match.js)
- [scout.js](C:/Users/ADMIN/Desktop/football-talent-app/backend/models/scout.js)
- [scoutreport.js](C:/Users/ADMIN/Desktop/football-talent-app/backend/models/scoutreport.js)

Secili model paraqet nje koleksion ne MongoDB. Per shembull:

- `Player` ka fusha si emri, mosha, pozita dhe `teamId`
- `teamId` eshte `ObjectId` dhe lidhet me koleksionin `Team`
- ne disa routes perdoret `populate()` qe emri i ekipit te merret automatikisht nga koleksioni tjeter

Kjo tregon qe backend-i nuk ruan vetem tekst te thjeshte, por perdor marredhenie reale mes dokumenteve ne MongoDB.

## 5. Lidhja backend-frontend

Frontend komunikon me backend permes Axios ne [api.js](C:/Users/ADMIN/Desktop/football-talent-app/frontend/src/api/api.js).

Aty eshte vendosur:

- `baseURL: "http://localhost:5000/api"`
- interceptor qe vendos token-in ne header

Kjo do te thote se kur frontend ben p.sh. `api.get("/players")`, kerkesa shkon ne backend te ruta:

```text
GET /api/players
```

Backend e pranon kerkesen, kontrollon token-in dhe me pas lexon te dhenat nga MongoDB. Pergjigja kthehet ne JSON dhe frontend e shfaq ne tabele ose ne faqe.

## 6. Login dhe autentikimi

Login dhe register jane realizuar ne backend te [authRoutes.js](C:/Users/ADMIN/Desktop/football-talent-app/backend/routes/authRoutes.js).

Funksionimi:

- `POST /api/auth/register`: krijon perdoruesin e ri
- `POST /api/auth/login`: kontrollon email dhe password
- nese kredencialet jane te sakta, krijohet JWT token

Password-i nuk ruhet ne forme te thjeshte. Te [user.js](C:/Users/ADMIN/Desktop/football-talent-app/backend/models/user.js) perdoret `bcryptjs` per hashim para ruajtjes.

Mbrojtja e rutave realizohet me middleware te [authMiddleware.js](C:/Users/ADMIN/Desktop/football-talent-app/backend/middleware/authMiddleware.js). Ky middleware:

- e lexon token-in nga header
- e verifikon token-in me `jwt.verify`
- e gjen perdoruesin ne databaze
- lejon vazhdimin e kerkeses vetem nese token-i eshte valid

## 7. CRUD operacionet

CRUD do te thote:

- Create
- Read
- Update
- Delete

Ne kete projekt CRUD eshte realizuar per keto module:

- Teams
- Players
- Matches
- Scouts
- Scout Reports

Shembull te players:

- `POST /api/players` krijon lojtar te ri
- `GET /api/players` lexon listen e lojtareve
- `GET /api/players/:id` lexon nje lojtar te vecante
- `PUT /api/players/:id` perditeson lojtarin
- `DELETE /api/players/:id` e fshin lojtarin

E njejta logjike ndiqet edhe te ekipet, ndeshjet, scouts dhe scout reports.

## 8. Funksionaliteti ne frontend

Frontend ka disa faqe kryesore:

- Login
- Register
- Dashboard
- Teams
- Players
- Player Profile
- Matches
- Scouts
- Scout Reports
- Analytics
- Kosovo Live

Faqet e mbrojtura kontrollohen nga [protectedRoute.jsx](C:/Users/ADMIN/Desktop/football-talent-app/frontend/src/components/protectedRoute.jsx). Nese nuk ekziston token-i, perdoruesi ridrejtohet te login.

Ne faqet CRUD perdoren forma per insertim dhe update, ndersa te dhenat shfaqen ne tabela. Kur perdoruesi ben ndryshime, frontend dergon kerkese HTTP te backend dhe pas suksesit rifreskon listen.

## 9. Shembull i rrjedhes se nje kerkese

Shembull: shtimi i nje lojtari te ri

1. Perdoruesi ploteson formen ne frontend.
2. React e ruan vleren e inputeve ne `state`.
3. Kur klikohet `Create Player`, frontend dergon `POST /api/players`.
4. Axios e shton automatikisht token-in ne header.
5. Backend e pranon kerkesen te `playerRoutes.js`.
6. Middleware kontrollon token-in.
7. Modeli `Player` e ruan dokumentin ne MongoDB.
8. Backend kthen lojtarin e krijuar si JSON.
9. Frontend e rifreskon tabelen dhe e shfaq lojtarin e ri.

## 10. Cfare mund te thuhet ne prezantim

Pika te shkurtra qe mund t'i shpjegoni me fjalet tuaja:

- Projekti eshte zhvilluar me arkitekture frontend-backend-database.
- Backend-i ofron REST API per CRUD dhe login.
- MongoDB ruan te dhenat, ndersa Mongoose menaxhon modelet dhe lidhjet.
- React e konsumon API-ne dhe e shfaq funksionalitetin per perdoruesin.
- JWT perdoret per mbrojtjen e rutave.
- `populate()` perdoret per te lexuar te dhena te lidhura nga koleksione te ndryshme.

## 11. Permbledhje

Ky projekt i permbush kerkesat baze te detyres:

- login
- CRUD
- MongoDB
- Node.js + Express.js
- React.js
- lidhje backend-database
- lidhje frontend-backend

Pjesa qe duhet patjeter ta personalizoni para dorezimit eshte shpjegimi me fjalet tuaja, qe prezantimi dhe dokumentimi te jene natyral dhe ne perputhje me kerkesen e profesorit.
