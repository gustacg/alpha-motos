#!/bin/bash

echo "===================================="
echo " Limpeza e Reinstalação do NPM"
echo "===================================="

echo ""
echo "1. Limpando cache do NPM..."
npm cache clean --force

echo ""
echo "2. Removendo node_modules..."
if [ -d "node_modules" ]; then
    rm -rf node_modules
    echo "node_modules removido com sucesso"
else
    echo "node_modules não encontrado"
fi

echo ""
echo "3. Removendo package-lock.json..."
if [ -f "package-lock.json" ]; then
    rm package-lock.json
    echo "package-lock.json removido com sucesso"
else
    echo "package-lock.json não encontrado"
fi

echo ""
echo "4. Reinstalando dependências..."
npm install

echo ""
echo "===================================="
echo " Processo concluído!"
echo "===================================="
echo ""
echo "Se ainda houver erros, tente:"
echo "npm install --legacy-peer-deps"
echo ""
