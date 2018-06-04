# Steeme
Steeme is an analysis tool that is comprised with multiple sub tools
- Witness Insight
- Steem Insight
- Steemian Health Check

At the moment, Witness Insight is fully managed and being upgraded.

Steem Insight and Steemian Health Check are still developed and serviced from the other repositories, that will soon migarate to this repository.

---

# Witness Insight
# Witness Insight 1.0
This tool is designed and implemented to help Steemians, investers as well as the Steem witnesses to overview the current status of the top 100 witnesses. There are many other tools that are providing similar features, but the tools are not focusing on the following requirements.

- Who they vote to and how they are managing their vote are not really straight forward
- The information is even more opaque if a witness set a proxy or uses multiple accounts.
- Figuring out if the witnesses are voting to healthy witnesses involves huge manual work.
- It gets even harder if I want to review these informations of the witnesses I voted.
- No simple way to browse the recent witness updates or other articles related to their witness activity.
- Finding out what projects the witnesses are doing is a very painful work.


I spent quite a lot of hours to design and implement Witness Insight, and finally fully completed the functionalities that I initially planned. I am pretty sure every Steemian can find their way to enjoy this tool, and get benefits for casting their precious witness votes.

### URL - http://steeme.com/witness

Now I will walk you through the tool. Before that, I want to call out two things for witnesses.
- Please check out 3.3 for setting up your witness projects.
- You can set your primary account to map your witness updates and the other articles to your witness account. Check out 3.3 for this.

# 1. Main page - Top 100 witnesses
The main page shows the list of the top 100 witnesses.

![](https://cdn.steemitimages.com/DQmSimqybqAP1AdFR7xEqvB6CokixygrtW8ns11h552NyPE/image.png)

## 1.1 Metrics
This simple table shows you that:
- Version: The version of the witness node
- Missed Block: Total number of missed blocks. Not really meaningful. The weekly misses of steemdb.com (https://steemdb.com/witnesses) is much more informative.
- Receiving Votes: Total votes in MVest.
- Vote Leverage: Total MVests + owning MVests
- Feed: Latest price feed with premium applied
- Proxy: Voting proxy. If this is set, the voting related values will be overridden by the proxy's values.
- Vote Casts: Number of votes cast
- Votes Received: Number of votes received from the top 100 witnesses


## 1.2 Indicators

Red warning sign next to the account if the witness is inactive over 5 days
![](https://cdn.steemitimages.com/DQmdgdXzjEbzp7xHWW9Hp8Mi7U581vJpAVFfCnjdNcVgnDk/image.png)

Orange warning sign next to the account if the witness is inactive less than 5 days
![](https://cdn.steemitimages.com/DQmaDKS6LxH18yAMSVzyRvh9Snu2xkbGHpGXXsicfrQUuVL/image.png)



Yellow warning sign next to the version when the node version is lower than 0.19.3.
![](https://cdn.steemitimages.com/DQmRQukpk5ovXykQ2FpHb5EBYkRjANY16yPpzcV972Zp6hK/image.png)

0.19.2 has a security hole without the two security patches, and only the witness owner can tell if these fetches are applied or not. Therefore I believe having 0.19.2 in our witness could introduce a negative perception about Steem network. I hope every witness take this seriously and update their node if they can. At the moment it is a yellow sign, but I will promote it to an orange sign soon.

Notifications on the votes:
The tool shows three different warnign sings next to "Votes Cast" value. These warnings are good indicators for the voters and the witnesses to monitor their witness votes, and brush up if necessary.

![](https://cdn.steemitimages.com/DQmTrgHYbAwhz82U4CWSPgBDFYVU4Fqkfwj7BDR4qxywxCf/image.png)

- Orange Heart: This witness votes to a witness that is inactive over 5 days
- Yellow Eye: This witness votes to a witness whose price feed is biasd over 100% (I don't care this too much to be honest)
- Red Warning Sign: This witness votes to a witness who runs 0.19.1 or lower.

I expect these warning signes will help the witnesses to keep their witness vote up-to-date, which will stimuate the healthy witness voting trend.


# 2. Show only the witnesses I voted
As a voter, you are more concerned about the witnesses you voted. They may have been health when you casted your vote, but things change. Now they might be inactive, using out-dated version, not posting witness update etc, etc.

Use the filter on the top of the main page to filter the witnesses you voted.

![](https://cdn.steemitimages.com/DQmfW2aT98eac9BwyJ2yWEgEFSSk1e5fnqrvr7L1Gga1hAT/image.png)

![](https://cdn.steemitimages.com/DQmTmFF4v47mbC9EvuQUY5VznDR234Lt7Ht8swZL2wU2Qnn/image.png)

I found some witnesses I respect and support now have some trouble in their witness vote. I will consider withdrowing my witness vote if the status are not improving at all after several days.

# 3. Witness Report
The magnifier next to the account will lead you to the "Witness Report" popup.
![](https://cdn.steemitimages.com/DQmSyVJUAzZ64dQtqxWJFQJ4qC7p3oiVnzKSYeQjGL7KEgb/image.png)

## 3.1 프로필
This section shows the account profile of the witness.
![](https://cdn.steemitimages.com/DQmS1EsiEKeZsydWoqszWnhZFZhvQn54GCZzyqXRMVVJ1xT/image.png)

Account profile is the first thing the voters see when they want to check out the witness. I think leaving this profile empty is not the best choice. Following message will be shown instead if it is empty.
![](https://cdn.steemitimages.com/DQmYUTBa1g31PVprtYESoBEsGg8k1NTC7UNTs7xCy8gecNd/image.png)

## 3.2 Witness Updates / Articles (for the last one month)
Witnesses shares their status and information by publishing "Witness Update". I reckon updating once a month is a reasonable expection although it is debatable. This section scans witness's posting and lists up.

![](https://cdn.steemitimages.com/DQmVfRVhcA1NKjizevtVApQzx6iP1eVqbfna5BHfLjnj9cN/image.png)

Make sure your witness update contains "witness" plus "update" or "log" in the title. The search is case insensitive, so don't need to make it all lower case.

No update will result in this ugly message.
![](https://cdn.steemitimages.com/DQmP7KrYnxKKN9am9G1vzs4rq4npgbzn2WoSaErE62YUNxh/image.png)

**Note** If you are publishig witness udpate using a different account, you can configure it through the custom JSON explained in the following chapter.

## 3.3 Projects / Activities
Witnesses' ongoing projects are shown here.
![](https://cdn.steemitimages.com/DQmVFAiq359dQp87Yrm6zwfn1yjaBisjvvnSHcNF6BpYY9E/image.png)

**This idea is from @emrebeyler, who is a moderator of @utopian-io.**


To make this work for you, you must register their projects into their json_metadata in your account profile. It takes a bit of coding, but a witness should be able to do it. I am sharing a Python script for those who would struggle updating it.

> https://github.com/ianpark/steeme/blob/master/misc/witness_profile_updator.py

A help message like beliw will be displayed until you register your projects.
![](https://cdn.steemitimages.com/DQmSPhV9gEZG3SQDe9XuaxREsiuc81JbuERPqd5WqjbANKs/image.png)

If you publish your witness updates using a differnet account, you can register the account by setting "owner_account" in the script.

e.g. @lukestokes ownes @lukestokes.mhth witness account, but uses @lukestokes for all the communication. So "owner_account" for @lukestokes.mhth is "@lukestokes"


## 3.4 Inter-witness voting
Shows the voting trend between the witnesses
![](https://cdn.steemitimages.com/DQmbvRVdGimWhw7EiACgqA4qsTnhXeUEmtHwKwCfFNQXL6Y/image.png)

## 3.5 Witness votes cast
This chart visualize the outgoing witness votes. It is natural that more bars are on the left. We can see the witness's good will to support the low-ranked witnesses through this chart.
![](https://cdn.steemitimages.com/DQmP6Q89uUPiKcerrxhYzNYUPzx5g578kJZ9kbaj3CXrVTv/image.png)

## 3.6 Received witness votes from the other witnesses
This chart shows who this witness get votes from. Not very useful for now though.
![](https://cdn.steemitimages.com/DQmYN4fUkYr1ao5G5cRffPZj99j6PJY4NzqcU4tbSZu4N45/image.png)
