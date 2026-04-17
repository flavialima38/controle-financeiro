#!/usr/bin/env bash
# Build script para Render.com
set -o errexit

pip install --upgrade pip
pip install -r requirements.txt
