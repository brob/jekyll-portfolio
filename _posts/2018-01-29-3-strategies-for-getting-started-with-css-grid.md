---
layout: post
title: 3 Strategies for Getting Started with CSS Grid
categories:
  - development
  - grid
  - design
baseLayout: container--right
description: >-
  If you're wondering how to start with CSS Grid, here are three strategies for
  adopting it into your workflow.
grid-size: large
---
CSS Grid Layout has been in major browsers for a little less than a year now. Despite the excitement around it by people in the know, not everyone has jumped on board.

I understand. Despite its browser adoption happening in record time, we still live in an IE world sometimes.

While 2017 was the year of CSS Grid's browser adoption, 2018 will be the year of its developer adoption.

If you're wondering how to start, here are three strategies for adopting it into your workflow.

## Reduce Excessive Markup

Our appetite for better designs has increased in the past five years. With that -- and our reliance on old layout techniques -- we've seen an explosion in nested markup.

Take this simple promotional grid layout for example.

![Side-by-side comparison of a flex grid to a grid layout grid](/images/grid-comparison.jpg)

To make this happen, we have to introduce a slew of markup to add rows inside of rows.

{% highlight html %}

<section class="flexgrid">

```
<div class="left-side">
    <div class="item">1</div>
</div>

<div class="right-side">
    
    <div class="right-top">
        <div class="item">2</div>
    </div>

    <div class="right-bottom">
        <div class="item">3</div>
        <div class="item">4</div>
    </div>

</div>
```

</section>

{% endhighlight %}

Keeping track of the nesting is a headache. It also fights against clean, semantic HTML. 

Let's take the same design and build out the HTML we need for CSS Grid.

{% highlight html %}

<section class="grid">
    <div class="grid__item">1</div>
    <div class="grid__item">2</div>
    <div class="grid__item">3</div>
    <div class="grid__item">4</div>
</section>

{% endhighlight %}

With one parent and four direct children, we can pull off uneven rows and columns. 

The promise of Grid Layout is the promise of semantic markup and true separation of concerns.

[View my CodePen of the layouts side-by-side](https://codepen.io/brob/pen/GQRXMe?editors=0100)

## **Build a Multi-Column Form**

While you're simplifying your markup, you might as well take a look at upping your form game.

Sure a one-column form will get the job done, but why not add a little spice with multiple columns. 

img

Instead of setting up rows of content inside of a form, tell the form to be two columns and let certain areas stretch.

In this example, we want the street address and comment box to have more room for comfortable writing.

By creating a "fullwidth" class that uses grid-column: span 2, we can have a single input change its layout. The other inputs that can be smaller remain side by side.

{% highlight css %}
.form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
}
.fullwidth {
    grid-column: span 2;
}
{% endhighlight %}

[View the example on CodePen](https://codepen.io/brob/pen/BYyrjw?editors=1100)

## **Use Grid Layout instead of the Bootstrap or Foundation Grid**

## **Bonus: Make a Responsive Grid with No Media Queries**
