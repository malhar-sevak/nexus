"""
AdminLogHandler — captures all Python logging records into an in-memory deque
so the SSE endpoint can stream them live to the admin dashboard.
"""
import logging
from collections import deque
from datetime import datetime, timezone
import asyncio

# Global in-memory log store — capped at 500 entries
_log_records: deque = deque(maxlen=500)
_subscribers: list = []  # list of asyncio.Queue instances for SSE clients


class AdminLogHandler(logging.Handler):
    """A logging handler that pushes records into the deque and notifies SSE subscribers."""

    def emit(self, record: logging.LogRecord):
        try:
            entry = {
                "ts": datetime.now(timezone.utc).strftime("%H:%M:%S"),
                "level": record.levelname,
                "name": record.name,
                "msg": self.format(record),
            }
            _log_records.append(entry)
            # Notify all active SSE subscribers
            for q in list(_subscribers):
                try:
                    q.put_nowait(entry)
                except asyncio.QueueFull:
                    pass
        except Exception:
            self.handleError(record)


def get_recent_logs() -> list:
    """Return all buffered log entries (most recent last)."""
    return list(_log_records)


async def log_event_generator(request):
    """Async generator for SSE — yields log entries as they arrive."""
    q: asyncio.Queue = asyncio.Queue(maxsize=200)
    _subscribers.append(q)

    # First, flush all buffered history to the new client
    for entry in get_recent_logs():
        yield _format_sse(entry)

    try:
        while True:
            # Check if client disconnected
            if await request.is_disconnected():
                break
            try:
                entry = await asyncio.wait_for(q.get(), timeout=15.0)
                yield _format_sse(entry)
            except asyncio.TimeoutError:
                # Send a heartbeat comment to keep the connection alive
                yield {"data": ":heartbeat"}
    finally:
        _subscribers.remove(q)


def _format_sse(entry: dict) -> dict:
    """Format a log entry dict as an SSE data payload."""
    line = f"[{entry['ts']}] [{entry['level']}] {entry['name']} — {entry['msg']}"
    return {"data": line, "event": entry["level"]}
