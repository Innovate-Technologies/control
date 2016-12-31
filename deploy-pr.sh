#!/bin/bash
set -e

green='\033[1;32m'
reset='\033[0m'
PRIVATE_KEY_NAME='ssh-private-key'

eval $(ssh-agent)
echo "$STRIDER_SSH_PRIV" > $PRIVATE_KEY_NAME
chmod 600 $PRIVATE_KEY_NAME
ssh-add $PRIVATE_KEY_NAME

printf "Copying build to remote server…\n"
scp -r dist/ deploy@control-host.shoutca.st:control-${STRIDER_JOB_ID}

printf "Removing the backup of the previous production build…\n"
ssh deploy@control-host.shoutca.st "rm -rf ~/control-${STRIDER_PR}.backup || true"

printf "Making a backup of the current production build backup…\n"
ssh deploy@control-host.shoutca.st "mv /var/www/html/pr.control/${STRIDER_PR} ~/control-${STRIDER_PR}.backup || true"

printf "Moving the new build…\n"
ssh deploy@control-host.shoutca.st <<EOF
mv ~/control-${STRIDER_JOB_ID} /var/www/html/pr.control/${STRIDER_PR}
date > /var/www/html/pr.control/${STRIDER_PR}/build-time
echo ${STRIDER_JOB_ID} > /var/www/html/pr.control/${STRIDER_PR}/ci-job-id
EOF

printf "${green}Deployed.${reset}\n"

eval $(ssh-agent -k)
rm $PRIVATE_KEY_NAME
