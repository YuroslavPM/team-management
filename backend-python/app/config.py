import os
import sys
from pathlib import Path

from dotenv import load_dotenv


def fail_startup(message: str) -> None:
    print(message, file=sys.stderr)
    sys.exit(1)


load_dotenv(Path(__file__).resolve().parent / ".env")

APP_ENV = os.getenv("APP_ENV", "development")
raw_port = os.getenv("PORT", "8000")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./team-management.db")
raw_bd_test_mode = os.getenv("BD_TEST_MODE", "0")
raw_cors = os.getenv("CORS_ORIGINS", "http://localhost:5173")
TOKEN_BYTES = 32

try:
    PORT = int(raw_port)
except ValueError:
    fail_startup(f'PORT must be an integer between 1 and 65535, got "{raw_port}"')
if PORT < 1 or PORT > 65535:
    fail_startup(f'PORT must be an integer between 1 and 65535, got "{raw_port}"')

if raw_bd_test_mode not in ("0", "1"):
    fail_startup(f'BD_TEST_MODE must be 0 or 1, got "{raw_bd_test_mode}"')
TEST_MODE = raw_bd_test_mode == "1"
DEBUG_QUERIES = os.getenv("BD_DEBUG_QUERIES") == "1" or TEST_MODE

if not DATABASE_URL or not DATABASE_URL.strip():
    fail_startup('DATABASE_URL must be non-empty, got ""')

if APP_ENV not in ("development", "test", "production"):
    fail_startup(f'APP_ENV must be development, test or production, got "{APP_ENV}"')

CORS_ORIGINS = [origin.strip() for origin in raw_cors.split(",") if origin.strip()]
if not CORS_ORIGINS or any(
    not origin.startswith(("http://", "https://")) or origin.endswith("://")
    for origin in CORS_ORIGINS
):
    fail_startup('CORS_ORIGINS must contain at least one http(s):// origin, got ""')
for origin in CORS_ORIGINS:
    if not (origin.startswith("http://") or origin.startswith("https://")):
        fail_startup(
            f'CORS_ORIGINS must contain comma-separated http(s):// origins, got "{origin}"'
        )

if APP_ENV == "production" and TEST_MODE:
    fail_startup("APP_ENV=production is incompatible with BD_TEST_MODE=1")
