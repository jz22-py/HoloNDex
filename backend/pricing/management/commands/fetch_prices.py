from django.core.management.base import BaseCommand
from pricing.services import fetch_prices_for_set


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument("set_id", type=int)

    def handle(self, *args, **options):
        set_id = options["set_id"]
        count, warnings = fetch_prices_for_set(set_id)

        for warning in warnings:
            self.stdout.write(self.style.WARNING(warning))

        self.stdout.write(self.style.SUCCESS(f"Created {count} price snapshots for set {set_id}"))