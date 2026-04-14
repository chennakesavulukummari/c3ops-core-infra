Python Lambda handler for demo requests

Files:
- `index.py` – Lambda handler, uses `boto3` to store requests in S3 and `ses` to send emails.
- `requirements.txt` – Python dependencies (boto3)
- `test_event.json` – Example API Gateway proxy event for local testing
- `run_local.py` – Quick local runner that invokes `index.handler` with `test_event.json`

Notes:
- This handler expects the following environment variables:
  - `DEMO_REQUESTS_BUCKET` (S3 bucket name)
  - `FROM_EMAIL` (SES verified sender)
  - `ADMIN_EMAIL` (admin recipient for notifications)

- If you deploy this instead of the Node handler, update `sam-template.yaml`:
  - Set `Runtime: python3.11`
  - Set `Handler: index.handler`
  - Make sure `CodeUri` points to the `lambda/` directory

Local test:

```bash
cd /Users/ck/Documents/FinOps DrivenDevOps/lambda
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python run_local.py
```

Deploy:
- If you switch to Python runtime, ensure `sam-template.yaml` is updated accordingly and re-run `sam build` / `sam deploy`.
