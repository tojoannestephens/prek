"""Backend API tests for BCS Pre K Conference app."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://ai-teaching-conf.preview.emergentagent.com").rstrip("/")


@pytest.fixture
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ===== Health =====
def test_health_root(client):
    # In K8s ingress, only /api/* reaches backend; root `/` is the frontend.
    r = client.get(f"{BASE_URL}/api/")
    assert r.status_code == 200
    assert r.json().get("status") == "ok"


# ===== Agenda =====
def test_get_agenda_seeded(client):
    r = client.get(f"{BASE_URL}/api/agenda")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) == 7
    # Sorted by order
    orders = [d["order"] for d in data]
    assert orders == sorted(orders)
    # No _id leakage
    for item in data:
        assert "_id" not in item
        assert "id" in item
        assert "title" in item


def test_put_agenda_persists(client):
    items = client.get(f"{BASE_URL}/api/agenda").json()
    target = items[0]
    original_title = target["title"]
    new_title = "TEST_AGENDA_UPDATED"
    r = client.put(f"{BASE_URL}/api/agenda/{target['id']}", json={"title": new_title})
    assert r.status_code == 200
    assert r.json()["title"] == new_title
    # Verify via GET
    refetch = client.get(f"{BASE_URL}/api/agenda").json()
    updated = next(x for x in refetch if x["id"] == target["id"])
    assert updated["title"] == new_title
    # Revert
    client.put(f"{BASE_URL}/api/agenda/{target['id']}", json={"title": original_title})


def test_put_agenda_not_found(client):
    r = client.put(f"{BASE_URL}/api/agenda/nonexistent-id", json={"title": "x"})
    assert r.status_code == 404


# ===== Sessions =====
def test_get_sessions_seeded(client):
    r = client.get(f"{BASE_URL}/api/sessions")
    assert r.status_code == 200
    data = r.json()
    assert len(data) == 4
    for item in data:
        assert "_id" not in item
        assert "title" in item


def test_put_session_persists(client):
    items = client.get(f"{BASE_URL}/api/sessions").json()
    target = items[0]
    original = target["title"]
    r = client.put(f"{BASE_URL}/api/sessions/{target['id']}", json={"title": "TEST_SESSION_UPD"})
    assert r.status_code == 200
    refetch = client.get(f"{BASE_URL}/api/sessions").json()
    assert next(x for x in refetch if x["id"] == target["id"])["title"] == "TEST_SESSION_UPD"
    client.put(f"{BASE_URL}/api/sessions/{target['id']}", json={"title": original})


# ===== Resources =====
def test_get_resources_seeded(client):
    r = client.get(f"{BASE_URL}/api/resources")
    assert r.status_code == 200
    data = r.json()
    assert len(data) == 4
    for item in data:
        assert "_id" not in item


def test_put_resource_persists(client):
    items = client.get(f"{BASE_URL}/api/resources").json()
    target = items[0]
    original = target["title"]
    r = client.put(f"{BASE_URL}/api/resources/{target['id']}", json={"title": "TEST_RES_UPD", "url": "https://example.com"})
    assert r.status_code == 200
    refetch = client.get(f"{BASE_URL}/api/resources").json()
    updated = next(x for x in refetch if x["id"] == target["id"])
    assert updated["title"] == "TEST_RES_UPD"
    assert updated["url"] == "https://example.com"
    client.put(f"{BASE_URL}/api/resources/{target['id']}", json={"title": original, "url": ""})


# ===== Admin =====
def test_verify_pin_correct(client):
    r = client.post(f"{BASE_URL}/api/admin/verify-pin", json={"pin": "4321"})
    assert r.status_code == 200
    assert r.json() == {"valid": True}


def test_verify_pin_wrong(client):
    r = client.post(f"{BASE_URL}/api/admin/verify-pin", json={"pin": "0000"})
    assert r.status_code == 200
    assert r.json() == {"valid": False}
