# Latency

Latency is an essential non-functional requirement. It plays a crucial role in shaping the user experience and overall system performance. But what is latency, exactly? Simply put, latency refers to the delay that occurs from the time a system receives a request until it responds to that request.

## Latency: The Basics
In the simplest terms, latency is a delay. In system design, it is a measure of the time it takes for a bit of data to travel from one place to another in a network. The units for measuring latency are usually milliseconds (ms) or microseconds (µs).

High latency leads to a slow and inefficient system, which can negatively impact user satisfaction, particularly in real-time applications like video streaming, online gaming, or high-frequency trading, where delays of even a few milliseconds can be detrimental.

## Understanding Latency and Response Time
A key part of understanding latency is recognizing its relationship to response time. From a client's perspective, the total latency (also called response time) consists of two main components:

- Network latency: This refers to the time taken for a request and the subsequent response to travel across the network - from the client's machine to the server, and then back again. This is also known as time spent 'on the wire'.
- Server-side latency: This is the time taken by the server to understand the request, process it, and prepare a response.

So, when we talk about total latency or response time, we are essentially adding up the network latency and the server-side latency.

## Factors Contributing to Latency
As mentioned above, the total latency observed by the client is the sum of network latency and server-side latency. The key to managing latency, therefore, lies in understanding and optimizing these two factors:

- Network Latency: It’s a measure of the time taken for a packet of data to get from one point to another. Network latency could be affected by factors such as the physical distance the data has to travel, the number of nodes it has to pass through, and the speed of the network.

- Server-Side Latency: This represents the time taken by a server to process a request. The processing could involve calculations, data retrieval, or various other tasks. Server-side latency could be influenced by factors such as server hardware, software efficiency, and the complexity of the requested task.

## Measuring Latency Using Percentiles

Typically, latency is measured by percentiles, rather than averages, to provide a more accurate picture of the user experience. The 50th percentile (often referred to as the median) gives the latency experienced by the 'average' user. Higher percentiles, such as the 95th or 99th, provide insight into the latency experienced by the 'worst-off' users. These 'worst-case' latency numbers are often the focus when optimizing system performance. These are called “tail latency”.

- 50th percentile latency (aka median latency): The maximum latency (typically measured in seconds or milliseconds) for the fastest 50% of the requests.

- 99th percentile latency: The maximum latency (typically measured in seconds or milliseconds) for the fastest 99% of the requests.

Measuring latency using percentiles is essential because averages are misleading in distributed systems. An average (mean) can be skewed by a few extremely fast or slow requests, hiding the "pain" felt by a significant portion of your users.

### Why Averages Lie
Imagine you have 10 users. 9 of them experience a lightning-fast latency of 100ms, but 1 user experiences a massive lag of 10,000ms (10 seconds) because of a database timeout.

The Average: 1,090ms.

The Reality: The average suggests everyone is having a "meh" experience (1 second), but actually, 90% are happy and 10% are completely broken.

Percentiles tell you exactly how many people are suffering.

### Breakdown of the Key Percentiles
#### P50 (The Median)
If you sort all your request times from fastest to slowest, the P50 is the middle value.

Meaning: 50% of your users see a response time at or better than this number.

Use case: Knowing what the "typical" experience looks like

## P99 means that 99 out of 100 requests are faster than that specific time.

If you have 100 requests and your P99 is 500ms, it means:

- 99 requests finished in less than 500ms.

- Only 1 request was slower than 500ms.

It’s essentially the speed limit that almost everyone stays under.
#### P95 and P99 (The Tail Latency)
These are the "outliers" or the "worst-case" scenarios.

P99: If your P99 is 2 seconds, it means 1 out of every 100 requests takes at least 2 seconds.

Why focus here? Users at the 99th percentile are often your "heaviest" or most important users (e.g., a customer with a massive shopping cart that takes longer to process). If the P99 is bad, your most valuable users are the ones most likely to leave.

### Measuring Latency: Why Percentiles Matter

In systems engineering, we ignore the "Average" and focus on "Percentiles" to understand the true user experience.

| Metric | Name | Definition |
| :--- | :--- | :--- |
| **P50** | Median | 50% of requests are faster than this. The "typical" experience. |
| **P95** | 95th Percentile | Only 5% of requests are slower than this. A good measure of overall quality. |
| **P99** | 99th Percentile | The "Tail Latency." Only 1% of requests are slower. This represents your most frustrated users. |

#### Why focus on Tail Latency (P99)?
1. **The Power User Problem:** Users with the most data (and often the most value) hit the P99 most often.
2. **Compound Latency:** In microservices, one slow P99 service can "poison" the entire chain, making the final response slow for everyone.
3. **SLA Guarantees:** Service Level Agreements are almost always written as: *"99% of requests shall be faster than 500ms."*

## Why not just use 100% (Max Latency)?
You might wonder, "Why not just look at the slowest person (the 100th percentile)?" The problem is that the Max Latency is often an "unlucky" fluke—like a user's phone losing signal or a server restarting. If you optimize for the absolute worst request, you're chasing "noise." P99 is the "useful" worst-case scenario; it helps you find real architectural bottlenecks that affect the unluckiest 1% of your users without being distracted by one-off glitches.

## Real-World Math Example
If your Faridabad office is tracking 1,000 requests for a local web service:

- Sort all 1,000 request times from fastest to slowest.

- Count to the 990th request in that list.

- The time of that 990th request is your P99.


### The "Fan-Out" Effect: The Real Reason P99 is Scary

In modern microservices architectures, focusing on the 99th percentile isn't just about being a perfectionist—it is a mathematical necessity.



#### 1. The Math of Probabilities
When a single user request hits your gateway, it often triggers multiple "sub-requests" to different backend services (e.g., fetching a profile, loading friends, getting latest posts, checking notifications). 

If your page needs to wait for **100 sub-requests** to finish before it can show the user anything, and each of those services has a **1% chance** of being slow (its P99), the math works against you:

$$1 - (0.99)^{100} \approx 0.63$$

#### 2. The Result: 63% Pain
Even though every single individual service is "fast" for 99% of its calls, **63% of your total users** will experience at least one slow sub-request. 



#### 3. Why it Matters
"Ignoring the 1%" on a single microservice sounds small, but in a complex system, that 1% "snowballs." This is why engineers obsess over **Tail Latency**:
* **The Bottleneck:** The final response is only as fast as the *slowest* sub-request.
* **Compound Latency:** As you add more microservices, the probability of a fast user experience drops exponentially unless you optimize the P99 of every individual component.

---

| Metric | Single Service View | User's End-to-End Experience |
| :--- | :--- | :--- |
| **P99** | Only 1 in 100 requests is slow. | **63% of users** feel the lag. |
| **P99.9** | Only 1 in 1,000 requests is slow. | **~9.5% of users** feel the lag. |

If you have exactly 100 people ranked from fastest to slowest:

- P99 is the 99th person.

- The 100th person is the "Outlier" (the 1%).

If you have 100 people:

- You pick the 99th person to be your "P99 Line."

- Anyone slower than that (the 100th person) is in the "1% tail."

In P99, we "discard" the slowest 1% of the data.

Think of it like a filter. You are telling your monitoring system: "Show me the absolute worst-case scenario, but ignore the bottom 1% because they are probably just 'noise' (accidents, bad Wi-Fi, or crashes)."

## The Risk: When is ignoring 1% a bad thing?
While we ignore that 1% in our charts to keep them clean, we don't ignore them in real life.

If you have 1 million users in Faridabad using your app, that "ignored 1%" is actually 10,000 people. If those 10,000 people are all your "Big Spenders" or "Admin Users," your business is in trouble even if your P99 chart looks "good."

### Why we "Ignore" the 1% in P99

| Fact | Explanation |
| :--- | :--- |
| **The Action** | We sort all requests and delete the slowest 1% from the calculation. |
| **The Goal** | To remove "Noise" (one-off errors that aren't the server's fault). |
| **The Result** | You get a stable "Maximum" time that actually represents your system's performance. |
| **The Danger** | If your P99 is 1 second, but your P100 is 60 seconds, 1% of your users are experiencing a "dead" app. |
## Tail Latency
Tail latency refers to the high latency experienced in the worst-case scenarios, typically measured at the 99th, 99.9th, or even 99.99th percentile of a distribution.

In other words, if you were to measure the latency of thousands or millions of operations and plot them in ascending order, tail latency would represent the longest delays at the very end, or "tail," of this distribution.

In system design, tail latency is an essential metric because it often correlates with the worst user experiences. While average latency gives us a general idea of system performance, it doesn't account for occasional slowdowns that can have significant effects. This is why engineers focus not only on reducing average latency but also on minimizing tail latency.

Reducing tail latency (the high percentiles of latency) is a critical goal in system optimization, as it can significantly enhance the user experience. Tail latency refers to the slowest requests, which are often the most noticeable and disruptive to users. However, reducing tail latency can be quite challenging and often requires substantial effort and resources.

For instance, tackling tail latency might require optimizing server software, upgrading server hardware, or even altering system architecture. In some cases, it might involve improving load balancing or implementing better failover strategies to handle peak traffic or outages.

Balancing the effort to reduce tail latency with the benefits it brings is a critical aspect of system design. System designers need to consider the trade-offs involved and choose strategies that provide the best overall performance improvement for the resources available.


## Managing Latency
Managing and reducing latency is crucial for maintaining an efficient and effective system. Here are some strategies system designers use:

- Use of CDN (Content Delivery Network): CDNs store copies of data at multiple locations worldwide to reduce the distance data must travel, thereby reducing latency.
- Load Balancing: By distributing network or application traffic across multiple servers, load balancers can help reduce congestion, improving response times and reducing latency.
- Caching: By storing frequently accessed data closer to the user, caches can significantly reduce the time it takes to retrieve that data.
- Choosing Appropriate Data Center Location: For cloud services, choosing a data center that's physically closer to the majority of users can help reduce latency. For example, if you are serving users in the US, you would want to pick your data center in San Francisco instead of Singapore.





















