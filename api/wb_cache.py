"""
Caching layer for World Bank API data.
Provides in-memory + file-based caching with 24-hour TTL.
Falls back gracefully to stale cache if the API is unreachable.
"""

import json
import os
import time
import logging

logger = logging.getLogger(__name__)

# Cache TTL: 24 hours
CACHE_TTL_SECONDS = 24 * 60 * 60

# File cache path (relative to this file's directory)
_CACHE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")
CACHE_FILE = os.path.join(_CACHE_DIR, "wb_cache.json")

# In-memory cache
_memory_cache = {
    "data": None,
    "timestamp": 0,
}


def _is_cache_fresh(timestamp):
    """Check if a cache timestamp is within TTL."""
    return (time.time() - timestamp) < CACHE_TTL_SECONDS


def _load_file_cache():
    """Load cached data from the JSON file, if it exists and is fresh."""
    try:
        if not os.path.exists(CACHE_FILE):
            return None, 0

        with open(CACHE_FILE, "r") as f:
            cached = json.load(f)

        timestamp = cached.get("timestamp", 0)
        data = cached.get("data")

        if data:
            logger.info("Loaded file cache (age: %.1f hours)", (time.time() - timestamp) / 3600)
            return data, timestamp

    except (json.JSONDecodeError, IOError, KeyError) as e:
        logger.warning("Failed to load file cache: %s", e)

    return None, 0


def _save_file_cache(data):
    """Persist data to the JSON file cache."""
    try:
        os.makedirs(_CACHE_DIR, exist_ok=True)
        cache_payload = {
            "timestamp": time.time(),
            "data": data,
        }
        with open(CACHE_FILE, "w") as f:
            json.dump(cache_payload, f)
        logger.info("Saved data to file cache: %s", CACHE_FILE)
    except (IOError, OSError) as e:
        # On Vercel (read-only filesystem), this will fail silently
        logger.warning("Could not save file cache (expected on Vercel): %s", e)


def get_cached_data(fetch_fn):
    """
    Returns cached World Bank data, fetching fresh data if the cache is stale.
    
    Args:
        fetch_fn: A callable that fetches data from the World Bank API.
                  Should return a dict keyed by ISO3 country code.
    
    Returns:
        dict: Country data keyed by ISO3 code.
    """
    global _memory_cache

    # 1. Check in-memory cache
    if _memory_cache["data"] and _is_cache_fresh(_memory_cache["timestamp"]):
        logger.debug("Serving from in-memory cache")
        return _memory_cache["data"]

    # 2. Check file cache
    file_data, file_timestamp = _load_file_cache()
    if file_data and _is_cache_fresh(file_timestamp):
        _memory_cache["data"] = file_data
        _memory_cache["timestamp"] = file_timestamp
        logger.info("Loaded fresh data from file cache")
        return file_data

    # 3. Fetch fresh data from World Bank API
    try:
        fresh_data = fetch_fn()

        if fresh_data:
            _memory_cache["data"] = fresh_data
            _memory_cache["timestamp"] = time.time()
            _save_file_cache(fresh_data)
            logger.info("Fetched and cached fresh World Bank data")
            return fresh_data

    except Exception as e:
        logger.error("Failed to fetch from World Bank API: %s", e)

    # 4. Fallback: serve stale cache if available
    if file_data:
        logger.warning("Serving STALE file cache (API unreachable)")
        _memory_cache["data"] = file_data
        _memory_cache["timestamp"] = file_timestamp
        return file_data

    if _memory_cache["data"]:
        logger.warning("Serving STALE memory cache (API unreachable)")
        return _memory_cache["data"]

    # 5. No data at all
    logger.error("No cached data available and API is unreachable!")
    return {}
