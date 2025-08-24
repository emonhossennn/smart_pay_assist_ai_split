from django.apps import AppConfig


class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.users'

    def ready(self):  # pragma: no cover - signals registration
        import apps.users.signals  # noqa: F401
