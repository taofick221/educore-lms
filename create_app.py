import sys
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent

APPS_DIR = PROJECT_ROOT / "backend" / "apps"


COMMON_FILES = [
    "__init__.py",
    "admin.py",
    "choices.py",
    "constants.py",
    "exceptions.py",
    "filters.py",
    "managers.py",
    "permissions.py",
    "selectors.py",
    "serializers.py",
    "services.py",
    "signals.py",
    "urls.py",
    "validators.py",
    "views.py",
]


def create_empty_file(path: Path):
    """
    Create file if it does not exist.
    """

    path.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    if not path.exists():
        path.touch()


def create_app_config(
    app_name: str,
    app_path: Path,
):
    """
    Create apps.py
    """

    apps_file = app_path / "apps.py"

    if apps_file.exists():
        return

    class_name = "".join(
        word.capitalize()
        for word in app_name.split("_")
    )

    apps_file.write_text(
        f"""from django.apps import AppConfig


class {class_name}Config(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.{app_name}"
""",
        encoding="utf-8",
    )


def create_app(
    app_name,
    model_files,
):
    app_path = APPS_DIR / app_name

    print(
        f"\nCreating app: {app_name}"
    )

    app_path.mkdir(
        parents=True,
        exist_ok=True,
    )

    (app_path / "models").mkdir(
        exist_ok=True,
    )

    (app_path / "migrations").mkdir(
        exist_ok=True,
    )

    for filename in COMMON_FILES:
        create_empty_file(
            app_path / filename
        )

    create_empty_file(
        app_path
        / "migrations"
        / "__init__.py"
    )

    create_empty_file(
        app_path
        / "models"
        / "__init__.py"
    )

    create_app_config(
        app_name,
        app_path,
    )

def create_models(
    app_path: Path,
    model_files,
):
    """
    Create model files and update models/__init__.py
    """

    models_dir = app_path / "models"

    init_file = models_dir / "__init__.py"

    exports = []

    for model in model_files:
        file = models_dir / f"{model}.py"

        create_empty_file(file)

        class_name = "".join(
            word.capitalize()
            for word in model.split("_")
        )

        exports.append(
            f"from .{model} import {class_name}"
        )

    if exports:
        init_file.write_text(
            "\n".join(exports) + "\n",
            encoding="utf-8",
        )


def main():
    if len(sys.argv) < 2:
        print(
            "\nUsage:\n"
            "python create_app.py app_name model1 model2 ..."
        )
        return

    app_name = sys.argv[1]

    model_files = sys.argv[2:]

    create_app(
        app_name,
        model_files,
    )

    create_models(
        APPS_DIR / app_name,
        model_files,
    )

    print("\nDone.")
    print(
        f"\nApp created: apps/{app_name}"
    )


if __name__ == "__main__":
    main()