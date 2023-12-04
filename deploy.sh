set -e

echo "Deploying the application ..."
source ~/.nvm/nvm.sh
nvm use stable
echo "Installing dependencies"
yarn install
if [ -d scratch/ ]; then
  rm -r scratch/
else
  echo "Directory 'scratch/' not found."
fi
echo "Running the application"
pm2 restart live

echo "Deployment complete."
