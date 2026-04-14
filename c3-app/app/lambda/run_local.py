import json
import os
from index import handler

# Local tester for the Python lambda handler

if __name__ == "__main__":
    # Ensure the environment variables are set for local testing
    os.environ.setdefault("DEMO_REQUESTS_BUCKET", "local-demo-requests-bucket")
    os.environ.setdefault("FROM_EMAIL", "info@c3ops.io")
    os.environ.setdefault("ADMIN_EMAIL", "info@c3ops.io")

    with open("test_event.json", "r") as f:
        event = json.load(f)

    # if body is an object, emulate API gateway string body
    if isinstance(event.get("body"), dict):
        event["body"] = json.dumps(event["body"])

    result = handler(event, None)
    print("-- RESULT --")
    print(json.dumps(result, indent=2))
