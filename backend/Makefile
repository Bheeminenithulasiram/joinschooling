.PHONY: help install run lint fmt type test cov seed docker

help:
	@echo "make install  - create venv and install deps"
	@echo "make run      - start uvicorn with reload"
	@echo "make lint     - ruff check"
	@echo "make fmt      - ruff format"
	@echo "make type     - mypy"
	@echo "make test     - pytest"
	@echo "make cov      - pytest with coverage"
	@echo "make docker   - build production image"

install:
	python3 -m venv .venv && . .venv/bin/activate && pip install -U pip && pip install -r requirements.txt

run:
	uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

lint:
	ruff check app tests

fmt:
	ruff format app tests

type:
	mypy app

test:
	pytest

cov:
	pytest --cov=app --cov-report=term-missing

seed:
	python -m app.scripts.seed

docker:
	docker build -t educonnect-api:latest .
