# 💼 [jobber](https://jobber.mihir.ch)

> Super simple API to fetch job listings from popular job boards (Ashby, Greenhouse, Lever, BambooHR)

## Usage

**Base URL**: [`https://jobber.mihir.ch`](https://jobber.mihir.ch)

### `GET /:jobBoard/:companySlug`

#### Params

| Name          | Type     | Description                     |
| ------------- | -------- | ------------------------------- |
| `jobBoard`    | `string` | Job board to fetch jobs from.   |
| `companySlug` | `string` | Company slug to fetch jobs for. |

##### Supported job boards

- `ashby`
- `greenhouse`
- `lever`
- `bamboohr`
- `workable`

#### Response

```json
[
  {
    "title": "Customer Success Manager",
    "location": "Americas",
    "link": "https://jobs.ashbyhq.com/linear/5a3e5c82-7468-49eb-bb2d-d5f9c3d03041"
  },
  {
    "title": "Lead Product Designer",
    "location": "Americas",
    "link": "https://jobs.ashbyhq.com/linear/f30b8aee-b810-4262-9543-ab0987cb3c96"
  }
]
```

**Example**: [`https://jobber.mihir.ch/ashby/linear`](https://jobber.mihir.ch/ashby/linear)

## Development

**Preqrequisites:**

1. [Wrangler](https://developers.cloudflare.com/workers/wrangler/get-started/#install)
2. [Recommended] Bun (Node.js runtime)

**Install and setup:**

```bash
git clone git@github.com:plibither8/workers-bun-hono-template
cd workers-bun-hono-template
bun install
```

**Development:** `wrangler dev`

**Production:** `wrangler publish`

## License

[MIT](LICENSE)
