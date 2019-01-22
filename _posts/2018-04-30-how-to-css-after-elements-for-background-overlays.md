---
layout: post
title: How To&#58; Use CSS &#58;after pseudo-elements to create simple overlays
categories:
  - design
  - CSS
  - tutorial
featuredImg: /images/overlay-finished.jpg
featuredLarge: true
baseLayout: container--right
description: Use &#58;after elements to create the simplest HTML possible to render useful and fun overlays on top of background images. Then extend them with blend-modes!
grid-size: large
updated: 08 Aug, 2018
adSpace: 
  image: /images/cc-logo.png
  headline: Practical CSS Grid - Learn about this revolution in Web design!
  description: Whether you're new to CSS Grid or have played with it, finding practical examples of this new layout mechanism is the best way to learn it's power.  Sign up below for two hours of practical grid knowledge just for you!
  linkText: Start Learning Now!
  linkUrl: https://codecontemporary.com
---

<aside class="reference">
    <p>Looking for more uses of ::after and ::before? <a href="/blog/2018/08/07/top-3-uses-of-after-and-before-css-pseudo-elements/">Read my Top 3 Uses beyond the overlay</a></p>
</aside>

<figure style="position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%; margin-bottom: 1rem;">
        <iframe style="position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;" width="560" height="315" src="https://www.youtube.com/embed/SXQ9l0ScDEA?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    </figure>


More and more in web design, we find ourselves putting text on top of images. More often than not, this is a dangerous game. Images have dynamic color and lighting and text for the most part is one color. This is often a nightmare for readability and accessibility.

This means we want to introduce an overlay to sit between the image and the text. Sometimes this darkens the background image enough for readability. Other times it's a branding opportunity. Either way we need a simple CSS technique to introduce this sort of overlay.

Since I prefer not to introduce new markup for an embelishment, we'll use the CSS `::after` pseudo-element.

The process looks something like this:

1. Create the simplest HTML for your area
1. Use a `::before` or `::after` element to create your banner
1. Fix `z-index` issues caused by absolute positioning
1. Experiment with `mix-blend-mode` for fun and profit

{% include ad-space.html %}

### Step 1: All the markup you need, none of the bloat
<figure style="grid-column: 1 / 3; grid-row: span 2;"><img src="/images/overlay-starting-point.jpg" alt="Grid Love"></figure>

In a banner, all we really want is the banner's container and any content that banner needs to contain.


{% highlight html %}

<section class="banner">
    <h1>Hello World</h1>
</section>

{% endhighlight %}

In this example, we'll just utilize a section container and an `<h1>`. If you added more content, it could be siblings to the `<h1>` or you could place all of your content in a content container of some sort to do any positioning. 

A little CSS magic is happening here for the added height of the banner as well as the centering of the text. That's not important for this demo, but if you're curious, it exists in the CodePen.

### Step 2: Add the overlay element dynamically with ::after

Natively, CSS gives us the powerful `::before` and `::after` elements for adding stylistic content to the page that shouldn't affect markup.

By apply `::before` or `::after` to an element, you can insert a dynamic element into the DOM before or after the selected elements children.

One important note, all pseudo-elements require a `content` CSS property to display. In our case, this will just be a blank string.

<figure style="grid-column: 1 / 3; grid-row: span 2;"><img src="/images/overlay-somethings-not-right.jpg" alt="Grid Love"></figure>

{% highlight scss %}
.banner::after {
    content: ""; // ::before and ::after both require content
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(120deg, #eaee44, #33d0ff);
    opacity: .7;
}
{% endhighlight %}

Now we have an element that is full-width and -height. To do this, we utilize absolute positioning, as we don't want to affect the content flow of the document. 

We make the overlay slightly transparent utilizing the `opacity` property.

In this example, I chose a fun gradient, but you could use a simple background color or even another image to overlay.

### Step 3: Fix z-index issues

The keen-eyed observer would notice that something isn't quite right in the example. Our friendly overlay is covering not just the background image, but also the text in the banner.

By using absolute positioning, we've actually put the overlay on top of the stacking context of our banner. To fix this, your overlay and your content will need to have a `z-index` applied to them. I usually give the overlay a 1 and my content 100.

{% highlight scss %}
.banner::after {
    ...
    z-index: 1;
}
.banner > * {
    z-index: 100;
}
{% endhighlight %}


#### And with that we have a finished overlay.

<figure style="grid-column: 2 / 7;"><img src="/images/overlay-finished.jpg" alt="Grid Love"></figure>


## Bonus step: Advanced overlays with blend modes

<figure style="grid-column: 1 / 3; grid-row: span 5;"><img src="/images/overlay-with-blend-mode.jpg" alt="Grid Love"></figure>

I've been toying with background blend modes for a little while now, but it blew me away when I discovered `mix-blend-mode`. This allows a developer to blend multiple elements together!

Use `mix-blend-mode` on your overlay and you've got some fun new combinations to try out.

{% highlight scss %}
.banner::after {
    /* opacity: .7; */
    mix-blend-mode: color;
    mix-blend-mode: hue;
    mix-blend-mode: hard-light;
}
{% endhighlight %}

The support for various blend modes are pretty weak in the Microsoft browsers, but you can still use them today with clever progressive enhancement. If you want them to be built in Edge, you can [let Microsoft know about your passion here](https://wpdev.uservoice.com/forums/257854-microsoft-edge-developer?query=blend). 

Until that time, let's use `@supports` queries to make sure our code still respects our friends using Edge and IE. The above code removes the transparency from our overlay and lets the blend mode do it for us. Instead of removing it, let's negate it behind a support query.

{% highlight scss %}
.banner::after {
    opacity: .7;

    @supports (mix-blend-mode: hue) {
        opacity: 1;
        mix-blend-mode: color;
        mix-blend-mode: hard-light;
        mix-blend-mode: hue;
    }
}
{% endhighlight %}

This way in browsers that don't support blend modes, we get our average, but nice overlay and in browsers that do, we get some really neat effects on our banner.

Overlays should be simple and clean and never bloat your HTML with additional markup. This is one of my favorite uses of `::after` elements. It just makes so much sense.

If you want to play with the code in this tutorial, the CodePen is embedded below:

<iframe height='400' scrolling='no' title='CSS ::after element overlays' src='//codepen.io/brob/embed/bMqBgb/?height=265&theme-id=dark&default-tab=css,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%; grid-column: 1 / 7'>See the Pen <a href='https://codepen.io/brob/pen/bMqBgb/'>CSS ::after element overlays</a> by Bryan Robinson (<a href='https://codepen.io/brob'>@brob</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>