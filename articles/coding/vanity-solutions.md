# Vanity Solutions
We all like to feel like we're doing great work. We figure out what 'great work' looks like from other people, most often from link aggregators, conference talks etc. Mostly, people foreground solutions, or at least that's what people notice, and it appears to have created a sense that good engineering is about implementing or adopting a set of impressive solutions.

Some examples: micro-services, NoSQL, Redux and functional programming.

Thing is, of course, that adopting solutions into your system or organisation isn't a goal in itself. Solutions are only worth the effort if you have the problem they were designed to solve in the first place. Sounds silly, I know! But the longer I do this, and the more interviews I do where candidates proudly tell me that their 12 person startup has 60 micro-services, the more sure I am vanity solutions are everywhere. I also know because I've been responsible for a few vanity solutions myself.

Why does this matter? Firstly, it matters because wasting time on vanity solutions rather than important work can kill companies and teams before they have real, interesting problems (the kind of problems that come with getting users, and thus success). This will become clearer to the industry now money is no longer approximately free. Secondly, I suggest the avoidance of vanity solutions is essential to a truly rewarding career as a software engineer.

# How to tell if you have a problem

Let's use databases as an example. Relational databases have had just an amazing amount of investment. They work really, really, surprisingly well. ORMs make it pretty trivial to handle CRUD, and when your ORM has written a query that makes Facebook's terms of service look like a model of clarity, you have great tooling to figure out how to tune it and replace it with some hand-written SQL.

For a handful of giant tech companies, some years back, they couldn't handle some of their use cases. Not all - but some. So some folks tried out NoSQL. Important note - they then rolled this back and adopted Spanner, which gave application engineers back ACID. Anyhow, lots of people heard about NoSQL and heard: successful companies need NoSQL to handle their impressive scale! I want to be an engineer with impressive problems, if I adopt NoSQL my problems will be impressive! Of course, this isn't a conscious thought-process, very little of our most important thought processes are available to us (I'm unsure if this is a good or bad thing). After a few years later, folks who have no idea what ACID mean are using MongoDB for their startup's most important transactional data. I didn't know what ACID meant at that point in my career, but MySQL kept my code vaguely correct - just like PHP's garbage collection and web-frameworks meant dummies like me with a history degree could write a system that 30 years ago would take a big team of far cleverer folks writing C.

What was missing from the stories of "let's use MongoDB it scales" startup? A real problem. I've seen quite a few "oh god X doesn't scale" evolutions in databases. It involves:
* people being paged because the old system doesn't work
* low hanging fruit being picked
* still getting paged
* feelings of dread
* folks actually reading non-fun books like High Performance MySQL and really trying out the benchmark tools
* engaging database consultants who don't need to look up the arcane runes and misleading numbers that make `EXPLAIN` so ironic in older versions of MySQL
* proofs of concept with another database
* months of getting another database stood up with acceptable monitoring and alerting
* most of the rest of the old system remaining on MySQL

The final step? Satisfaction that a real problem was solved. Learning about use-cases the existing tool, in this case MySQL, might not handle. Importantly, the existing tool is often retained, because the new solution was _solving a problem_ with the existing tool: replacing the old _tool_ was not the goal.










