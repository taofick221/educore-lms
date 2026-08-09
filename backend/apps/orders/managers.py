from django.db import models


class OrderQuerySet(models.QuerySet):
    def active(self):
        return self.filter(is_active=True)

    def pending(self):
        return self.filter(status="pending")

    def approved(self):
        return self.filter(status="approved")

    def payment_verified(self):
        return self.filter(payment_verified=True)

    def for_student(self, student):
        return self.filter(student=student)


class OrderManager(models.Manager):
    def get_queryset(self):
        return OrderQuerySet(self.model, using=self._db)

    def active(self):
        return self.get_queryset().active()

    def pending(self):
        return self.get_queryset().pending()

    def approved(self):
        return self.get_queryset().approved()

    def payment_verified(self):
        return self.get_queryset().payment_verified()

    def for_student(self, student):
        return self.get_queryset().for_student(student)