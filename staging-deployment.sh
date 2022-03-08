CURRENTBRANCH=$(git branch --show-current)
STAGINGBRANCH=$CURRENTBRANCH'-staging'
echo $STAGINGBRANCH
git checkout $STAGINGBRANCH || git checkout -b $STAGINGBRANCH
read -n 1 -s -r -p "After cherry-picking the commits, Press any key to continue."
git push origin $STAGINGBRANCH
gh pr create --base 'master' --head $STAGINGBRANCH --title "Staging Deployment"  --fill