# deployment 


## Use these on Render.



### Backend (Web Service)

Root Directory: 
```powershell
server
``` 

Build Command: 
```powershell
npm install
 ```

Start Command:
```powershell 
npm start
 ```

### Frontend (Static Site)

Root Directory: . 

Build Command: 
```powershell 
npm install && npm run build
 ```

Publish Directory:
```powershell  
dist
 ```

### There is no start command for a static site.


### backend build
```powershell
npm install
```
## backend start
```powershell
npm start
```
## frontend start
```powershell
npm install && npm run build

```
## environment
## backend
```powershell
NODE_ENV=production
CLIENT_URLS=https://eventify-kkzb.onrender.com
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
DEFAULT_ADMIN_EMAIL=admin@eventify.local
DEFAULT_ADMIN_PASSWORD=Admin@12345
```

## frontend
```powershell
VITE_API_URL=https://skystack-prakhar-gupta.onrender.com
```
