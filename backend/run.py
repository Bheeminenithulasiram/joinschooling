"""Entrypoint runner for Zoho Catalyst AppSail, Docker, and Local Development."""
import os
import uvicorn

if __name__ == "__main__":
    # Zoho Catalyst AppSail injects the port via X_ZOHO_CATALYST_LISTEN_PORT
    port_str = os.environ.get("X_ZOHO_CATALYST_LISTEN_PORT") or os.environ.get("PORT") or "8000"
    port = int(port_str)
    
    print(f"Starting EduConnect Backend API on 0.0.0.0:{port}...")
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)

