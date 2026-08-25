import logging
from celery import shared_task
from cards.models import Set
from pricing.services import fetch_prices_for_set

logger = logging.getLogger(__name__)


@shared_task
def fetch_all_prices():
    external_ids = Set.objects.values_list("external_id", flat=True)

    total_created = 0
    failed_sets = []

    for external_id in external_ids:
        try:
            count, warnings = fetch_prices_for_set(external_id)
            total_created += count
            for warning in warnings:
                logger.warning("Set %s: %s", external_id, warning)
        except Exception:
            logger.exception("Failed to fetch prices for set %s", external_id)
            failed_sets.append(external_id)

    logger.info(
        "fetch_all_prices complete: %d snapshots created across %d sets, %d failures",
        total_created,
        len(external_ids) - len(failed_sets),
        len(failed_sets),
    )

    if failed_sets:
        logger.warning("Failed set external_ids: %s", failed_sets)