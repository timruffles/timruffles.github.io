title: How much iOS can you learn in a day
date: 2012/03/25
body: |
  
  <div class="summary">
    <h3>Summary</h3>
    <p>In one day, starting with 0 Objective C/iOS skills, what can you make? With the help of O'Reilly's <a href="http://my.safaribooksonline.com/9781449327088/" title="Programming iOS">Programming iOS</a>, the quick <a href="http://cocoadevcentral.com/d/learn_objectivec/">Objective C guide</a> and <a href="http://www.raywenderlich.com/5138/beginning-storyboards-in-ios-5-part-1">Matthijs Hollemans's</a> guide to iOS, it's quite plausible to have built a simple "add items to a list" app by the day's end. Kudos Apple!</p>
  </div>

  I want to do a quick app that helps you achieve your goals. Mobile seemed the only sensible way to deliver a goal tracking application, as when you've just finished your run it'd be nice to tick it off then and there.
  
  ## Why not HTML5?
  
  I had a look for HTML5 frameworks but all of their UIs seemed sluggish and ugly. I've previously made a performance focussed mobile framework for an unreleased game with [Picklive](http://picklive.com) which ran smoothly, but this was only because it didn't have to emulate scrolling (all views fit the screen, no table views). Since this app would have lots of lists, it seemed like 90% of the work would be reimplementing (badly) views iOS gave you for free. I decided to take a peek to see how quickly I could get up to speed.
  
  ## Memory management: in 2012?!
  
  The reason I persevered is probably `@autorelease`. This rather magic compiler addition allows you to get your hands dirty without being faced with the additional yak-shaving of memory management piled top of learning a new language and the rather sizeable Cocoa APIs. It's a new feature of iOS 5, and Apple seem to have done a great job.
  
  ## XCode
  
  I'm normally a vim user, so booting up the IDE was a bit of a shock. That said, it's a lot faster than I remember Eclipse or NetBeans, and has Apple slickness aplently.
  
  The Storyboard is impressive. Drag to bind UI actions to transitions, or generate code that obtains references to UI widgets by dragging. Designing interfaces is also drag'n'drop, with pallets to modify fonts, colours etc. It's great. I've done a fair bit of work with Flex in the past and I enjoyed this approach a lot more. Flex had an additional MXML representation which was used for data binding and config. It felt a lot clunkier, another layer of semi-code into the mix. Having all the details hidden away in the .board file is nice, and you simply drag to create callbacks for the actions. 
  
  That said, I've only done extremely simply work so far, and perhaps there are monsters lurking.
  
  ## Objective C
  
  The language is a bit ugly at first, but if you take 10 minutes to carefully peruse the message passing the biggest obstacle is overcome. I made 2.5k words of notes on the language features and API so there's a fair bit to learn, but Apple has done a great job. You get proper enumerators rather than old-skool `for(int i ...)` loops, `object.property` notation (not silly `object->property`).
  
  ## Progress
  
  So all in all I'm dead impressed. It was pretty steady going to get my head around grabbing the ViewControllers, wiring up events and segues (transitions) and creating and sharing a simple mutable array to store the objects.
  
  XCode  hides a lot of verbosity and boiler plate from you. I'd much prefer to read complicated or algorithmic code in another language (take your pick of Haskell, Ruby, Python, Coffeescript), but Objective C is OK. Its message-passing nature has a nice quirk in making methods self-documenting in the extreme. Message names include a colon for each parameter, so `makeTriple:::`. It's nice to give hints to the arguments, so `colorWithRed: (int) red green: (int) green blue: (int) blue`.
  
  I can't see any barriers to getting the app done fast, and, best of all, I'm spending all of my time implementing the app rather than re-implementing generic UI elements. Yay! I'm planning to rewrite what I've got with CoreData, and then press on with integrating it with the Rails-based backend.
  
  ## One day's work

  <iframe width="420" height="315" src="http://www.youtube.com/embed/W9CZ9CrtSBo" frameborder="0" allowfullscreen></iframe>
  
  ### Git log
  
  <script src="https://gist.github.com/2200613.js?file=ios%20day%20one.log"></script>