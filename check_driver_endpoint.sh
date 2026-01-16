#!/bin/bash
# Script to check driver endpoint in backend

echo "=== Checking Driver Routes ==="
cd /home/jeeteak-api/htdocs/api.jeeteak.com

echo ""
echo "1. Searching for driver routes..."
if [ -f "routes/api.php" ]; then
    echo "Found Laravel routes file:"
    grep -n "drivers" routes/api.php | head -20
elif [ -f "routes/web.php" ]; then
    echo "Found routes/web.php:"
    grep -n "drivers" routes/web.php | head -20
else
    echo "Searching for route files..."
    find . -name "*route*" -type f 2>/dev/null | grep -v vendor | head -10
fi

echo ""
echo "2. Searching for DriverController..."
find . -name "*DriverController*" -type f 2>/dev/null | grep -v vendor | head -5

echo ""
echo "3. Checking if endpoint exists in controller..."
if find . -name "*DriverController*" -type f 2>/dev/null | grep -v vendor | head -1 | read controller; then
    echo "Found controller: $controller"
    echo "Checking for 'show' or 'getById' method:"
    grep -n -A 5 "function.*show\|function.*getById\|function.*index" "$controller" | head -20
fi

echo ""
echo "4. Checking middleware/permissions..."
if [ -f "app/Http/Middleware" ]; then
    echo "Checking middleware files..."
    ls -la app/Http/Middleware/ 2>/dev/null | head -10
fi

echo ""
echo "=== Checking Logs ==="
if [ -d "storage/logs" ]; then
    echo "Latest error logs:"
    tail -50 storage/logs/laravel.log 2>/dev/null | grep -i "driver\|404\|403" | tail -20
else
    echo "Logs directory not found in expected location"
fi

echo ""
echo "=== Test API Endpoint ==="
echo "To test the endpoint manually, run:"
echo "curl -X GET 'https://api.jeeteak.com/api/v1/drivers/1' -H 'Authorization: Bearer YOUR_TOKEN' -v"

