
## Installation

### 1. Obtain a FAQs Bot ID

If you don't have a FAQs Bot, create one [here](https://www.datacakes.ai/autofaqs) or run the command below, replacing `MY_URL` with your chosen url: 
```
curl -H 'Content-Type: application/json' -X POST 'https://bots.datacakes.ai/create-faqs-bot' -d '{"url": "MY_URL"}'
```

### 2. Add custom element to your source code.

On your site, add the tags below to your site, replacing `MY_BOT_ID` with your FAQs Bot ID:
```
<script type="module" src="https://cdn.jsdelivr.net/gh/datacakes-ai/datacakes-widget/dist/faqs-datacake.js"></script>
<faqs-datacake id="datacake" botid="MY_BOT_ID"></faqs-datacake>
```
