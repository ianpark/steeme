from steem import Steem
import json

witness_account = 'ned.witness'
witness_account_active_key = '??'
owner_account = 'ned'

witness_profile = {
    "owner": owner_account,
    "projects": [
        {
            "name": "Steem Pay",
            "description": "Steem Pay is a new initiative for stimulating on/offline commerce using Steem Dollar.",
            "link": "https://steemit.com/utopian-io/@asbear/steempay-0-3-0-release-supporting-seven-more-currencies-usd-eur-gbp-jpy-cny-php-myr"
        },
        {
            "name": "Steemian Health Check",
            "description": "Steemian Health Check is a tool for better Steem community. The tool helps to figure out who is using their Steem Power fairly or who might be abusing his SP. @clayop and I spent quite a lot of hours on this project.",
            "link": "https://steemit.com/steemdev/@asbear/project-update-steemian-health-check"
        },
        {
            "name": "Witness Insight",
            "description": "Witness Insight is designed to improve the transparency all across the Steem witnesses. This tool is helpful for the Steemians and witnesses who wants to vote to the best witnesses, and also for investors.",
            "link": "https://steemit.com/utopian-io/@asbear/transparency-wins-witness-insight-v0-3-1"
        }
    ],
    "nodes_locations": ["us-east-2"]
}

s = Steem(keys=[witness_account_active_key])
account_profile = json.loads(s.get_account(account)['json_metadata'])
if not account_profile:
    account_profile = {}
account_profile['witness'] = witness_profile
print("Updating to: " + str(account_profile))
s.commit.update_account_profile(account_profile, witness_account)
