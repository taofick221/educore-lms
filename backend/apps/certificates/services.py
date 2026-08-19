from django.db import transaction
from django.utils import timezone

from .models import Certificate


@transaction.atomic
def issue_certificate(enrollment):
    if not enrollment.is_completed:
        raise ValueError(
            "Certificate can only be issued "
            "after course completion."
        )

    certificate = Certificate.objects.filter(
        enrollment=enrollment,
    ).first()

    if certificate:
        return certificate

    certificate = Certificate.objects.create(
        enrollment=enrollment,
        certificate_number=(
            f"EDU-{timezone.now():%Y%m%d}-"
            f"{str(enrollment.id)[:8].upper()}"
        ),
    )

    enrollment.certificate_issued = True
    enrollment.save(
        update_fields=["certificate_issued"],
    )

    return certificate