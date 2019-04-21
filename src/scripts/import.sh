scope=$1
if [ -z "$scope" ]
then
      echo "please provide scope"
else
      components=$(bd ls ${scope} -j | jq -r '.[].id')
      num_components=$(echo "$components" | wc -w | xargs)
      echo "found $num_components in scope $scope"
      bit import $components
fi