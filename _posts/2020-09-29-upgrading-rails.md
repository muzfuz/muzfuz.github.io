---
title: "My Year of Ruby on Rails Upgrades"
date: 2020-09-29T00:00:00-00:00
excerpt_separator: "<!--more-->"
categories:
  - ruby
  - rails
tags:
  - ruby
  - rails
---


I've spent a significant chunk of 2020 upgrading a legacy `Ruby on Rails v3.2` monolith (we've just about hit `5.0` as of September), so I thought it would be worth sharing a quick guide on best practices and approaches.

First off, to get the obvious out of the way, you should always try to be on the latest version of Ruby and Rails.  It might feel like a lot of time spent, but in the long run it will cost you less money to just stay up do date.  Don't just take my work on that of course - [Eileen Uchitelle at GitHub has a great blog series on this topic](https://github.blog/author/eileencodes/).

So here's my general guidelines that I've found work best when upgrading:

## Keep your Ruby version up to date!

Super important, and worthy of its own post - just please don't neglect this!

## Upgrade one minor version at a time

Do not attempt to go from Rails `3.2` to `4.2` right away. Each minor version has a series of breaking changes inside it that you will want to address.  Move systematically from `3.2 -> 4.0 -> 4.1 -> 4.2`, with each one being a separate release.

## Deprecation warnings are your friend

Deprecation warnings tell you what will be broken if you attempt an upgrade of your app in its current state. Take advantage of that - someone has done the bulk of the hard work for you, all you need to do is implement the changes the warnings are telling you to make!

## You'll likely have a mess of gems to update first

If you've not been upgrading your gem dependencies regularly (and you really, _really_ should be), then you probably won't be able to `bundle update rails` anytime soon.

This step can be annoying, as figuring out what is broken and why can sometimes require a fair bit of digging around actual code repositories (which led to [this change](https://github.com/brianmario/mysql2/pull/1131) I made to the `mysql2` documentation), reading your `Gemfile.lock` file, and then finding exactly the right incantation of `bundle update $GEM1 $GEM2 $GEM3` to invoke.

My best advice here is that if you get stuck, try to pair with someone who can talk through this problem with you.

## Use several small commits that you release independently

Every upgrade has the following steps:
1. Fix deprecation warnings.
1. Upgrade outdated gems that will otherwise block a Rails upgrade.
1. Implement changes listed in the Rails Upgrade Guide.
1. Upgrade the Rails gem(s) and fix broken tests.

_Each one of those should be a unique release!!!_

Steps 1-3 are relatively easy to do and require little manual testing, if any - but they generally require you to make a lot of code changes in many files, so they result in big pull requests.

Step 4 will take the bulk of your time, but paradoxically it will also require the fewest code changes.  If you've released steps 1-3 to production before attempting this step, then rebasing and staying on top of latest changes will not be difficult - which will make your development go faster.

## Fix Tests in the Right Order

First fix Model tests, then Controller tests, and do any View or Feature tests at the end - this order matters because by fixing things deeper in the call stack first, you'll be able to squash 90% of problems with the view layer before even having to think about it.

## Try to release database migrations separately

Not all upgrades will required database changes, though most of them will change your schema.rb a fair bit. If you do need to write a migration, try to release it separately before attempting to upgrade the Rails gem itself, as it will help de-risk the release and simplify rolling back, should you need to.

## Do things the Rails way

Don't try to re-invent what Rails is doing - this way leads to madness.  By the same token, if you find work done by a previous developer that re-implements or even monkeypatches Rails, do your best to get rid of that work _before attempting the upgrade_. Again, this might take a while, but in the long run it will save you weeks of work.

## Rails has become less permissive over time

In my experience, the majority of test failures come about because of changes in ActiveRecord or ActiveSupport. Rails 2 and 3 were very liberal about allowing you to pass in whatever object type you want into core methods, but increasing versions of Rails have become less permissive.  This is a good thing as it means your code is more reliable (you'll find bugs you didn't know existed), but it also means you'll probably have a slew of cases where code that has worked for years suddenly starts blowing up your test suite.

My best advice here is prepare yourself mentally to empathize with what the Rails maintainers are trying to do, and make changes to your application code accordingly.

---

There's nothing magical or particularly difficult about upgrading Rails in my experience - it's mostly about knowing which tools to reach for at which moment of time, and giving yourself the space to get into the mindset of empathizing with the library code you are trying to run your application on.

I'm happy to answer any questions on the above via [Twitter](https://twitter.com/mazin_power) or email :)