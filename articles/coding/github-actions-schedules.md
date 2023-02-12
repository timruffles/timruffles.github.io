I was part of the original GitHub Actions [team](https://github.com/actions/humans.txt/blob/main/humans.txt.yaml#L26) between 2018-2019. I thought it'd be fun to share a bit on
how we originally implemented scheduled actions, a feature I took the lead on. This is written up from both memory and
a copy of the team blog post I still have.

GitHub Actions (original name internally: Launch) was responsible for the "control plane" - ensuring your
repos' workflow files got communicated to the system responsible for actually running them. We weren't responsible for the compute platform beneath. Originally that platform was
Google Cloud Platform, then we moved to Azure as post-Microsoft acquisition: an obvious choice! Actions
was one of the first apps that lived outside of the monolith, written in Go. It was implemented using the same APIs that are
offered to any GitHub app developer - REST, GraphQL, and webhooks (with a couple of private APIs).

Scheduled actions were a frequently requested feature during beta, and enabled some really fun use-cases.
I played around with some alternatives to cron syntax, but eventually went for it:

> Yes, cron is unintuitive: I still can’t remember it even after looking at it non-stop building this out. However, I think cron has not been bettered because scheduling has high essential complexity; alternative syntaxes would necessarily be complex too. I also bow to path dependence: since Linux and AWS use cron, it’s likely that when our grandchildren are scheduling their Martian crop picking robots to do a 2pm Monday harvest it will be stored as * 14 * * 1.

I stand by that!

There were two parts of the system to build. First, something
to listen for pushes that affect workflow files, parses them to identify added/updated/removed scheduled workflows, and stores the past version somewhere (while repos are our source of truth, there's no feasible way to query for all repos across GitHub that have scheduled workers, on any branch - as actions can run on any branch). Second, a scheduler that queued jobs at the
appropriate time.

The storage for the first part was an easy choice at GitHub: MySQL. GitHub had an _incredible_ team of MySQL experts (many of whom are now at Planetscale). Relative to many of GH's other write-workloads, the rate of changes to scheduled workflows would be low, and with decent index design we were confident it could handle the load.

If I recall correctly, a unique hash for each schedule was derived from the repo's unique ID, workflow file path,
schedule identifier, and expression. This made synchronisation simple: remove all schedules not in the set of
new schedule hashes, and add any new ones.
The reason we don't need branch in the hash is we decided against allowing
scheduled workflows to run on non-default branches - otherwise you'd start a duplicate scheduled job on every branch containing
a workflow file! That'd be potential DDOS for us and a quick way to burn through peoples' minutes by accident. Incidentally - supporting workflows on all branches was a powerful feature, but one that consistently
added complexity to the design and implementation of Actions features.

Given that the scheduler in the second part was time-oriented, I decided against adding an explicit queue for the first implementation. We didn't have anything in our Go stack that already had any repeating task functionality.
The version of MySQL we were using was pretty old - MySQL 5.7 - so we were missing the