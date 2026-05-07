#!/bin/bash
# Curriculum Analyzer - Startup Script
# Starts Django backend and React frontend

echo "=========================================="
echo "  Curriculum Analyzer - Starting Up"
echo "=========================================="

# Kill any existing processes
pkill -f "manage.py runserver" 2>/dev/null
pkill -f "vite.*3000" 2>/dev/null
sleep 1

# Start Django Backend
echo "[1/2] Starting Django Backend on port 8000..."
cd /home/z/my-project/backend
python3 manage.py runserver 0.0.0.0:8000 > /tmp/django.log 2>&1 &
DJANGO_PID=$!
echo "      Django PID: $DJANGO_PID"

sleep 2

# Check Django is running
if curl -s http://127.0.0.1:8000/api/batches/ > /dev/null 2>&1; then
    echo "      Django Backend: RUNNING"
else
    echo "      Django Backend: FAILED TO START"
    cat /tmp/django.log
    exit 1
fi

# Start React Frontend (Vite dev server)
echo "[2/2] Starting React Frontend on port 3000..."
cd /home/z/my-project/frontend
npx vite --host 0.0.0.0 --port 3000 > /tmp/vite.log 2>&1 &
VITE_PID=$!
echo "      Vite PID: $VITE_PID"

sleep 3

# Check Vite is running
if curl -s http://127.0.0.1:3000/ > /dev/null 2>&1; then
    echo "      React Frontend: RUNNING"
else
    echo "      React Frontend: FAILED TO START"
    cat /tmp/vite.log
    exit 1
fi

echo ""
echo "=========================================="
echo "  Application is ready!"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8000/api/"
echo "=========================================="
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for processes
wait $DJANGO_PID $VITE_PID
