import os
import json
import re
import uuid
import logging
import traceback
from datetime import datetime
from html import escape as html_escape

import boto3

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Environment variables expected to be set by SAM/CloudFormation
BUCKET_NAME = os.environ.get("DEMO_REQUESTS_BUCKET") or os.environ.get("BUCKET_NAME")
FROM_EMAIL = os.environ.get("FROM_EMAIL")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL")

# Clients
s3 = boto3.client("s3")
ses = boto3.client("ses")

EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

# CORS headers
CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,POST",
}


def _build_response(status_code: int, body: dict):
    return {
        "statusCode": status_code,
        "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
        "body": json.dumps(body),
    }


def _validate_input(payload: dict):
    name = (payload.get("name") or "").strip()
    email = (payload.get("email") or "").strip()
    company = (payload.get("company") or "").strip()
    message = (payload.get("message") or "").strip()

    if not name:
        return False, "Missing 'name'"
    if not email:
        return False, "Missing 'email'"
    if not EMAIL_REGEX.match(email):
        return False, "Invalid email address"

    # company and message are optional but keep as empty string if missing
    return True, {"name": name, "email": email, "company": company, "message": message}


def _s3_store(bucket: str, key: str, content: dict):
    s3.put_object(
        Bucket=bucket,
        Key=key,
        Body=json.dumps(content).encode("utf-8"),
        ContentType="application/json",
        ServerSideEncryption="AES256",
    )


def _send_email(to_address: str, subject: str, html_body: str, from_address: str = None):
    src = from_address or FROM_EMAIL
    if not src:
        raise RuntimeError("Missing FROM_EMAIL environment variable")

    response = ses.send_email(
        Source=src,
        Destination={"ToAddresses": [to_address]},
        Message={
            "Subject": {"Data": subject, "Charset": "UTF-8"},
            "Body": {"Html": {"Data": html_body, "Charset": "UTF-8"}},
        },
    )
    return response


def _user_confirmation_html(name: str, request_id: str):
    return f"""
    <html>
      <body style="font-family: Arial,Helvetica,sans-serif; color:#111;">
        <h2>Thanks, {html_escape(name)}!</h2>
        <p>Your demo request has been received.</p>
        <p><strong>Request ID:</strong> {html_escape(request_id)}</p>
        <p>We'll get back to you shortly. If you have any further details, reply to this email.</p>
        <hr/>
        <p style="font-size:12px; color:#666;">— The C3Ops Team</p>
      </body>
    </html>
    """


def _admin_notification_html(payload: dict, request_id: str):
    name = html_escape(payload.get("name", ""))
    email = html_escape(payload.get("email", ""))
    company = html_escape(payload.get("company", ""))
    message = html_escape(payload.get("message", ""))
    requested_at = html_escape(payload.get("requestedAt", ""))

    return f"""
    <html>
      <body style="font-family: Arial,Helvetica,sans-serif; color:#111;">
        <h3>New Demo Request</h3>
        <p><strong>Request ID:</strong> {html_escape(request_id)}</p>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Company:</strong> {company}</p>
        <p><strong>Submitted At:</strong> {requested_at}</p>
        <p><strong>Message:</strong></p>
        <pre style="background:#f7f7f7; padding:10px;">{message}</pre>
      </body>
    </html>
    """


def handler(event, context):
    try:
        logger.info("Received event: %s", json.dumps(event))

        # Handle CORS preflight
        http_method = event.get("httpMethod") or event.get("requestContext", {}).get("http", {}).get("method")
        if http_method == "OPTIONS":
            return {"statusCode": 204, "headers": CORS_HEADERS}

        # Parse body
        body = event.get("body")
        if body is None:
            return _build_response(400, {"error": "Missing request body"})

        if isinstance(body, str):
            try:
                payload = json.loads(body)
            except Exception:
                return _build_response(400, {"error": "Invalid JSON body"})
        else:
            payload = body

        ok, result = _validate_input(payload)
        if not ok:
            return _build_response(400, {"error": result})

        # result now contains cleaned fields
        cleaned = result
        request_id = str(uuid.uuid4())
        now_iso = datetime.utcnow().isoformat() + "Z"

        item = {
            "id": request_id,
            "name": cleaned["name"],
            "email": cleaned["email"],
            "company": cleaned.get("company", ""),
            "message": cleaned.get("message", ""),
            "requestedAt": now_iso,
            "status": "pending",
        }

        if not BUCKET_NAME:
            logger.error("Missing bucket name environment variable")
            return _build_response(500, {"error": "Server misconfiguration: bucket name not set"})

        # Build S3 key
        year = datetime.utcnow().strftime("%Y")
        month = datetime.utcnow().strftime("%m")
        key = f"demo-requests/{year}/{month}/{request_id}.json"

        # Store in S3
        _s3_store(BUCKET_NAME, key, item)

        # Send confirmation email to user
        try:
            user_html = _user_confirmation_html(item["name"], request_id)
            _send_email(item["email"], "Your demo request — C3Ops", user_html)
        except Exception:
            logger.exception("Failed to send confirmation email to user")

        # Send admin notification
        try:
            if not ADMIN_EMAIL:
                logger.warning("ADMIN_EMAIL not configured; skipping admin notification")
            else:
                admin_html = _admin_notification_html(item, request_id)
                _send_email(ADMIN_EMAIL, f"New demo request: {request_id}", admin_html)
        except Exception:
            logger.exception("Failed to send admin notification")

        # Success
        return _build_response(200, {"requestId": request_id, "message": "Request received"})

    except Exception as exc:
        logger.error("Unhandled exception: %s", str(exc))
        logger.error(traceback.format_exc())
        return _build_response(500, {"error": "Internal server error"})
