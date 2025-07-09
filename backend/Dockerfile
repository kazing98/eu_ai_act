FROM python:3.11-slim
WORKDIR /app
COPY . /app
RUN pip install -r requirements.txt
EXPOSE 8000
# Set environment variables
ENV FLASK_APP=run.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=8000
ENV PYTHONUNBUFFERED=1
# Run Flask using gunicorn (better for production)
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "run:app"]