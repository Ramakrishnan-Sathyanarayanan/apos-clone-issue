CURRENTBRANCH=$(git branch --show-current)
if [[ "$CURRENTBRANCH" != *"-staging"* ]]; then
  echo "not a staging branch"
  STAGINGBRANCH=$CURRENTBRANCH'-staging'
  echo $STAGINGBRANCH
  git checkout $STAGINGBRANCH || git checkout -b $STAGINGBRANCH
  read -n 1 -s -r -p "After cherry-picking the commits, Press any key to continue."
  git push origin $STAGINGBRANCH
  gh pr create --base 'master' --head $STAGINGBRANCH --title "Staging Deployment"  --fill
  git checkout $CURRENTBRANCH
else
  echo "You are on a staging branch. Operation aborted."
fi