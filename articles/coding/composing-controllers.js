title: Composing Angular controllers
date: 2015/06/05
draft: true
body: |

  AngularJS controllers have a habit of becoming rather bloated. What do you do with bloated objects? Cut them up.

  ## Method 1: widget controllers

  If the controllers are working on individual widgets then the best approach is to divide them up by responsibility. As an example, if you considered how to implement Gmail in Angular you'd want to avoid one giant controller handling commands from the search, inbox, chat etc.

  Instead you'd have many small controllers, each handling one part of the UI and interacting:

  <img src="images/articles/small-controllers/angular-controller-teams.png" alt="angular controller refactoring - controller teams">

  Using Angular's controller-as syntax allows you to make interactions between these controller teams nice and explicit:

  ```html
  <div ng-controller='InboxCtrl as inboxCtrl'>
    <nav ng-controller='NavCtrl as navCtrl'>
      <a ng-click="inboxCtrl.select('primary')">Primary</a>
      <a ng-click="inboxCtrl.select('social')">Social</a>
    </nav>
    <div ng-controller='MessageCtrl as msgCtrl'>
      <ul>
        <li ng-repeat="message in inboxCtrl.mailbox.messages">
          {{ message.from }} - {{ message.subject }}
        </li>
      </ul>
    </div>
  </div>
  ```

  ## Method 2: componentised controllers

  The idea above can be taken to the next level by using directives

  ## Method 2: composite controllers

  While `ng-controller` is the standard way of creating a controller, you can just as easily create them yourself. These can be `POJO` - plain ol' Javascript objects - or full Angular controllers if you want to be consistent, or support both manual contstruction and `ng-controller`.

  For instance, in the below UI we have lots of components that are good candidates for widget controllers
