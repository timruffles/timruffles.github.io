# Vanity Solutions and Discretionary Engineering

We all like to feel like we're doing great work. We figure out what 'great work' looks like from other people. Mostly, people foreground solutions, and this creates a sense that good engineering can be demonstrated by adopting them. I call these 'vanity solutions' - picked for the very human and understandable need we all have to feel good at what do, and demonstrate it to others. Vanity solutions come and go with fashion, but here are some current or recent ones - and please note, I'm not suggesting these are bad or never adopted for the right reasons: micro-services, NoSQL, Redux and functional programming.

The problem with vanity solutions is, of course, that adopting solutions into your system or organisation only has a positive effect if you had the problems they solve. Sounds silly, I know! But the longer I do this, and the more interview candidates proudly tell me that their 12 person startup has 60 micro-services, the more sure I am vanity solutions are everywhere. And I've been responsible for a few vanity solutions myself...

Why does this matter? Firstly, it matters because wasting time on vanity solutions rather than important work can kill companies and teams before they have real, interesting problems (the kind of problems that come with getting users, and thus success). This will become clearer to the industry now money is no longer approximately free and discretionary engineering time vanishes. Secondly, I suggest the avoidance of vanity solutions is essential to a truly rewarding career as a software engineer.

# How to tell if you have a problem

Let's use databases as an example. Relational databases have had just an amazing amount of investment over the last 50 years. It's truly remarkable how they handle heavy workloads of ugly, ORM-generated queries. Equally, the correctness properties that they evolved to keep data vaguely sane simply mostly allowed developers to outsource many of the hard problems of persistence to the DB. This is true, even if they were, like me, a recent history graduate who had in 2008 came across "PHP and MySQL" in a bookshop's freebie bin and somehow turned that into a job as the sole developer at a marketing agency building systems used by, believe it or not, public companies<sup>1</sup>.

Some years back, a handful of giant tech companies found RDBs couldn't handle some of the type of edge-case ginormous workloads they had. Not all of their workloads - but some. So they tried out some ideas around relaxing the ACID constrains for those workloads, while continuing to use lots and lots and lots of RDBs. Anyhow, other people at companies of all sizes heard about these cool new NoSQL databases (perhaps with docs that in a more honest world woud be called marketing material) and thought: successful companies need NoSQL to handle their impressive scale! I want to be an engineer with impressive problems, if I adopt a range of NoSQL databases instead of MySQL my problems will be impressive!". Of course, this isn't a conscious thought-process, very little of our most important thought processes are available to us (I can't decide whether or not this is, on balance, a bad thing). After a few years, folks who have no idea that ACID is an acronym are using MongoDB for their startup's most important data, happily performing non-atomic writes on blobs of JSON, and then unhappily trying to figure out why someone else appears to have all their users' cryptocurrency.

What was missing from the stories of "let's use MongoDB it scales" startups? The discovery of a real problem before searching for a solution.

What might the discovery of a real problem look like? Well, I've seen a few "oh god X doesn't scale" problems for databases, and here are some rough notes to get an idea of what they look like:

* `requests a day / 86400 > size of engineering team`. It's a good rule of thumb that if this equation isn't a large number, you can be pretty sure you don't need anything unfamiliar to software engineers of the 1990s (besides Git)
* people being paged because the performance is causing real issues
* the low hanging fruit is picked:
    * using read-replicas as much as possible
    * paying for largest possible database instance
    * giving up on read-your-writes consistency where it's painless, or even where it's a little bit painful
* still getting paged
* folks taking previously unread, non-fun books like High Performance MySQL down from bookshelves and seriously using benchmark tools
* people realising even the medium-hanging fruit, even that available with a ladder and a long-stick, has all been picked
* engaging database consultants who have know how painfully ironic the `EXPLAIN` keyword is in older version of MySQL thanks to its output's aggressive disregard of the normal meaning of words, and its statistics being either upper or lower bounds depending on the least significant bit of your terminal's `PS1`
* feelings of dread, because migrating a heavily loaded database is not fun
* proof, and weary acceptance, that this is not solvable with the current tools
* the parts of the system where the problem resides are migrated to new tool
* relief
* most of the rest of the old system remains on the old system

The best part? Satisfaction that a real problem was solved. Besides that, much was learned: about this class of problem, about the old tool, about designing tools of this type, and a little about new tool. Learning more about the existing tool is great, because it has been retained. The new solution was adopted for only part of the system, leaving the well-understood tool (which was likely itself picked for good reasons) in place. Perhaps enough was learned that folks go on to found startups based on this expertise<sup>2</sup>.

# The problem with vanity solutions

A classic sign of a vanity solution is one where, a few months after launch and the internal or external blog-posts have been written, regret creeps in. It becomes difficult to explain to new team-members why you are running a database about which Jepsen posted only a short, horrifying, video, or why you need to whiteboard your microservices every time someone from marketing asks you to add a field to the user model. Later still, when you interview somewhere new, it becomes fairly hard to justify why you spent eight months adopting Cassandra for a pension aggregation startup where each user logs pays in once a month and logs in approximately twice a year: "isn't Cassandra a write-optimized database" they ask, perhaps adding "chosen only by people with write-loads so brutal that developing a life-long tendency to startle their partner awake with screams of 'column families!' is an acceptable tradeoff?". For some reason they don't seem impressed when you say "I picked it because it scales".

Successful companies doing normal-ish applications will generally expect to encounter novel technical challenges only after they grow. Early on, you're in a space of known problems that can be solved in many ways with existing tools, even stupid ones. So keep it simple, using well understood tools where other people have discovered all the problems. It's really hard to predict where the novel challenge will crop up, these will stop you investing in the wrong place.

Then, later, after product market fit, it will happen. A novel problem. Something not solvable by arcane practises like "reading a book" or "running a profiler". You have yourself a real, live, novel engineering problem. Solve it, and you will have a story to trade over IPAs in some future company that won't be met with awkward silence. And you will not have to try to solve it while simultaneously skim-reading "Learn you a Haskell" because you previously adopted polyglot microservices to allow everyone to use the right tool for the every job, no matter how small, or how short their employment contract, and your very smart intern wrote your terminally buggy password reset logic using a stack of monad transformers so high that Simon Peyton Jones would rather promise to write Java 1.0 for the rest of his days than try to modify it.

Both easy money and fast machines make it very possible to do just about anything in the early years of a company and it'll appear to work. This buffer lets you be as wasteful as you like with engineering and CPU time. But when real problems arrive, this discretionary engineering on vanity solutions will have made it less likely your company will succeed, and that you'll get to encounter and solve some real problems.










