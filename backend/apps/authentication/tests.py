"""Tests for authentication endpoints."""
from django.urls import reverse
from rest_framework.test import APITestCase


class AuthenticationTests(APITestCase):
    """Ensure registration and JWT authentication work correctly."""

    def test_registration_login_and_refresh(self):
        register_url = reverse("register")
        login_url = reverse("login")
        refresh_url = reverse("token_refresh")

        payload = {"email": "user@example.com", "password": "strongpass123"}

        # Register
        response = self.client.post(register_url, payload, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

        # Login
        response = self.client.post(login_url, payload, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        refresh_token = response.data["refresh"]

        # Refresh
        response = self.client.post(refresh_url, {"refresh": refresh_token}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)
