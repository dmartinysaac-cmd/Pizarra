# PIZARRA Analytics

**El partido, leído antes del pitido.**

Plataforma de análisis de fútbol con modelo probabilístico, radar de valor y sistema freemium.

## Instalación rápida (Windows)

```powershell
git clone https://github.com/dmartinysaac-cmd/Pizarra.git
cd Pizarra
npm install
npm run dev
```

Abre en el navegador: **http://localhost:3000**

## Cuentas de demo

| Plan     | Email              | Contraseña |
|----------|--------------------|------------|
| Gratuito | demo@pizarra.app   | demo1234   |
| Premium  | pro@pizarra.app    | pro1234    |

Con la cuenta Premium se desbloquean todos los análisis profundos.

## Requisitos

- Node.js 18 o superior (https://nodejs.org)
- En PowerShell, si npm da error de política de ejecución:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
```

## Datos reales (opcional)

Crea un archivo `.env` en la raíz del proyecto con tus claves:

```env
VITE_FOOTBALL_DATA_TOKEN=tu_token
VITE_API_FOOTBALL_KEY=tu_key
```

- football-data.org: https://www.football-data.org/client/register
- API-Football: https://rapidapi.com/api-sports/api/api-football
