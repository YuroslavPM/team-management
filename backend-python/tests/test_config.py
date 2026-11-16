import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def _run_config(env: dict[str, str]) -> subprocess.CompletedProcess[str]:
    clean = {"PATH": os.environ.get("PATH", ""), "VIRTUAL_ENV": os.environ.get("VIRTUAL_ENV", "")}
    clean.update(env)

    return subprocess.run(
        [sys.executable, "-c", "from app import config"],
        cwd=ROOT,
        env=clean,
        capture_output=True,
        text=True,
        timeout=10,
    )


def test_invalid_port_exists():
    result = _run_config(
        {
            "APP_ENV": "development",
            "PORT": "abc",
            "DATABASE_URL": "sqlite:///./team-management.db",
            "BD_TEST_MODE": "0",
            "DEBUG_QUERIES": "0",
            "CORS_ORIGINS": "http://localhost:5173",
        }
    )
    assert result.returncode != 0
    assert "PORT" in result.stderr
    assert "Traceback" not in result.stderr


def test_port_out_of_range_exists():
    result = _run_config(
        {
            "APP_ENV": "development",
            "PORT": "70000",
            "DATABASE_URL": "sqlite:///./team-management.db",
            "BD_TEST_MODE": "0",
            "DEBUG_QUERIES": "0",
            "CORS_ORIGINS": "http://localhost:5173",
        }
    )
    assert result.returncode != 0
    assert "PORT" in result.stderr
    assert "Traceback" not in result.stderr


def test_production_with_test_mode_exists():
    result = _run_config(
        {
            "APP_ENV": "production",
            "PORT": "8000",
            "DATABASE_URL": "sqlite:///./team-management.db",
            "BD_TEST_MODE": "1",
            "DEBUG_QUERIES": "0",
            "CORS_ORIGINS": "http://localhost:5173",
        }
    )

    assert result.returncode != 0
    assert "APP_ENV" in result.stderr
    assert "BD_TEST_MODE" in result.stderr
    assert "Traceback" not in result.stderr
