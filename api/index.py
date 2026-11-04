
import sys
from pathlib import Path

# Localiza o backend principal do projeto.
ROOT_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = ROOT_DIR / "backend"

# Permite importar os arquivos do backend.
sys.path.insert(0, str(BACKEND_DIR))

# Reutiliza o mesmo FastAPI do Codespaces.
from main import app, chat, health

# Rotas utilizadas pelo frontend na Vercel.
app.add_api_route(
    "/api/chat",
    chat,
    methods=["POST"]
)

app.add_api_route(
    "/api/health",
    health,
    methods=["GET"]
)
