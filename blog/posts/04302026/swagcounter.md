# count visits on your website **EASILY** with my shitty project

<p><b>swagcounter</b> is a small little project i made in node.js that allows you to embed a script onto your website and it starts to record stuff like general all time visits, unique visits, and on site visits.</p>
<p>though i wouldn't completely say it's fully ready for other people to use, there's some bugs that i need to fix soon such as:</p>
<ul>
    <li>counting unique visits even if you're not (looks like after a while, it'll forget)</li>
    <li>very slow (refresh counts)</li>
</ul>
</small>that's all i could find for now but if you find anything else, please contact me (email is in the <a href="/about">about</a> page)</small>

--- 

# how to use swagcounter 

<ol>
  <li>
    <b>get the tracker script</b><br>
    <p>copy the link below:</p>
    <pre><code>https://sc.squirrelz.xyz/track.js?key=changethisforyou</code></pre>
    <p>change the <code>changethisforyou</code> to what you want to use to track like mine is <code>squirrel</code> cause obv my site is squirrelz.xyz</p>
  </li>
  <li>
    <b>embed the script onto your site</b>
    <p>just embed the script onto your website and all the pages you want to track and stuff</p>
    <pre><code>&lt;script src="https://sc.squirrelz.xyz/track.js?key=changethisforyou"&gt;&lt;/script&gt;</code></pre>
  </li>
  <li>
    <b>use api to show shit</b>
    <p>the api url is:</p>
    <pre><code>https://sc.squirrelz.xyz/api/v1/stats?key=yourthing</code></pre>
    <p>the json for the api is very very simple, for example if i put squirrel, this is the output</p>
    <img src="/assets/blog/04302026/apiexample.png">
    <p>so the only thing you need to do is really just stuff to show your stats and all dat. here's mine that's on my index</p>
    <img src="/assets/blog/04302026/myexamplething.png">
  </li>
</ol>

---
<br>
<p>well that's really all i have to say about swagcounter, it's still being worked on so don't expect it to be the best thing ever, i just want to try to make a small api that allows static websites to have a cool visit counter too!!</p>

<center><small>very big thank you to <a href="https://nomaakip.xyz">nomaakip</a> for hosting swagcounter for me!! go check out her site, it's very peak!!</small></center>