#!/bin/bash

echo "🔧 ===== FIXING ALPHA MOTOS CRM DEPLOYMENT ====="
echo ""

echo "📝 1. APPLYING FIXES..."
echo "======================="

# Backup original files
cp Dockerfile Dockerfile.backup
cp nginx.conf nginx.conf.backup
cp docker-compose.portainer.yml docker-compose.portainer.yml.backup

# Apply fixes
echo "✅ Backing up original files..."
echo "✅ Applying nginx fix..."
cp nginx-FIXED.conf nginx.conf

echo "✅ Applying Dockerfile fix..."
cp Dockerfile-FIXED Dockerfile

echo "✅ Applying Portainer stack fix..."
cp docker-compose.portainer-FIXED.yml docker-compose.portainer.yml

echo ""
echo "🔨 2. REBUILDING DOCKER IMAGE..."
echo "================================"

# Build new image with fixes
docker build -t gustacg/alpha-motos-crm:fixed .

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    echo ""
    echo "🚀 3. PUSHING TO DOCKER HUB..."
    echo "=============================="
    
    # Push the fixed version
    docker push gustacg/alpha-motos-crm:fixed
    
    if [ $? -eq 0 ]; then
        echo "✅ Push successful!"
        
        # Also update latest tag
        docker tag gustacg/alpha-motos-crm:fixed gustacg/alpha-motos-crm:latest
        docker push gustacg/alpha-motos-crm:latest
        
        echo ""
        echo "✅ ALL FIXES APPLIED SUCCESSFULLY!"
        echo ""
        echo "📋 NEXT STEPS:"
        echo "=============="
        echo "1. Update your Portainer stack with the new YAML configuration"
        echo "2. In Portainer: Stacks → alpha-motos-crm → Editor → Replace content"
        echo "3. Use the content from: docker-compose.portainer-FIXED.yml"
        echo "4. Click 'Update the stack'"
        echo "5. Wait for deployment to complete"
        echo ""
        echo "🌐 CLOUDFLARE SETTINGS:"
        echo "======================="
        echo "1. Go to Cloudflare dashboard → alphamotos.gustacg.com"
        echo "2. SSL/TLS → Overview → Set to 'Full (strict)'"
        echo "3. SSL/TLS → Edge Certificates → Enable 'Always Use HTTPS'"
        echo "4. SSL/TLS → Origin Server → Create Origin Certificate (if not exists)"
        echo ""
        echo "🔍 VERIFICATION:"
        echo "==============="
        echo "After updating:"
        echo "- https://alphamotos.gustacg.com should show your app"
        echo "- HTTPS should be secure (green lock)"
        echo "- No more 404 errors"
        
    else
        echo "❌ Push failed! Check Docker Hub credentials."
        exit 1
    fi
else
    echo "❌ Build failed! Check the build output above."
    exit 1
fi

echo ""
echo "✅ Script completed successfully!"
